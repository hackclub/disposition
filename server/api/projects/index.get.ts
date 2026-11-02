import { projects } from "~~/db/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const userId = await resolveUserScope(event, session.user.id);

    return db.select().from(projects)
        .where(userId ? eq(projects.author, userId) : undefined)
        .orderBy(desc(projects.timestamp));
})