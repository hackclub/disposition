import { eq } from "drizzle-orm";
import * as z from "zod";
import { shopOrders } from "~~/db/schema";
import { OrderPatchBody } from "~~/server/utils/shop/order";

export default defineEventHandler(async event => {
    await requireAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const form = await readFormData(event);
    const parsed = OrderPatchBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error),
        })
    }

    const [existing] = await db.select({ id: shopOrders.id }).from(shopOrders)
        .where(eq(shopOrders.id, id));
    if (!existing) {
        throw createError({ statusCode: 404, message: "Order not found" });
    }

    await db.update(shopOrders)
        .set(parsed.data)
        .where(eq(shopOrders.id, id));

    return { id };
});
