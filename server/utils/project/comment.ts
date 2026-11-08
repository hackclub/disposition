import * as z from "zod";

export const CommentPostBody = z.object({
    content: z.string()
})