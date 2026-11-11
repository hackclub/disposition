import { and, eq } from "drizzle-orm";
import { devlogComments } from "~~/db/schema";
import { devlogRouteParams } from "~~/server/utils/project/devlog";
import { isAdmin } from "~~/server/utils/requireAdmin";
import * as z from "zod";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const { id, devlogId, commentId } = await getValidatedRouterParams(event, devlogRouteParams.extend({
        commentId: z.coerce.number().int().positive(),
    }).parse);
    const { devlog } = await getDevlog(id, devlogId);

    const [comment] = await db.select().from(devlogComments).where(and(eq(devlogComments.id, commentId), eq(devlogComments.devlog, devlogId)));
    if (!comment) throw createError({
        statusCode: 404,
        message: "Comment not found"
    })

    if (!admin && session.user.id !== comment.author) throw createError({
        statusCode: 403,
        message: "Unauthorized to delete this comment"
    })

    await db.delete(devlogComments).where(eq(devlogComments.id, commentId));
    sendNoContent(event);
})
