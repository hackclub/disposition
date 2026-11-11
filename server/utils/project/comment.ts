import * as z from "zod";

export const CommentPostBody = z.object({
    content: z.string().trim().min(1).max(2000)
})
