import { count, gte, sql } from "drizzle-orm";
import { rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    await requireUserSession(event);
    const session = await getUserSession(event);
    // @ts-ignore
    if (!useRuntimeConfig().public.adminIds.includes(session.user.slackId)) {
        setResponseStatus(event, 401);
        return {
            message: "You must be an organizer to access this endpoint."
        };
    }

    // ok from now on we should only have admins access ts
    const [{ total } = { total: 0 }] = await db
        .select({ total: count() })
        .from(rsvps);

    const [{ today } = { today: 0 }] = await db
        .select({ today: count() })
        .from(rsvps)
        .where(gte(rsvps.timestamp, sql`CURDATE()`));

    const [{ week }= { week: 0 }] = await db
        .select({ week: count() })
        .from(rsvps)
        .where(gte(rsvps.timestamp, sql`DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`));

    return {
        total: total,
        today: today,
        week: week
    };
})