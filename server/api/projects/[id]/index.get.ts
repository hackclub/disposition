import { eq, and, isNull, getTableColumns } from "drizzle-orm";
import * as z from "zod";
import { projects, devlogs, ships } from "~~/db/schema";
import { getTotalSeconds, publicProjectColumns, publicShipColumns } from "~~/server/utils/project/project";
import { isAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse);

    // hackatimeProjects is owner-only, but we only know the owner after the query, so fetch it and strip it below
    const columns = admin ? getTableColumns(projects) : { ...publicProjectColumns, hackatimeProjects: projects.hackatimeProjects }
    const devlogColumns = admin ? getTableColumns(devlogs) : publicDevlogColumns
    const shipColumns = admin ? getTableColumns(ships) : publicShipColumns

    const mask = Object.fromEntries(
        Object.keys(columns).map(key => [key, true])
    ) as Record<keyof typeof columns, true>;

    const devlogsMask = Object.fromEntries(
        Object.keys(devlogColumns).map(key => [key, true])
    ) as Record<keyof typeof devlogColumns, true>;

    const shipsMask = Object.fromEntries(
        Object.keys(shipColumns).map(key => [key, true])
    ) as Record<keyof typeof shipColumns, true>

    const project = await db.query.projects.findFirst({
        columns: mask,
        // admins can still look at deleted projects
        where: and(
            eq(projects.id, id),
            admin ? undefined : isNull(projects.deletedAt)
        ),
        with: {
            author: { columns: { hcaId: true, slackId: true, username: true } },
            devlogs: { columns: devlogsMask },
            ships: {
                // admins also see withdrawn ships
                where: (ships, { isNull }) => admin ? undefined : isNull(ships.withdrawnAt),
                columns: shipsMask
            },
        },
    })

    if (!project) throw createError({
        statusCode: 404,
        message: "Project not found"
    })

    const { hackatimeProjects, ...rest } = project;
    const canSeePrivate = admin || session.user.id === project.author.hcaId;

    return {
        ...rest,
        ...(canSeePrivate && { hackatimeProjects }),
        hackatimeSeconds: await getTotalSeconds(id)
    }
})