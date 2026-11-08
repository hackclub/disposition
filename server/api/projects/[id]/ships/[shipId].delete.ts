import { eq, isNull, and } from "drizzle-orm";
import * as z from "zod";
import { projects, ships } from "~~/db/schema";
import { isAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const { id, shipId } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
        shipId: z.coerce.number().int().positive()
    }).parse);

    const [existing] = await db.select().from(ships).where(and(eq(ships.id, id), isNull(ships.withdrawnAt)));
    if (!existing) throw createError({ statusCode: 404, message: "Ship not found" });
    if(existing.project !== shipId) throw createError({
        statusCode: 400,
        message: "Ship ID does not match project ID"
    })

    const [project] = await db.select().from(projects).where(and(eq(projects.id, shipId), isNull(projects.deletedAt)));
    if (!project) throw createError({ statusCode: 404, message: "Project not found" })

    const isOwner = session.user.id === project.author;
    if (!admin && !isOwner) throw createError({
        statusCode: 403,
        message: "Unauthorized to withdraw this ship"
    });

    // fake ass delete
    await db.update(ships).set({ withdrawnAt: new Date() }).where(eq(ships.id, id));
    sendNoContent(event);
})