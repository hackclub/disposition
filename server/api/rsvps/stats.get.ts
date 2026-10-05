import { count, gte, sql } from "drizzle-orm";
import { rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { requireAdmin } from "~~/server/utils/requireAdmin";

export default defineEventHandler(async (event) => {
    await requireAdmin(event);

    // ok from now on we should only have admins access ts
    const [{ total } = { total: 0 }] = await db
        .select({ total: count() })
        .from(rsvps);

    const [{ today } = { today: 0 }] = await db
        .select({ today: count() })
        .from(rsvps)
        .where(gte(rsvps.timestamp, sql`date_trunc('day', now())`));

    const [{ week }= { week: 0 }] = await db
        .select({ week: count() })
        .from(rsvps)
        .where(gte(rsvps.timestamp, sql`date_trunc('week', now())`));

    return {
        total: total,
        today: today,
        week: week
    };
})