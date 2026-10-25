import { eq, and } from "drizzle-orm";
import * as z from "zod";
import { announcementReads, announcements } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    if(!announcement) throw createError({
        statusCode: 404,
        message: "Announcement not found"
    })

    const [result] = await db
        .select().from(announcementReads)
        .where(and(
            eq(announcementReads.announcement, id),
            eq(announcementReads.user, session.user.id)
        ));
    
    if(result) return;
    const read: typeof announcementReads.$inferInsert = {
        user: session.user.id,
        announcement: id
    }

    await db.insert(announcementReads).values(read);
    setResponseStatus(event, 201);
});