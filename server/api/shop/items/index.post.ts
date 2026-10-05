import * as z from "zod";
import { sql, type SQL } from "drizzle-orm";
import { shopItems } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { requireAdmin } from "~~/server/utils/requireAdmin";
import { validateImage, ItemPostBody } from "~~/server/utils/shop/item";

export default defineEventHandler(async event => {
    await requireAdmin(event);

    const form = await readFormData(event);
    const parsed = ItemPostBody.safeParse({
        album: form.get("album"),
        artist: form.get("artist"),
        genre: form.get("genre"),
        description: form.get("description"),
        media: form.get("media"),
        urls: form.getAll("urls"),
        price: form.get("price"),
        staffPick: form.get("staffPick"),
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

    const item: Omit<typeof shopItems.$inferInsert, "staffPickAt"> & { staffPickAt: SQL | null } = {
        album: fields.album,
        artist: fields.artist,
        genre: fields.genre,
        description: fields.description,
        media: fields.media,
        urls: fields.urls,
        image: uploaded.pathname,
        price: fields.price,
        staffPickAt: fields.staffPick ? sql`now()` : null,
    }

    try {
        const [result] = await db.insert(shopItems).values(item).returning({ id: shopItems.id });

        setResponseStatus(event, 201);
        return { id: result!.id };
    } catch (err) {
        await blob.del(uploaded.pathname);
        throw err;
    }
});