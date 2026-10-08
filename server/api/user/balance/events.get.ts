import { balanceEvents } from "~~/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);
    if(!userId) throw createError({
        statusCode: 400,
        message: "Invalid user id."
    });

    const events = await db.select()
        .from(balanceEvents)
        .where(eq(balanceEvents.user, userId));
    
    return events;
})