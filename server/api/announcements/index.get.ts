import { eq, and, isNull, isNotNull, desc, gte, sql } from "drizzle-orm";
import { announcementReads, announcements, users } from "~~/db/schema";
import type { Notification } from "~~/server/utils/notification";
import * as z from "zod";

export default defineEventHandler(async event => {
    const session = await getUserSession(event);
    // logged out: no read state, so return every announcement from the past week (newest first)
    const userId = session.user?.id;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const { readFilter, author } = await getValidatedQuery(event, z.object({
        readFilter: z.enum(["all", "read", "unread"]).optional().default("unread"),
        author: z.string().optional()
    }).parse);

    const rows = await db
        .select({
            announcement: announcements,
            seenAt: announcementReads.seenAt,
            author: {
                id: users.hcaId,
                username: users.username,
            },
        })
        .from(announcements)
        .leftJoin(users, eq(users.hcaId, announcements.author))
        .leftJoin(
            announcementReads,
            userId
                ? and(
                    eq(announcementReads.announcement, announcements.id),
                    eq(announcementReads.user, userId),
                )
                : sql`false`,
        )
        .where(and(
            !userId ? undefined
                : readFilter === "unread" ? isNull(announcementReads.seenAt)
                : readFilter === "read" ? isNotNull(announcementReads.seenAt)
                    : undefined,
            author ? eq(announcements.author, author) : undefined,
            !userId ? gte(announcements.timestamp, oneWeekAgo) : undefined,
        ))
        .orderBy(desc(announcements.timestamp));

    return rows.map(({ announcement, seenAt, author }): Notification => ({
        serverId: announcement.id,
        type: "announcement",
        title: announcement.title,
        description: announcement.description,
        timestamp: announcement.timestamp,
        author: author?.id ? { id: author.id, username: author.username } : undefined,
        read: seenAt !== null,
    }));
});