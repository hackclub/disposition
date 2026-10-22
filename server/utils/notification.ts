import * as z from "zod";

export const NotificationPostBody = z.object({
    user: z.string().min(1).max(16),
    title: z.string().min(1),
    description: z.string().min(1)
})