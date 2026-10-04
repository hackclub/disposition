import { requireAdmin } from "~~/server/utils/requireAdmin"
import * as z from "zod";
import { shopItems } from "~~/db/schema";
import { eq } from "drizzle-orm";
import type { BlobObject } from "@nuxthub/core/blob";
import { ItemPostBody, validateImage } from "~~/server/utils/shop/item";

const PatchBody = ItemPostBody.partial();

export default defineEventHandler(async event => {
    await requireAdmin(event);
    // in MY hood, we are type safe!!!
    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const form = await readFormData(event);
    const raw: Record<string, unknown> = {}
    for (const k of ["album", "artist", "genre", "description", "media"])
        if (form.has(k)) raw[k] = form.get(k)
    if (form.has("urls")) raw.urls = form.getAll("urls")
    const parsed = PatchBody.safeParse(raw);

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error),
        })
    }

    const file = form.get("image");
    if (!(file instanceof File) && !Object.keys(parsed.data).length) {
        throw createError({
            statusCode: 400,
            message: "Nothing to update"
        })
    }

    const [existing] = await db.select().from(shopItems).where(eq(shopItems.id, id));
    if (!existing) {
        throw createError({
            statusCode: 404,
            message: "Item not found"
        })
    }

    let newImage: BlobObject | undefined
    if (file instanceof File) {
        validateImage(file);
        newImage = await blob.put(file.name, file, {
            addRandomSuffix: true,
            prefix: "images",
        });
    }

    try {
        const { urls, ...itemFields } = parsed.data;
        await db.update(shopItems)
            .set({ ...itemFields, ...(urls !== undefined && { urls: JSON.stringify(urls) }), ...(newImage && { image: newImage.pathname }) })
            .where(eq(shopItems.id, id))
    } catch (err) {
        if (newImage) await blob.del(newImage.pathname);
        throw err;
    }

    if (newImage) await blob.del(existing.image).catch(console.error)
    return { id }
})