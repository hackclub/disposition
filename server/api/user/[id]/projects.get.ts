import { desc, eq, getTableColumns } from "drizzle-orm";
import { devlogs, projects, ships, users } from "~~/db/schema";
import * as z from "zod";
import { getTotalSeconds, privateProjectColumns, privateShipColumns, publicProjectColumns, publicShipColumns } from "~~/server/utils/project/project";
import { publicDevlogColumns } from "~~/server/utils/project/devlog";
import { isAdmin } from "~~/server/utils/requireAdmin";

// same shape as GET /api/projects/:id, one per project
export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);
    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.string().min(1).max(16),
    }).parse);
    const isOwner = session.user.id === id;

    const projectColumns = admin ? getTableColumns(projects) : (isOwner ? privateProjectColumns : publicProjectColumns);
    const projectsMask = Object.fromEntries(
        Object.keys(projectColumns).map(key => [key, true])
    ) as Record<keyof typeof projectColumns, true>;

    const devlogColumns = admin ? getTableColumns(devlogs) : publicDevlogColumns;
    const devlogsMask = Object.fromEntries(
        Object.keys(devlogColumns).map(key => [key, true])
    ) as Record<keyof typeof devlogColumns, true>;

    const shipColumns = admin ? getTableColumns(ships) : (isOwner ? privateShipColumns : publicShipColumns);
    const shipsMask = Object.fromEntries(
        Object.keys(shipColumns).map(key => [key, true])
    ) as Record<keyof typeof shipColumns, true>;

    const user = await db.query.users.findFirst({
        where: eq(users.hcaId, id),
        columns: { hcaId: true },
        with: {
            projects: {
                where: (projects, { isNull }) => isNull(projects.deletedAt),
                columns: projectsMask,
                orderBy: desc(projects.timestamp),
                with: {
                    author: { columns: { hcaId: true, slackId: true, username: true } },
                    devlogs: { columns: devlogsMask },
                    ships: {
                        where: (ships, { isNull }) => isNull(ships.withdrawnAt),
                        columns: shipsMask,
                    },
                },
            },
        },
    });

    if (!user) throw createError({
        statusCode: 404,
        message: "User not found"
    });

    return Promise.all(
        user.projects.map(async project => ({
            ...project,
            hackatimeSeconds: await getTotalSeconds(project.id),
        }))
    );
});
