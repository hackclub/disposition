import { eq, and } from "drizzle-orm";
import * as z from "zod";
import { announcementReads } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

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