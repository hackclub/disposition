import * as z from "zod";

const RequestPostBody = z.object({
    album: z.string().min(1).max(255),
    artist: z.string().min(1).max(255),
    media: z.enum(["cd", "vinyl", "cassette"]),
    message: z.string()
})

const RequestPatchBody = z.object({
    status: z.string().min(1).max(24)
});

export { RequestPostBody, RequestPatchBody }
