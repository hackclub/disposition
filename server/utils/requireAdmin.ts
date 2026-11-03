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
    const [result] = await db
        .select({
            ...columns,
            addresses: addresses,
        })
        .from(users)
        .leftJoin(addresses, eq(addresses.user, users.hcaId))
        .where(eq(users.hcaId, session.user.id));

    if (!result) {
        await clearUserSession(event);
        throw createError({
            statusCode: 401,
            message: "Session is no longer valid, please authenticate again.",
        });
    }

    return result;
}