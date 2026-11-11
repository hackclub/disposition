import { eq } from "drizzle-orm";
import { devlogComments, devlogs } from "~~/db/schema";
import { devlogRouteParams } from "~~/server/utils/project/devlog";
import { isAdmin } from "~~/server/utils/requireAdmin";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const { id, devlogId } = await getValidatedRouterParams(event, devlogRouteParams.parse);
    const { devlog } = await getDevlog(id, devlogId);

    const isOwner = session.user.id === devlog.author;
    if (!admin && !isOwner) throw createError({
        statusCode: 403,
        message: "Unauthorized to delete this devlog"
    })

    if (!admin && await isShipped(devlog)) throw createError({
        statusCode: 409,
        message: "Cannot delete a devlog that's already been shipped"
    })

    // REAL delete NOT fake
    await db.transaction(async tx => {
        await tx.delete(devlogComments).where(eq(devlogComments.devlog, devlogId));
        await tx.delete(devlogs).where(eq(devlogs.id, devlogId));
    });

    await deleteAttachments(devlog.attachments);
    sendNoContent(event);
})
