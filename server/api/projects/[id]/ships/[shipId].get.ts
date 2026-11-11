import { and, eq, getTableColumns } from "drizzle-orm";
import * as z from "zod";
import { ships } from "~~/db/schema";
import { privateShipColumns } from "~~/server/utils/project/project";
import { isAdmin } from "~~/server/utils/requireAdmin";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);
    const { id, shipId } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
        shipId: z.coerce.number().int().positive(),
    }).parse);

    const columns = admin ? getTableColumns(ships) : privateShipColumns;
    const mask = Object.fromEntries(
        Object.keys(columns).map(key => [key, true])
    ) as Record<keyof typeof columns, true>;

    const ship = await db.query.ships.findFirst({
        where: and(eq(ships.id, shipId), eq(ships.project, id)),
        columns: mask,
        with: {
            project: { columns: { id: true, title: true, author: true, deletedAt: true } },
            user: { columns: { hcaId: true, username: true, slackId: true } },
            devlogs: { columns: { id: true, title: true, timestamp: true } },
        },
    });

    if (!ship || (!admin && ship.user.hcaId !== session.user.id)) throw createError({
        statusCode: 404,
        message: "Ship not found"
    });

    return ship;
})
