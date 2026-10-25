import { eq } from "drizzle-orm";
import * as z from "zod";
import { notifications, users } from "~~/db/schema";
import { sendSlackNotification } from "./slack";

export const NotificationPostBody = z.object({
    user: z.string().min(1).max(16),
    title: z.string().min(1),
    description: z.string().min(1)
})

export const NotificationPatchBody = z.object({
    read: z.boolean()
})

export const AnnouncementPostBody = z.object({
    title: z.string().min(1),
    description: z.string().min(1)
})

export const AnnouncementPatchBody = z.object({
    title: z.string().optional(),
    description: z.string().optional()
})

// copy of notification.ts from app/types
export type NotificationType = "notification" | "announcement"
export type Notification = {
    serverId: number,
    type: NotificationType,
    title: string,
    description: string,
    timestamp: Date,
    read: boolean,
    author?: {
        id: string
        username: string,
    },
    user?: {
        id: string,
        username: string
    }
}

export async function sendNotification(notification: typeof notifications.$inferInsert) {
    const [result] = await db.insert(notifications).values(notification).returning({
        id: notifications.id,
        title: notifications.title,
        description: notifications.description,
        timestamp: notifications.timestamp,
        user: notifications.user,
        read: notifications.read
    });
    if(!result) return; // blow up

    const [recipient] = await db.select({ slackId: users.slackId }).from(users)
        .where(eq(users.hcaId, result.user));
    if(!recipient) return;

    await sendSlackNotification(recipient.slackId, {
        serverId: result.id,
        type: "notification",
        title: result.title,
        description: result.description,
        timestamp: result.timestamp,
        user: {
            id: result.user,
            username: "", // nothing, for now. slack doesn't really need the username xd
        },
        read: result.read
    });
}