import * as z from "zod";

const RequestRequestBody = z.object({
    album: z.string().min(1).max(255),
    artist: z.string().min(1).max(255),
    media: z.enum(["cd", "vinyl", "cassette"]),
    message: z.string()
})

export { RequestRequestBody }