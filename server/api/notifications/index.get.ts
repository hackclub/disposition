import { pendingNotifications } from "~~/db/schema";
import { eq, and } from "drizzle-orm";
import * as z from "zod";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);

    const { read } = await getValidatedQuery(event, z.object({
        read: z.coerce.boolean().optional().default(true),
    }).parse);

    return db.select().from(pendingNotifications)
        .where(and(eq(pendingNotifications.user, userId!), eq(pendingNotifications.read, read)))
})