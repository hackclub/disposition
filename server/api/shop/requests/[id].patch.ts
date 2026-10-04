import { requireAdmin } from "~~/server/utils/requireAdmin"
import * as z from "zod";
import { RequestPatchBody } from "~~/server/utils/shop/request";
import { shopRequests } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async event => {
    await requireAdmin(event);

    // in MY hood, we are type safe!!!
    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const form = await readFormData(event);
    const parsed = RequestPatchBody.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error)
        })
    }

    const [existing] = await db.select().from(shopRequests).where(eq(shopRequests.id, id));
    if (!existing) {
        throw createError({
            statusCode: 404,
            message: "Item not found"
        })
    }

    await db.update(shopRequests)
        .set(parsed.data)
        .where(eq(shopRequests.id, id))
    
    return { id }
})