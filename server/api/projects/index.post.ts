import * as z from "zod";
import { projects } from "~~/db/schema";
import { ProjectPostBody } from "~~/server/utils/project/project";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    
    const form = await readFormData(event);
    // Object.fromEntries only keeps the last value of a repeated key, so collect the array field separately
    const parsed = ProjectPostBody.safeParse({
        ...Object.fromEntries(form),
        hackatimeProjects: form.getAll("hackatimeProjects"),
    });
    if(!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error)
    })

    const project: typeof projects.$inferInsert = {
        title: parsed.data.title,
        description: parsed.data.description,
        author: session.user.id,
        repository: parsed.data.repository || undefined,
        hackatimeProjects: parsed.data.hackatimeProjects,
    }

    setResponseStatus(event, 201);
    return await db.insert(projects).values(project).returning({ id: projects.id });
})