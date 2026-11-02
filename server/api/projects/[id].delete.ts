import { eq } from "drizzle-orm";
import * as z from "zod";
import { projects } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse);
    
    const [existing] = await db.select().from(projects).where(eq(projects.id, id));
    if(!existing) throw createError({
        statusCode: 404,
        message: "Project not found"
    })

    if(session.user.id !== existing.author) throw createError({
        statusCode: 403,
        message: "Unauthorized to delete project"
    })

    // fake ass delete
    await db.update(projects).set({ deletedAt: new Date() }).where(eq(projects.id, id));
})