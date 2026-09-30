import { rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { code, state } = getQuery(event);
    const savedState = getCookie(event, "oauth_state");
    const rsvp = getCookie(event, "oauth_rsvp");
    if(rsvp) deleteCookie(event, "rsvp");
    deleteCookie(event, "oauth_state");

    if (!code || !state || state !== savedState) {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid OAuth State"
        })
    }

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

    const response = await $fetch<{
        identity: {
            id: string;
            first_name: string;
            last_name: string;
            primary_email: string;
            slack_id: string;
            ysws_eligible: boolean;
            verification_status: string;
        };
        scopes: string[];
    }>("https://auth.hackclub.com/api/v1/me", {
        headers: {
            Authorization: `Bearer ${tokens.access_token}`
        }
    });

    const identity = response.identity;
    await setUserSession(event, {
        user: {
            id: identity.id,
            name: `${identity.first_name} ${identity.last_name}`,
            email: identity.primary_email,
            slackId: identity.slack_id,
            yswsEligible: identity.ysws_eligible,
            verificationStatus: identity.verification_status
        },
        secure: { hcRefreshToken: tokens.refresh_token }, // not exposed to client
    })

    if (rsvp && rsvp == "true") {
        const existing = await db
            .select()
            .from(rsvps)
            .where(eq(rsvps.hcaId, identity.id))
            .limit(1);

        if (existing.length > 0) {
            setResponseStatus(event, 409);
            return { message: "RSVP already exists" };
        }

        const rsvp: typeof rsvps.$inferInsert = {
            hcaId: identity.id,
            slackId: identity.slack_id,
            email: identity.primary_email,
            name: `${identity.first_name} ${identity.last_name}`,
            yswsEligible: Number(identity.ysws_eligible),
            verificationStatus: identity.verification_status
        };

        await db.insert(rsvps).values(rsvp);
    }

    return sendRedirect(event, '/');
});