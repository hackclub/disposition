import { projects } from "~~/db/schema";
import { eq, desc, isNull, and } from "drizzle-orm";
import { privateProjectColumns } from "~~/server/utils/project/project";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const mask = Object.fromEntries(
        Object.keys(privateProjectColumns).map(key => [key, true])
    ) as Record<keyof typeof privateProjectColumns, true>;

    const devlogsMask = Object.fromEntries(
        Object.keys(publicDevlogColumns).map(key => [key, true])
    ) as Record<keyof typeof publicDevlogColumns, true>;

    const shipsMask = Object.fromEntries(
        Object.keys(privateShipColumns).map(key => [key, true])
    ) as Record<keyof typeof privateShipColumns, true>

    const result = await db.query.projects.findMany({
        columns: mask,
        where: and(
            eq(projects.author, session.user.id),
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
        orderBy: desc(projects.timestamp)
    })

    return Promise.all(
        result.map(async project => ({
            ...project,
            hackatimeSeconds: await getTotalSeconds(project.id)
        }))
    );
})