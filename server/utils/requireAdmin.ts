import { eq, getTableColumns } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm";
import type { H3Event } from "h3";
import { addresses, users } from "~~/db/schema";

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

export async function isAdmin(event: H3Event) {
    const session = await requireUserSession(event);
    const admin = useRuntimeConfig().public.adminIds.includes(session.user.slackId);

    return { admin, session };
}

const allUserColumns = getTableColumns(users);

export async function getDBUser<TColumns extends SelectedFields<any, any> = typeof allUserColumns>(event: H3Event, columns: TColumns = allUserColumns as unknown as TColumns) {
    const session = await requireUserSession(event);
    const privateUserColumnsMask = Object.fromEntries(
        Object.keys(columns).map(key => [key, true])
    ) as Record<keyof typeof columns, true>;

    const result = await db.query.users.findFirst({
        columns: privateUserColumnsMask,
        where: eq(users.hcaId, session.user.id),
        with: { addresses: true }
    })

    if (!result) {
        await clearUserSession(event);
        throw createError({
            statusCode: 401,
            message: "Session is no longer valid, please authenticate again.",
        });
    }

    return result;
}