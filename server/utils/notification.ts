import * as z from "zod";

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
    }
}