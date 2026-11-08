import { projects } from "~~/db/schema";
import { eq, desc, isNull, and } from "drizzle-orm";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);

    return db.select().from(projects)
        .where(and(
            userId ? eq(projects.author, userId) : undefined,
            isNull(projects.deletedAt)
        ))
        .orderBy(desc(projects.timestamp));
})