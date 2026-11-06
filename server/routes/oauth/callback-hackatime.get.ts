import type { H3Event } from "h3";
import { eq } from "drizzle-orm";
import { users } from "~~/db/schema";

export default defineEventHandler(async event => {
    try {
        return await callback(event);
    } catch (error) {
        return sendAuthError(event, error);
    }
});

async function callback(event: H3Event) {
    const session = await requireUserSession(event);

    const [existing] = await db.select().from(users).where(eq(users.hcaId, session.user.id));
    if(!existing) throw createError({
        statusCode: 401,
        statusMessage: "User does not exist on database"
    })

    const config = useRuntimeConfig();
    const { code, state, error } = getQuery(event);
    const savedState = getCookie(event, "hackatime_oauth_state");
    deleteCookie(event, "hackatime_oauth_rsvp");

    if(!code || !state || error) {
        return sendRedirect(event, '/'); // user denied app. oh well!
    }

    if (state !== savedState) {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid OAuth State"
        })
    }

    // get bearer token
    const tokens = await $fetch<{ access_token: string; }>(
        "https://hackatime.hackclub.com/oauth/token",
        {
            method: 'POST',
            body: {
                client_id: config.hackatime.clientId,
                client_secret: config.hackatime.clientSecret,
                redirect_uri: `${config.public.baseUrl}/oauth/callback-hackatime`,
                code,
                grant_type: "authorization_code",
            }
        }
    );

    // store oauth token on db
    await db.update(users).set({
        hackatimeToken: tokens.access_token
    }).where(eq(users.hcaId, session.user.id));

    // that's pretty much all we need
    return sendRedirect(event, '/');
}