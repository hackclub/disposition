import * as z from "zod";

const RequestPostBody = z.object({
    album: z.string().min(1).max(255),
    artist: z.string().min(1).max(255),
    media: z.enum(["cd", "vinyl", "cassette"]),
    message: z.string()
})

const RequestAdminPatchBody = z.object({
    status: z.enum(["accepted", "rejected", "claimed", "idle"])
});

export { RequestPostBody, RequestAdminPatchBody }
