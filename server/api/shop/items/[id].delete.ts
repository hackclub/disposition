import { requireAdmin } from "~~/server/utils/requireAdmin"
import * as z from "zod";
import { shopItems } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async event => {
    await requireAdmin(event);

    // i love typescript
    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const [item] = await db.select().from(shopItems).where(eq(shopItems.id, id));
    if (!item) {
        throw createError({
            statusCode: 404,
            message: "Item not found"
        })
    }

    await db.delete(shopItems).where(eq(shopItems.id, id));
    await blob.del(item.image).catch(console.error);
    sendNoContent(event);
})