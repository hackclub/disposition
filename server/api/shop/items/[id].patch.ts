import { requireAdmin } from "~~/server/utils/requireAdmin"
import * as z from "zod";
import { shopItems } from "~~/db/schema";
import { eq } from "drizzle-orm";
import type { BlobObject } from "@nuxthub/core/blob";
import { ItemPostBody, validateImage } from "~~/server/utils/shop/item";

const PatchBody = ItemPostBody.partial();

export default defineEventHandler(async event => {
    await requireAdmin(event);
    
    // i love typescript
    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const form = await readFormData(event);
    const parsed = PatchBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error),
    })

    const file = parsed.data.image;
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

    const { image, urls, ...setData } = parsed.data
    try {
        await db.update(shopItems)
            .set({
                ...setData,
                ...(newImage && { image: newImage.pathname }),
                ...(parsed.data.urls && { urls: JSON.parse(parsed.data.urls)})
            })
            .where(eq(shopItems.id, id))
    } catch (err) {
        if (newImage) await blob.del(newImage.pathname);
        throw err;
    }

    if (newImage) await blob.del(existing.image).catch(console.error)
    return { id }
})