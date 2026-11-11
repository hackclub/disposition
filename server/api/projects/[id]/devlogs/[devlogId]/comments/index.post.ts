import * as z from "zod";
import { devlogComments } from "~~/db/schema";
import { CommentPostBody } from "~~/server/utils/project/comment";
import { devlogRouteParams } from "~~/server/utils/project/devlog";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const { id, devlogId } = await getValidatedRouterParams(event, devlogRouteParams.parse);
    await getDevlog(id, devlogId);

    const form = await readFormData(event);
    const parsed = CommentPostBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error)
    })

    const comment: typeof devlogComments.$inferInsert = {
        devlog: devlogId,
        author: session.user.id,
        content: parsed.data.content,
    }

    setResponseStatus(event, 201);
    return await db.insert(devlogComments).values(comment).returning({ id: devlogComments.id });
})
