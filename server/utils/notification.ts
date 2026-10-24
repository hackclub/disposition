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