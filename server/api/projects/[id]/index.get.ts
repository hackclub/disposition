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

    const columns = admin ? getTableColumns(projects) : publicProjectColumns
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
        where: and(
            eq(projects.id, id),
            isNull(projects.deletedAt)
        ),
        with: {
            author: { columns: { hcaId: true, slackId: true, username: true } },
            devlogs: { columns: devlogsMask },
            ships: {
                where: (ships, { isNull }) => isNull(ships.withdrawnAt),
                columns: shipsMask
            },
        },
    })

    if (!project) throw createError({
        statusCode: 404,
        message: "Project not found"
    })

    return {
        ...project,
        hackatimeSeconds: await getTotalSeconds(id)
    }
})