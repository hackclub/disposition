import { notifications } from "~~/db/schema";
import { eq, and } from "drizzle-orm";
import * as z from "zod";
import type { Notification, NotificationType } from "~~/server/utils/notification";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);

    const { read } = await getValidatedQuery(event, z.object({
        read: z.coerce.boolean().optional().default(true),
    }).parse);

    const rows = await db.select().from(notifications)
        .where(and(eq(notifications.user, userId!), eq(notifications.read, read)))

    return rows.map((notification): Notification => ({
        serverId: notification.id,
        type: "notification",
        title: notification.title,
        description: notification.description,
        timestamp: notification.timestamp,
        read: notification.read
    }))
})