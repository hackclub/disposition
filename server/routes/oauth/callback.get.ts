import { addresses, rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { eq } from "drizzle-orm";
import { users } from "~~/db/schema";
import { getCachetInfo } from "~~/server/utils/cachet"
import { generateUsername } from "~~/server/utils/user/user";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { code, state } = getQuery(event);
    const savedState = getCookie(event, "oauth_state");
    const rsvpState = getCookie(event, "oauth_rsvp") === "true";
    deleteCookie(event, "oauth_rsvp");
    deleteCookie(event, "oauth_state");

    if (!code || !state || state !== savedState) {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid OAuth State"
        })
    }

    // get bearer token
    const tokens = await $fetch<{ access_token: string; refresh_token: string }>(
        "https://auth.hackclub.com/oauth/token",
        {
            method: 'POST',
            body: {
                client_id: config.hackclub.clientId,
                client_secret: config.hackclub.clientSecret,
                redirect_uri: `${config.public.baseUrl}/oauth/callback`,
                code,
                grant_type: "authorization_code",
            }
        }
    );

    // get info about user & set it to the user session
    const response = await $fetch<{
        identity: {
            id: string;
            first_name: string;
            last_name: string;
            primary_email: string;
            slack_id: string;
            ysws_eligible: boolean;
            verification_status: string;

            birthday?: string,
            legal_first_name?: string,
            legal_last_name?: string,
            phone_number?: string,
            addresses?: {
                id: string,
                first_name: string,
                last_name: string,
                line_1: string,
                line_2: string,
                city: string,
                state: string,
                postal_code: string,
                country: string,
                phone_number: string,
                primary: boolean
            }[]
        };
        scopes: string[];
    }>("https://auth.hackclub.com/api/v1/me", {
        headers: {
            Authorization: `Bearer ${tokens.access_token}`
        }
    });

    const identity = response.identity;
    const primaryAddress = identity.addresses?.find((address) => address.primary);

    await setUserSession(event, {
        user: {
            id: identity.id,
            firstName: identity.first_name,
            lastName: identity.last_name,
            email: identity.primary_email,
            slackId: identity.slack_id,
            yswsEligible: identity.ysws_eligible,
            verificationStatus: identity.verification_status,

            birthday: identity.birthday ? new Date(identity.birthday) : undefined,
            // legalFirstName: identity.legal_first_name,
            // legalLastName: identity.legal_last_name,
            // archer told me to use the legal name from the primary address so here it is
            legalFirstName: primaryAddress?.first_name,
            legalLastName: primaryAddress?.last_name,

            phoneNumber: identity.phone_number,
            addresses: identity.addresses?.map((address) => ({
                id: address.id,
                firstName: address.first_name,
                lastName: address.last_name,
                line1: address.line_1,
                line2: address.line_2,
                city: address.city,
                state: address.state,
                postalCode: address.postal_code,
                country: address.country,
                phoneNumber: address.phone_number,
                primary: address.primary,
            })),
        },
        secure: { hcRefreshToken: tokens.refresh_token }, // not exposed to client
    })

    // create or update user row
    const [existing] = await db.select({ username: users.username }).from(users).where(eq(users.hcaId, identity.id));

    // we have to get the username, fancy style.
    // i base the username off of the slack display name
    // and then add numbers to it if those alr exist in the db
    // only generated for new users so existing usernames don't change on every login
    let username = existing?.username;
    if (!username) {
        const cachetInfo = await getCachetInfo(identity.slack_id);
        username = await generateUsername(cachetInfo.displayName);
    }

    const userFields = {
        email: identity.primary_email,
        slackId: identity.slack_id,
        firstName: identity.first_name,
        lastName: identity.last_name,

        yswsEligible: identity.ysws_eligible,
        verificationStatus: identity.verification_status,

        birthday: identity.birthday,

        // archer told me to use the legal name from the primary address so here it is
        legalFirstName: primaryAddress?.first_name,
        legalLastName: primaryAddress?.last_name,
        phoneNumber: identity.phone_number,
    };

    await db.insert(users)
        .values({ hcaId: identity.id, username, ...userFields })
        .onConflictDoUpdate({ target: users.hcaId, set: userFields });

    if (identity.addresses) {
        // peep existing addies and then add the rest
        Promise.all(identity.addresses.map(async address => {
            const [existing] = await db.select().from(addresses).where(eq(addresses.id, address.id));

            if (existing) { // people update their addresses too
                if (existing.firstName != address.first_name ||
                    existing.lastName != address.last_name ||
                    existing.line1 != address.line_1 ||
                    existing.line2 != address.line_2 ||
                    existing.city != address.city ||
                    existing.state != address.state ||
                    existing.postalCode != address.postal_code ||
                    existing.country != address.country ||
                    existing.phoneNumber != address.phone_number ||
                    existing.primary != address.primary // im trusting that hca only lets you set ONE primary address
                ) {
                    await db.update(addresses).set({
                        id: address.id,
                        user: identity.id,
                        firstName: address.first_name,
                        lastName: address.last_name,
                        line1: address.line_1,
                        line2: address.line_2,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postal_code,
                        country: address.country,
                        phoneNumber: address.phone_number,
                        primary: address.primary
                    }).where(eq(addresses.id, address.id));
                    return;
                }
            } else {
                const insert: typeof addresses.$inferInsert = {
                    id: address.id,
                    user: identity.id,
                    firstName: address.first_name,
                    lastName: address.last_name,
                    line1: address.line_1,
                    line2: address.line_2,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postal_code,
                    country: address.country,
                    phoneNumber: address.phone_number,
                    primary: address.primary
                }

                await db.insert(addresses).values(insert); // just pray that it plays nice :)
            }
        }))
    }

    // insert rsvp if needed
    if (rsvpState) {
        await db.insert(rsvps).values({
            hcaId: identity.id,
            slackId: identity.slack_id,
            email: identity.primary_email,
            name: `${identity.first_name} ${identity.last_name}`,
            yswsEligible: identity.ysws_eligible,
            verificationStatus: identity.verification_status,
        }).onConflictDoNothing();
    }

    return sendRedirect(event, '/');
});