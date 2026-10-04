import { shopItems } from "~~/db/schema";

export default defineEventHandler(async event => {
    await requireAdmin(event);
    const rows = await db.selectDistinct({ genre: shopItems.genre }).from(shopItems).orderBy(shopItems.genre);

    return rows.map(r => r.genre);
})