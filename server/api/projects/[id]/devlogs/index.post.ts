import { and, eq, isNull } from "drizzle-orm";
import * as z from "zod";
import { devlogs, projects } from "~~/db/schema";
import { DevlogPostBody } from "~~/server/utils/project/devlog";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse);

    const form = await readFormData(event);
    // Object.fromEntries only keeps the last value of a repeated key, so collect the attachments separately
    const parsed = DevlogPostBody.safeParse({
        ...Object.fromEntries(form),
        attachments: form.getAll("attachments"),
    });
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error)
    })

    const [project] = await db.select().from(projects).where(and(eq(projects.id, id), isNull(projects.deletedAt)));
    if (!project) throw createError({
        statusCode: 404,
        message: "Project not found"
    })

    if (session.user.id !== project.author) throw createError({
        statusCode: 403,
        message: "Unauthorized to post a devlog on this project"
    })

    // upload last, after everything that can reject the devlog, so we don't leave orphaned blobs
    const attachments = await uploadAttachments(parsed.data.attachments ?? [], "devlogs");

    const devlog: typeof devlogs.$inferInsert = {
        project: id,
        author: session.user.id,
        title: parsed.data.title,
        description: parsed.data.description,
        attachments,
    }

    try {
        setResponseStatus(event, 201);
        return await db.insert(devlogs).values(devlog).returning({ id: devlogs.id });
    } catch (err) {
        await deleteAttachments(attachments);
        throw err;
    }
})
