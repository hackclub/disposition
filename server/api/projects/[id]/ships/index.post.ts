import { getSecondsSinceLastShip, ShipPostBody } from "~~/server/utils/project/project";
import * as z from "zod";
import { projects, ships } from "~~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    if (!session.user.onboardedAt || !session.user.addresses) throw createError({
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

    const [project] = await db.select().from(projects).where(eq(projects.id, parsed.data.project));
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

    const seconds = await getSecondsSinceLastShip(parsed.data.project);
    if(seconds < 3600) throw createError({
        statusCode: 400,
        message: "Must have atleast 1 hour logged before shipping"
    })

    const ship: typeof ships.$inferInsert = {
        project: parsed.data.project,
        user: session.user.id,

        hackatimeProjects: project.hackatimeProjects,
        hackatimeSeconds: seconds, // TODO: get hackatime hours and if its under like an hour make it unable to ship!!!!

        ai: parsed.data.ai,
        aiDeclaration: parsed.data.aiDeclaration,

        update: parsed.data.update,
        updateDeclaration: parsed.data.updateDeclaration,
    }

    const [shipResult] = await db.insert(ships).values(ship).returning({ id: ships.id });
    // TODO: push project to ari automatically here!!!
})