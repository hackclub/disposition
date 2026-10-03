import { getTableColumns, sql, lte, lt, and, desc, eq } from "drizzle-orm";
import { shopItems } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import * as z from "zod";

export default defineEventHandler(async (event) => {
    await requireUserSession(event);

    const category = await getValidatedRouterParams(event, z.object({
        category: z.coerce.string().min(1),
    }).parse).then(p => p.category);

    const { cursor, limit } = await getValidatedQuery(event, z.object({
        cursor: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(15),
    }).parse);

    const rows = await db.select().from(shopItems)
        .where(and(
            eq(shopItems.category, category),
            cursor ? lt(shopItems.id, cursor) : undefined,
        ))
        .orderBy(desc(shopItems.id))
        .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    return {
        items,
        nextCursor: hasMore ? items[items.length - 1]!.id : null,
    };
});