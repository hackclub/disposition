import { eq } from "drizzle-orm";
import * as z from "zod";
import { devlogs } from "~~/db/schema";
import { DevlogPatchBody, devlogRouteParams } from "~~/server/utils/project/devlog";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const { id, devlogId } = await getValidatedRouterParams(event, devlogRouteParams.parse);
    const { devlog } = await getDevlog(id, devlogId);

    if (session.user.id !== devlog.author) throw createError({
        statusCode: 403,
        message: "Unauthorized to edit this devlog"
    })

    if (await isShipped(devlog)) throw createError({
        statusCode: 409,
        message: "Cannot edit a devlog that's already been shipped"
    })

    const form = await readFormData(event);
    const parsed = DevlogPatchBody.safeParse({
        ...Object.fromEntries(form),
        ...(form.has("attachments") && { attachments: form.getAll("attachments") }),
    });
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error)
    })

    const { attachments: files, ...data } = parsed.data;
    if (!Object.keys(data).length && !files) throw createError({
        statusCode: 400,
        message: "Nothing to update"
    })

    const attachments = files ? await uploadAttachments(files, "devlogs") : undefined;

    try {
        await db.update(devlogs)
            .set({ ...data, ...(attachments && { attachments }) })
            .where(eq(devlogs.id, devlogId));
    } catch (err) {
        if (attachments) await deleteAttachments(attachments);
        throw err;
    }

    if (attachments) await deleteAttachments(devlog.attachments);
    return { id: devlogId };
})
