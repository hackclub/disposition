import { desc, and, eq, } from "drizzle-orm";
import * as z from "zod";
import { shopItems, shopOrders, users } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);

    const { status } = await getValidatedQuery(event, z.object({
        status: z.enum(["pending", "shipped", "delivered", "cancelled"]).optional(),
    }).parse);

    const result = await db.select({
        order: publicOrderColumns,
        item: publicItemColumns,
        user: publicUserColumns
    })
        .from(shopOrders)
        .leftJoin(shopItems, eq(shopItems.id, shopOrders.item))
        .leftJoin(users, eq(users.hcaId, shopOrders.user))
        .where(and(
            userId ? eq(shopOrders.user, userId) : undefined,
            status ? eq(shopOrders.status, status) : undefined,
        ))
        .orderBy(desc(shopOrders.timestamp));

    return result.map(({ order, item, user }) => ({
        id: order.id,
        user: user,
        item: item,
        status: order.status,
        message: order.message,
        tracking: order.tracking,
        shippingAddress: order.shippingAddress,
        timestamp: order.timestamp
    }));
});
