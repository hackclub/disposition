import * as z from "zod";
import { eq } from "drizzle-orm";
import { shopItems, shopOrders } from "~~/db/schema";
import { OrderPostBody } from "~~/server/utils/shop/order";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const form = await readFormData(event);
    const parsed = OrderPostBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error),
        })
    }

    const [item] = await db.select({ id: shopItems.id }).from(shopItems)
        .where(eq(shopItems.id, parsed.data.item));
    if (!item) {
        throw createError({ statusCode: 404, message: "Item not found" });
    }

    const order: typeof shopOrders.$inferInsert = {
        user: session.user.id,
        item: item.id,
        message: parsed.data.message || null
    }

    const [result] = await db.insert(shopOrders).values(order).returning({ id: shopOrders.id });
    setResponseStatus(event, 201);
    return { id: result!.id };
})
