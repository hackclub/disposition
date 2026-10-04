import { desc, and, eq } from "drizzle-orm";
import * as z from "zod";
import { shopOrders } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);

    const { status } = await getValidatedQuery(event, z.object({
        status: z.string().optional(),
    }).parse);

    return db.select().from(shopOrders)
        .where(and(
            userId ? eq(shopOrders.user, userId) : undefined,
            status ? eq(shopOrders.status, status) : undefined,
        ))
        .orderBy(desc(shopOrders.timestamp));
});
