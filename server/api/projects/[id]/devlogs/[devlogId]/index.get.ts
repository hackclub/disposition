import { eq } from "drizzle-orm";
import { users } from "~~/db/schema";
import { devlogRouteParams } from "~~/server/utils/project/devlog";

export default defineEventHandler(async event => {
    await requireUserSession(event);

    const { id, devlogId } = await getValidatedRouterParams(event, devlogRouteParams.parse);
    const { devlog, project } = await getDevlog(id, devlogId);

    const [author] = await db.select({ hcaId: users.hcaId, slackId: users.slackId, username: users.username })
        .from(users)
        .where(eq(users.hcaId, devlog.author));

    return {
        ...devlog,
        project: { id: project.id, title: project.title, icon: project.icon },
        user: author,
    };
})
