import { getSecondsSinceLastShip, ShipPostBody } from "~~/server/utils/project/project";
import * as z from "zod";
import { devlogs, projects, ships, users } from "~~/db/schema";
import { eq, and, isNull, isNotNull, desc, or, inArray, gt, lte } from "drizzle-orm";
import { getDBUser, isAdmin } from "~~/server/utils/requireAdmin"
import type { BlobObject } from "@nuxthub/core/blob";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);
    const user = await getDBUser(event);

    if (!user.onboardedAt || !user.addresses) throw createError({
        statusCode: 403,
        message: "You must onboard and authorize Disposition to access sensitive data before shipping a project."
    })

    const form = await readFormData(event);
    const parsed = ShipPostBody.safeParse({
        ...Object.fromEntries(form),
        attachments: form.getAll("attachments"),
    });
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

    // if you don't have alla these get out
    const missing = [
        !project.title.trim() && "title",
        !project.description.trim() && "description",
        !project.icon && "icon",
        !project.banner && "banner",
        !project.repository && "repository",
        !project.demo && "demo",
        project.hackatimeProjects.length === 0 && "hackatime projects",
    ].filter(Boolean);
    if (missing.length) throw createError({
        statusCode: 400,
        message: `Your project is missing a ${missing.join(", ")}. Fill these in before shipping.`,
        data: { missing }
    })

    const attachments = parsed.data.attachments.filter(file => file.size > 0);
    if (!attachments.length) throw createError({
        statusCode: 400,
        message: "Ships need at least one attachment"
    })
    attachments.forEach(validateImage);

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
    
    const uploaded: BlobObject[] = [];
    try {
        for (const file of attachments) {
            uploaded.push(await blob.put(file.name, file, { addRandomSuffix: true, prefix: "ships" }));
        }
    } catch (err) {
        await Promise.all(uploaded.map(b => blob.delete(b.pathname).catch(() => { })));
        throw err;
    }

    const ship: typeof ships.$inferInsert = {
        project: parsed.data.project,
        user: session.user.id,
        description: parsed.data.description,
        reviewerNote: parsed.data.reviewerNote,
        attachments: uploaded.map(b => b.pathname),

        hackatimeProjects: project.hackatimeProjects,
        hackatimeSeconds: seconds,

        ai: parsed.data.ai,
        aiDeclaration: parsed.data.aiDeclaration,

        update: parsed.data.update,
        updateDeclaration: parsed.data.updateDeclaration,
    }

    let shipResult: typeof ships.$inferSelect;
    try {
        shipResult = await db.transaction(async tx => {
            const [previousShip] = await tx.select({ timestamp: ships.timestamp }).from(ships)
                .where(and(eq(ships.project, parsed.data.project), isNull(ships.withdrawnAt)))
                .orderBy(desc(ships.timestamp))
                .limit(1);

            const [created] = await tx.insert(ships).values(ship).returning();
            if (!created) throw createError({
                statusCode: 500,
                message: "Failed to create ship"
            })

            const withdrawnShips = tx.select({ id: ships.id }).from(ships)
                .where(and(eq(ships.project, parsed.data.project), isNotNull(ships.withdrawnAt)));

            await tx.update(devlogs)
                .set({ linkedShip: created.id })
                .where(and(
                    eq(devlogs.project, parsed.data.project),
                    or(isNull(devlogs.linkedShip), inArray(devlogs.linkedShip, withdrawnShips)),
                    previousShip ? gt(devlogs.timestamp, previousShip.timestamp) : undefined,
                    lte(devlogs.timestamp, created.timestamp),
                ));

            try {
                await sendShip(created); // pray
            } catch (err: any) {
                // err.data is ari's response body, which says what it rejected (e.g. which field failed validation on a 422)
                console.error("[ship] failed to send ship to Ari:", err?.statusCode, JSON.stringify(err?.data ?? null, null, 2), err);
                throw createError({
                    statusCode: 502,
                    message: `Couldn't send your ship to the review queue (${err?.statusCode ?? "no response"}), so it wasn't shipped. Please try again later.`
                });
            }

            return created;
        });
    } catch (err) {
        await Promise.all(uploaded.map(b => blob.delete(b.pathname).catch(() => { })));
        throw err;
    }

    try {
        await sendNotification({
            title: `🚢 Ship #${shipResult.id}: Received`,
            description: `"${project.title}" is in the review queue. You'll get another notification once a reviewer has looked at it.`,
            user: session.user.id
        });
    } catch (err) {
        console.error("[ship] failed to send ship received notification:", err);
    }

    setResponseStatus(event, 201);
    return { id: shipResult.id };
})