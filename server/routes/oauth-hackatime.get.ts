export default defineEventHandler(async event => {
    await requireUserSession(event); // needtabe logged in with hca to auth hackatime!!
    const config = useRuntimeConfig();
    const state = crypto.randomUUID();

    setCookie(event, "hackatime_oauth_state", state, {
        httpOnly: true, secure: true, sameSite: "lax", maxAge: 600
    });

    const query = getQuery(event);

    const url = new URL("https://hackatime.hackclub.com/oauth/authorize");
    url.searchParams.set("client_id", config.hackatime.clientId);
    url.searchParams.set("redirect_uri", `${config.public.baseUrl}/oauth/callback-hackatime`);
    url.searchParams.set("response_type", "code"); 
    url.searchParams.set("scope", "profile read");
    url.searchParams.set("state", state);

    if (query.loginHint && typeof query.login_hint === "string") url.searchParams.set("login_hint", String(query.loginHint));
    if (query.rsvp === "true") {
        setCookie(event, "oauth_rsvp", String(query.rsvp), {
            httpOnly: true, secure: true, sameSite: "lax", maxAge: 600
        });
    }

    return sendRedirect(event, url.toString());
})