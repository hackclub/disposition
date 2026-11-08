import { getSecondsSinceLastShip, ShipPostBody } from "~~/server/utils/project/project";
import * as z from "zod";
import { projects, ships, users } from "~~/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { getDBUser, isAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);
    const user = await getDBUser(event);

    if (!user.onboardedAt || !user.addresses) throw createError({
        statusCode: 403,
        message: "You must onboard and authorize Disposition to access sensitive data before shipping a project."
    })

    const form = await readFormData(event);
    const parsed = ShipPostBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid Input",
        data: z.flattenError(parsed.error)
    })

    const [project] = await db.select().from(projects).where(and(eq(projects.id, parsed.data.project), isNull(projects.deletedAt)));
    if (!project) throw createError({
        statusCode: 404,
        message: "Project not found"
    })

    const isOwner = project.author === session.user.id;
    if (!isOwner) throw createError({
        statusCode: 403,
        message: "Unauthorized to ship this project"
    })

    if ((parsed.data.ai && !parsed.data.aiDeclaration) || (parsed.data.update && !parsed.data.updateDeclaration)) throw createError({
        statusCode: 400,
        message: "AI/Update declaration must'nt be empty"
    })

    const [lastShip] = await db.select().from(ships).where(and(eq(ships.project, parsed.data.project), isNull(ships.withdrawnAt), eq(ships.status, "idle"))).orderBy(desc(ships.timestamp));
    if(lastShip) throw createError({
        statusCode: 409,
        message: "Cannot create another ship while your last one is still in queue."
    })

    const seconds = await getSecondsSinceLastShip(parsed.data.project);
    if(seconds === -1) throw createError({
        statusCode: 500,
        message: "An error occoured while getting the time since your last ship. Please try again"
    })

    if (seconds < 3600) throw createError({
        statusCode: 400,
        message: "Must have atleast 1 hour logged before shipping"
    })

    const ship: typeof ships.$inferInsert = {
        project: parsed.data.project,
        user: session.user.id,

        hackatimeProjects: project.hackatimeProjects,
        hackatimeSeconds: seconds,

        ai: parsed.data.ai,
        aiDeclaration: parsed.data.aiDeclaration,

        update: parsed.data.update,
        updateDeclaration: parsed.data.updateDeclaration,
    }

    const [shipResult] = await db.insert(ships).values(ship).returning();
    if (!shipResult) throw createError({
        statusCode: 500,
        message: "Failed to create ship"
    })

    await sendShip(shipResult); // pray
})