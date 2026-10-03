import * as z from "zod";
import { shopItems } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { requireAdmin } from "~~/server/utils/requireAdmin";
import { validateImage } from "~~/server/utils/shopItem";
import { ItemRequestBody } from "~~/server/utils/shopItem";

export default defineEventHandler(async event => {
    await requireAdmin(event);

    const form = await readFormData(event);
    const parsed = ItemRequestBody.safeParse({
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
    validateImage(file);

    const uploaded = await blob.put(file.name, file, {
        addRandomSuffix: true,
        prefix: "images",
    });

    const item: typeof shopItems.$inferInsert = {
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
        const [result] = await db.insert(shopItems).values(item);

        setResponseStatus(event, 201);
        return { id: result.insertId };
    } catch (err) {
        await blob.del(uploaded.pathname);
        throw err;
    }
});