import { and, eq, getTableColumns, inArray, isNull } from "drizzle-orm";
import { devlogs, projects, users, ships } from "~~/db/schema";
import * as z from "zod";
import { privateShipColumns, publicShipColumns } from "~~/server/utils/project/project";
import { publicDevlogColumns } from "~~/server/utils/project/devlog";
import { isAdmin } from "~~/server/utils/requireAdmin";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);
    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.string().min(1).max(16),
    }).parse);
    const isOwner = session.user.id === id;

    const shipsColumns = admin ? getTableColumns(ships) : (isOwner ? privateShipColumns : publicShipColumns);
    const shipsMask = Object.fromEntries(
        Object.keys(shipsColumns).map(key => [key, true])
    ) as Record<keyof typeof shipsColumns, true>;

    const devlogsColumns = admin ? getTableColumns(devlogs) : publicDevlogColumns;
    const devlogsMask = Object.fromEntries(
        Object.keys(devlogsColumns).map(key => [key, true])
    ) as Record<keyof typeof devlogsColumns, true>;

    const liveProjects = db.select({ id: projects.id }).from(projects).where(isNull(projects.deletedAt));
    const projectColumns = { id: true, title: true, icon: true } as const;
    
    const user = await db.query.users.findFirst({
        where: eq(users.hcaId, id),
        columns: { hcaId: true },
        with: {
            ships: {
                where: (ships, { isNull }) => and(
                    isNull(ships.withdrawnAt),
                    inArray(ships.project, liveProjects),
                ),
                columns: shipsMask,
                with: { project: { columns: projectColumns } },
            },
            devlogs: {
                where: devlogs => inArray(devlogs.project, liveProjects),
                columns: devlogsMask,
                with: { project: { columns: projectColumns } },
            },
        },
    });

    if (!user) throw createError({
        statusCode: 404,
        message: "User not found"
    });
    
    return [
        ...user.ships.map(ship => ({ type: "ship" as const, ...ship })),
        ...user.devlogs.map(devlog => ({ type: "devlog" as const, ...devlog })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
});
