import { asc, desc } from "drizzle-orm";
import { shopItems } from "~~/db/schema";

export default defineEventHandler(async event => {
    const {admin} = await isAdmin(event);

    if(admin) return await db.select().from(shopItems).orderBy(desc(shopItems.added));
    return await db.select(publicItemColumns).from(shopItems).orderBy(asc(shopItems.price));
})