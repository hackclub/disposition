import { eq } from "drizzle-orm";
import * as z from "zod";
import { projects } from "~~/db/schema";
import { publicProjectColumns } from "~~/server/utils/project/project";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse);

    const [project] = admin ? await db.select().from(projects).where(eq(projects.id, id)) : await db.select(publicProjectColumns).from(projects).where(eq(projects.id, id));
    if (!project) throw createError({
        statusCode: 404,
        message: "Project not found"
    })

    return project;
})