export default defineEventHandler((event) => {
    const config = useRuntimeConfig();
    const state = crypto.randomUUID();

    setCookie(event, "oauth_state", state, {
        httpOnly: true, secure: true, sameSite: "lax", maxAge: 600
    });

    const query = getQuery(event);

    const url = new URL("https://auth.hackclub.com/oauth/authorize");
    url.searchParams.set("client_id", config.hackclub.clientId);
    url.searchParams.set("redirect_uri", `${config.public.baseUrl}/oauth/callback`);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid profile email name slack_id verification_status");
    url.searchParams.set("state", state);

    if (query.loginHint && typeof query.login_hint === "string") url.searchParams.set("login_hint", String(query.loginHint));
    if (query.rsvp === "true") {
        setCookie(event, "oauth_rsvp", String(query.rsvp), {
            httpOnly: true, secure: true, sameSite: "lax", maxAge: 600
        });
    }

    return sendRedirect(event, url.toString());
})