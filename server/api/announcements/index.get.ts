import { eq, and, isNull, isNotNull } from "drizzle-orm";
import { announcementReads, announcements } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const { readFilter } = getQuery(event);

    const rows = await db
        .select({
            announcement: announcements,
            readId: announcementReads.seenAt,
        })
        .from(announcements)
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
        );

    return rows.map(r => ({ ...r.announcement, read: r.readId !== null }));
});