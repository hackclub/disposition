import * as z from "zod";
import { getTableColumns } from "drizzle-orm";
import { shopItems } from "~~/db/schema";

function getPublicItemColumns() {
    const { urls, staffPickAt, ...publicItemColumns } = getTableColumns(shopItems);
    return publicItemColumns
}

export const publicItemColumns = getPublicItemColumns();

export const ItemPostBody = z.object({
    album: z.string().min(1).max(255),
    artist: z.string().nullish(),
    genre: z.string().nullish(),
    description: z.string().max(2048),
    media: z.enum(["cd", "vinyl", "cassette", "other"]), // important!!
    urls: z.string(), //json
    price: z.coerce.number().int().min(1),
    staffPick: z.stringbool(),
    image: z.instanceof(File),
})

export const ItemPatchBody = ItemPostBody.partial();

export function validateImage(file: File | undefined) {
    if (!(file instanceof File)) return;
    if (file.size > 16 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw createError({ statusCode: 400, message: "Invalid image" });
    }
}