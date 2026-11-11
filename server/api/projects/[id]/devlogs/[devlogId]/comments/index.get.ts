import { desc, eq } from "drizzle-orm";
import { devlogComments, users } from "~~/db/schema";
import { devlogRouteParams } from "~~/server/utils/project/devlog";

export default defineEventHandler(async event => {
    await requireUserSession(event);

    const { id, devlogId } = await getValidatedRouterParams(event, devlogRouteParams.parse);
    await getDevlog(id, devlogId);

    return await db.select({
        id: devlogComments.id,
        content: devlogComments.content,
        timestamp: devlogComments.timestamp,
        user: { hcaId: users.hcaId, slackId: users.slackId, username: users.username },
    })
        .from(devlogComments)
        .innerJoin(users, eq(users.hcaId, devlogComments.author))
        .where(eq(devlogComments.devlog, devlogId))
        .orderBy(desc(devlogComments.timestamp));
})
