import { asc, desc } from "drizzle-orm";
import { shopItems } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await getUserSession(event);
    // here i do this check for admin instead of using the helper because you DONT need to be logged in to view the shop (avoiding a #meta post)
    if (session && session.user && useRuntimeConfig().public.adminIds.includes(session.user.slackId))
        return await db.select().from(shopItems).orderBy(desc(shopItems.added));
    return await db.select(publicItemColumns).from(shopItems).orderBy(asc(shopItems.price));
})