import { eq, isNull, and } from "drizzle-orm";
import * as z from "zod";
import { projects, ships } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse);
    
    const [existing] = await db.select().from(projects).where(and(eq(projects.id, id), isNull(projects.deletedAt)));
    if(!existing) throw createError({
        statusCode: 404,
        message: "Project not found"
    })

    if(session.user.id !== existing.author) throw createError({
        statusCode: 403,
        message: "Unauthorized to delete project"
    })

    const existingShips = await db.select().from(ships).where(and(
        eq(ships.project, id),
        isNull(ships.withdrawnAt),
    ))
    if(existingShips.length > 0) throw createError({
        statusCode: 409,
        message: "Cannot delete a project with unwithdrawn ships"
    })

    // fake ass delete
    await db.update(projects).set({ deletedAt: new Date() }).where(eq(projects.id, id));
})