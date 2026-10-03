import { desc } from "drizzle-orm";
import { shopRequests } from "~~/db/schema";
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async event => {
    await requireAdmin(event);

    const requests = db.select().from(shopRequests).orderBy(desc(shopRequests.timestamp));
    return requests;
})