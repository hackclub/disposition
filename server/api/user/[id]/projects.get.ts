import { desc, eq, getTableColumns } from "drizzle-orm";
import { projects, users } from "~~/db/schema";
import * as z from "zod";
import { getTotalSeconds, privateProjectColumns, publicProjectColumns } from "~~/server/utils/project/project";
import { isAdmin } from "~~/server/utils/requireAdmin";

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

    const user = await db.query.users.findFirst({
        where: eq(users.hcaId, id),
        columns: { hcaId: true },
        with: {
            projects: {
                where: (projects, { isNull }) => isNull(projects.deletedAt),
                columns: projectsMask,
                orderBy: desc(projects.timestamp),
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
