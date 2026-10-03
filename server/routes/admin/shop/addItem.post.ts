import * as z from "zod";
import { shopItems } from "~~/db/schema";
import { db } from "~~/server/utils/db";

const RequestBody = z.object({
    album: z.string().min(1).max(255),
    artist: z.string().min(1).max(255),
    genre: z.string().min(1).max(255),
    category: z.string().min(1).max(255),
    description: z.string().max(2048),
    media: z.enum(["cd", "vinyl", "cassette", "other"]),
    urls: z.array(z.url()).max(20),
});

export default defineEventHandler(async event => {
    await requireUserSession(event);
    const session = await getUserSession(event);

    if (!useRuntimeConfig().public.adminIds.includes(session.user!.slackId)) {
        throw createError({
            statusCode: 401,
            message: "You must be an organizer to access this endpoint."
        })
    }

    const form = await readFormData(event);
    const parsed = RequestBody.safeParse({
        album: form.get("album"),
        artist: form.get("artist"),
        genre: form.get("genre"),
        category: form.get("category"),
        description: form.get("description"),
        media: form.get("media"),
        urls: form.getAll("urls"), // when i implement ts in client: urls.forEach(u => form.append("urls", u))
    });

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error),
        })
    }

    const fields = parsed.data;

    const file = form.get("image");
    if (!(file instanceof File)) {
        throw createError({ statusCode: 400, message: "image is required" });
    }
    if (file.size > 16 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw createError({ statusCode: 400, message: "Invalid image" });
    }

    const uploaded = await blob.put(file.name, file, {
        addRandomSuffix: true,
        prefix: "images",
    });

    const shopItem: typeof shopItems.$inferInsert = {
        album: fields.album,
        artist: fields.artist,
        genre: fields.genre,
        category: fields.category,
        description: fields.description,
        media: fields.media,
        urls: fields.urls, // kinda stupid but it works,
        image: uploaded.pathname
    }

    try {
        const [result] = await db.insert(shopItems).values(shopItem);
        return { id: result.insertId };
    } catch (err) {
        await blob.del(uploaded.pathname);
        throw err;
    }
});