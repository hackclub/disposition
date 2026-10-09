import * as z from "zod";
import { eq, sql } from "drizzle-orm";
import { shopItems, shopOrders, balanceEvents } from "~~/db/schema";
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

    const [item] = await db.select().from(shopItems)
        .where(eq(shopItems.id, parsed.data.item));
    if (!item) {
        throw createError({ statusCode: 404, message: "Item not found" });
    }

    const [{ balance } = { balance: 0 }] = await db.select({
        balance: sql<number>`coalesce(sum(${balanceEvents.value}), 0)`,
    })
        .from(balanceEvents)
        .where(eq(balanceEvents.user, session.user.id));

    if (balance < item.price) {
        throw createError({
            statusCode: 422,
            message: "Insufficient balance"
        })
    }

    const order: typeof shopOrders.$inferInsert = {
        user: session.user.id,
        item: item.id,
        message: parsed.data.message || null
    }

    const [result] = await db.insert(shopOrders).values(order).returning({ id: shopOrders.id });
    const balanceEvent: typeof balanceEvents.$inferInsert = {
        user: session.user.id,
        description: `Shop order ${result?.id} (automated)`,
        value: -item.price
    }

    await db.insert(balanceEvents).values(balanceEvent);
    setResponseStatus(event, 201);
    return { id: result!.id };
})
