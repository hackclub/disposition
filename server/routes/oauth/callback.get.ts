import { rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { eq } from "drizzle-orm";

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