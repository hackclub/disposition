import { eq } from "drizzle-orm";
import * as z from "zod";
import { addresses, shopItems, shopOrders, users } from "~~/db/schema";
import { publicOrderColumns } from "~~/server/utils/shop/order";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    let result;
    if (admin) {
        [result] = await db.select({
            order: shopOrders,
            address: addresses,
            user: users,
            item: shopItems
        })
            .from(shopOrders)
            .leftJoin(addresses, eq(addresses.id, shopOrders.shippingAddress))
            .leftJoin(users, eq(users.hcaId, shopOrders.user))
            .leftJoin(shopItems, eq(shopItems.id, shopOrders.item))
            .where(eq(shopOrders.id, id));
    } else {
        [result] = await db.select({
            order: publicOrderColumns,
            address: addresses,
            user: publicUserColumns,
            item: publicItemColumns
        })
            .from(shopOrders)
            .leftJoin(addresses, eq(addresses.id, shopOrders.shippingAddress))
            .leftJoin(users, eq(users.hcaId, shopOrders.user))
            .leftJoin(shopItems, eq(shopItems.id, shopOrders.item))
            .where(eq(shopOrders.id, id));
    }

    // my opps out here probing order id's so i return 404 on all
    if (!result || (!admin && result.order.user !== session.user.id)) {
        throw createError({ statusCode: 404, message: "Order not found" });
    }

    return {
        id: result.order.id,
        user: result.user,
        item: result.item,
        status: result.order.status,
        message: result.order.message,
        tracking: result.order.tracking,
        shippingAddress: result.address,
        timestamp: result.order.timestamp
    };
});
