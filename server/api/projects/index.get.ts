import { projects } from "~~/db/schema";
import { eq, desc, isNull, and, getTableColumns } from "drizzle-orm";
import { privateProjectColumns } from "~~/server/utils/project/project";

const allProjectColumns = getTableColumns(projects);
const allProjectsMask = Object.fromEntries(
    Object.keys(allProjectColumns).map(key => [key, true])
) as Record<keyof typeof allProjectColumns, true>;

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    // ?user=all (admins) lists everything, ?user=<hcaId> (admins) lists someone else's
    const userId = await resolveUserScope(event, session.user.id);

    // admin overview: every project, deleted ones included. no hackatime here, that'd be one api call per project
    if (!userId) {
        return db.query.projects.findMany({
            columns: allProjectsMask,
            with: {
                author: { columns: { hcaId: true, slackId: true, username: true } },
            },
            orderBy: desc(projects.timestamp)
        });
    }

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
            eq(projects.author, userId),
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