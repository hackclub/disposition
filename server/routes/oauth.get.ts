export default defineEventHandler((event) => {
    const config = useRuntimeConfig();
    const state = crypto.randomUUID();

    setCookie(event, "oauth_state", state, {
        httpOnly: false, secure: true, sameSite: "lax", maxAge: 600
    });

    const query = getQuery(event);
    const loginHint: string = String(query.login_hint);
    const rsvp: string = String(query.rsvp)

    const url = new URL("https://auth.hackclub.com/oauth/authorize");
    url.searchParams.set("client_id", config.hackclub.clientId);
    url.searchParams.set("redirect_uri", `${config.public.baseUrl}/oauth/callback`);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid profile email name slack_id verification_status");
    url.searchParams.set("state", state);

    if (loginHint) url.searchParams.set("login_hint", loginHint);
    if (rsvp) {
        setCookie(event, "oauth_rsvp", rsvp, {
            httpOnly: false, secure: true, sameSite: "lax", maxAge: 600
        });
    }

    return sendRedirect(event, url.toString());
})