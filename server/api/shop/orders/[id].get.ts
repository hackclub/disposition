import { eq } from "drizzle-orm";
import * as z from "zod";
import { shopOrders } from "~~/db/schema";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const [order] = await db.select().from(shopOrders).where(eq(shopOrders.id, id));

    // my opps out here probing order id's so i return 404 on all
    if (!order || (!admin && order.user !== session.user.id)) {
        throw createError({ statusCode: 404, message: "Order not found" });
    }

    return order;
});
