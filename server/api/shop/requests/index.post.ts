import { RequestRequestBody } from "~~/server/utils/shopRequest";
import * as z from "zod";
import { shopRequests } from "~~/db/schema";

export default defineEventHandler(async event => {
    await requireUserSession(event);
    const session = await getUserSession(event);

    const form = await readFormData(event);
    const parsed = RequestRequestBody.safeParse({
        album: form.get("album"),
        artist: form.get("artist"),
        media: form.get("media"),
        message: form.get("message")
    });

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error),
        })
    }
    const fields = parsed.data;

    const request: typeof shopRequests.$inferInsert = {
        album: fields.album,
        artist: fields.artist,
        media: fields.media,
        message: fields.message,
        user: session.user!.id
    }

    const [result] = await db.insert(shopRequests).values(request);

    setResponseStatus(event, 201);
    return { id: result.insertId };
})