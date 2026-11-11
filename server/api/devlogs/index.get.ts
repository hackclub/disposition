import { and, desc, eq } from "drizzle-orm";
import * as z from "zod";
import { devlogs, projects, users } from "~~/db/schema";

// admin list of every devlog (or one user's with ?user=<hcaId>)
export default defineEventHandler(async event => {
    await requireAdmin(event);
    const { user } = await getValidatedQuery(event, z.object({
        user: z.string().optional(),
    }).parse);

    return db.select({
        id: devlogs.id,
        title: devlogs.title,
        linkedShip: devlogs.linkedShip,
        timestamp: devlogs.timestamp,
        project: { id: projects.id, title: projects.title },
        user: { hcaId: users.hcaId, username: users.username },
    })
        .from(devlogs)
        .innerJoin(projects, eq(projects.id, devlogs.project))
        .innerJoin(users, eq(users.hcaId, devlogs.author))
        .where(and(
            user ? eq(devlogs.author, user) : undefined,
        ))
        .orderBy(desc(devlogs.timestamp));
})
