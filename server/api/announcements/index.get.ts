import { eq, and, isNull, isNotNull, desc } from "drizzle-orm";
import { announcementReads, announcements, users } from "~~/db/schema";
import type { Notification } from "~~/server/utils/notification";
import * as z from "zod";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const { readFilter } = await getValidatedQuery(event, z.object({
        readFilter: z.enum(["all", "read", "unread"]).optional().default("unread"),
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
            and(
                eq(announcementReads.announcement, announcements.id),
                eq(announcementReads.user, session.user.id),
            ),
        )
        .where(
            readFilter === "unread" ? isNull(announcementReads.seenAt)
                : readFilter === "read" ? isNotNull(announcementReads.seenAt)
                    : undefined,
        )
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