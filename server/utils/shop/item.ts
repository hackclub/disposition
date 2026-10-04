import * as z from "zod";
import { getTableColumns } from "drizzle-orm";
import { shopItems } from "~~/db/schema";

const { urls, ...publicItemColumns } = getTableColumns(shopItems);

const ItemPostBody = z.object({
    album: z.string().min(1).max(255),
    artist: z.string().min(1).max(255),
    genre: z.string().min(1).max(255),
    description: z.string().max(2048),
    media: z.enum(["cd", "vinyl", "cassette", "other"]), // important!!
    urls: z.array(z.url()).max(20),
    price: z.int().min(1),
})

function validateImage(file: File | undefined) {
    if(!(file instanceof File)) return;
    if (file.size > 16 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw createError({ statusCode: 400, message: "Invalid image" });
    }
}

export {ItemPostBody, validateImage, publicItemColumns}