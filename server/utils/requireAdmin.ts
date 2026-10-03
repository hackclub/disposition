import type { H3Event } from "h3";

export async function requireAdmin(event: H3Event) {
    const session = await requireUserSession(event);

    if (!useRuntimeConfig().public.adminIds.includes(session.user.slackId)) {
        throw createError({
            statusCode: 403,
            message: "You must be an organizer to access this endpoint.",
        });
    }

    return session;
}