import { asc, desc } from "drizzle-orm";
import { shopItems } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await getUserSession(event);
    if (session && session.user) {
        if (useRuntimeConfig().public.adminIds.includes(session.user.slackId)) 
            return await db.select().from(shopItems).orderBy(desc(shopItems.added));
    } else {
        return await db.select(publicItemColumns).from(shopItems).orderBy(asc(shopItems.price));
    }
})