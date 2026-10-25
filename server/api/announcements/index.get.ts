import { eq, and, isNull, isNotNull } from "drizzle-orm";
import { announcementReads, announcements, users } from "~~/db/schema";
import type { Notification, NotificationType } from "~~/server/utils/notification";
import * as z from "zod";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const { readFilter } = await getValidatedQuery(event, z.object({
        readFilter: z.coerce.boolean().optional().default(false),
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
            readFilter === false ? isNull(announcementReads.seenAt)
                : readFilter === true ? isNotNull(announcementReads.seenAt)
                    : undefined,
        );

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