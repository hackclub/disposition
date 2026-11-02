import { desc, and, eq } from "drizzle-orm";
import * as z from "zod";
import { shopRequests } from "~~/db/schema";

const requestStatuses = ["idle", "claimed", "accepted", "rejected"] as const;

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);

    const { status } = await getValidatedQuery(event, z.object({
        status: z.enum(requestStatuses).optional(),
    }).parse);

    return db.select().from(shopRequests)
        .where(and(
            userId ? eq(shopRequests.user, userId) : undefined,
            status ? eq(shopRequests.status, status) : undefined,
        ))
        .orderBy(desc(shopRequests.timestamp));
})
