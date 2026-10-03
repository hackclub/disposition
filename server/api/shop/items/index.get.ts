import { getTableColumns, sql, lte } from "drizzle-orm";
import { shopItems } from "~~/db/schema";
import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    await requireUserSession(event);

    const ranked = db
        .select({
            ...getTableColumns(shopItems),
            rn: sql<number>`row_number() over (
                partition by ${shopItems.category}
                order by ${shopItems.added} desc, ${shopItems.id} desc
            )`.as("rn"),
        })
        .from(shopItems)
        .as("ranked");

    const rows = await db
        .select(getTableColumns(shopItems))
        .from(ranked)
        .where(lte(ranked.rn, 15));
    
    const grouped: Record<string, typeof rows> = {};
    for (const row of rows) {
        (grouped[row.category] ??= []).push(row);
    }

    return grouped;
});