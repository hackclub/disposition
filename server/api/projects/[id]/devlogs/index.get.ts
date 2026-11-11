import { and, desc, eq, isNull } from "drizzle-orm";
import * as z from "zod";
import { devlogs, projects, users } from "~~/db/schema";

export default defineEventHandler(async event => {
    await requireUserSession(event);

    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse);

    const [project] = await db.select({ id: projects.id }).from(projects).where(and(eq(projects.id, id), isNull(projects.deletedAt)));
    if (!project) throw createError({
        statusCode: 404,
        message: "Project not found"
    })

    return await db.select({
        ...publicDevlogColumns,
        user: { hcaId: users.hcaId, slackId: users.slackId, username: users.username },
    })
        .from(devlogs)
        .innerJoin(users, eq(users.hcaId, devlogs.author))
        .where(eq(devlogs.project, id))
        .orderBy(desc(devlogs.timestamp));
})
