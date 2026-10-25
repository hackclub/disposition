import { notifications, users } from "~~/db/schema";
import { eq, and, desc } from "drizzle-orm";
import * as z from "zod";
import type { Notification, NotificationType } from "~~/server/utils/notification";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);
    const userId = await resolveUserScope(event, session.user.id);

    const { read } = await getValidatedQuery(event, z.object({
        read: z.coerce.boolean().optional().default(false),
    }).parse);

    const rows = await db.select({
        notification: notifications,
        user: {
            id: users.hcaId,
            username: users.username
        }
    })
        .from(notifications)
        .leftJoin(users, eq(users.hcaId, notifications.user))
        .where(and(
            userId ? eq(notifications.user, userId) : undefined,
            eq(notifications.read, read)
        ))
        .orderBy(desc(notifications.id))

    return rows.map((notification): Notification => ({
        serverId: notification.notification.id,
        type: "notification",
        title: notification.notification.title,
        description: notification.notification.description,
        timestamp: notification.notification.timestamp,
        read: notification.notification.read,
        user: admin ? {
            id: notification.user!.id,
            username: notification.user!.username
        } : undefined
    }))
})