import { balanceEvents } from "~~/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);
    if(!userId) throw createError({
        statusCode: 400,
        message: "Invalid user id."
    });

    const [{ balance } = { balance: 0 }] = await db.select({
        balance: sql<number>`coalesce(sum(${balanceEvents.value}), 0)`,
    })
    .from(balanceEvents)
    .where(eq(balanceEvents.user, userId));
    
    return balance;
})