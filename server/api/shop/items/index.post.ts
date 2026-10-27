import * as z from "zod";
import { sql, type SQL } from "drizzle-orm";
import { shopItems } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { requireAdmin } from "~~/server/utils/requireAdmin";
import { validateImage, ItemPostBody } from "~~/server/utils/shop/item";

export default defineEventHandler(async event => {
    await requireAdmin(event);

    const form = await readFormData(event);
    const parsed = ItemPostBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error),
    })

    const file = form.get("image");
    if (!(file instanceof File && file.size > 0)) {
        throw createError({ statusCode: 400, message: "image is required" });
    }
    validateImage(file);

    const uploaded = await blob.put(file.name, file, {
        addRandomSuffix: true,
        prefix: "images",
    });

    const item: Omit<typeof shopItems.$inferInsert, "staffPickAt"> & { staffPickAt: SQL | null } = {
        album: parsed.data.album,
        artist: parsed.data.artist,
        genre: parsed.data.genre,
        description: parsed.data.description,
        media: parsed.data.media,
        urls: parsed.data.urls,
        image: uploaded.pathname,
        price: parsed.data.price,
        staffPickAt: parsed.data.staffPick ? sql`now()` : null,
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