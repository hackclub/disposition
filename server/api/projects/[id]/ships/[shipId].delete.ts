import { eq, isNull, and } from "drizzle-orm";
import * as z from "zod";
import { projects, ships } from "~~/db/schema";
import { isAdmin } from "~~/server/utils/requireAdmin"

// withdraws a ship: pulls it out of ari's review queue, then marks it withdrawn here
export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const { id, shipId } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
        shipId: z.coerce.number().int().positive()
    }).parse);

    const [existing] = await db.select().from(ships).where(and(eq(ships.id, shipId), eq(ships.project, id), isNull(ships.withdrawnAt)));
    if (!existing) throw createError({ statusCode: 404, message: "Ship not found" });

    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    if (!project) throw createError({ statusCode: 404, message: "Project not found" })

    const isOwner = session.user.id === project.author;
    if (!admin && !isOwner) throw createError({
        statusCode: 403,
        message: "Unauthorized to withdraw this ship"
    });
    
    await withdrawShip(existing);

    // fake ass delete
    await db.update(ships).set({ withdrawnAt: new Date() }).where(eq(ships.id, shipId));
    sendNoContent(event);
})
