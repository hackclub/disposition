import { and, desc, eq, isNull, lt } from "drizzle-orm";
import * as z from "zod";
import { devlogs, projects, ships, users } from "~~/db/schema";
import { publicShipColumns } from "~~/server/utils/project/project";
import { publicDevlogColumns } from "~~/server/utils/project/devlog";

export default defineEventHandler(async event => {
    await requireUserSession(event);
    const { limit, before } = await getValidatedQuery(event, z.object({
        limit: z.coerce.number().int().min(1).max(50).default(20),
        before: z.coerce.date().optional(),
    }).parse);

    const project = { id: projects.id, title: projects.title, icon: projects.icon };
    const author = { hcaId: users.hcaId, username: users.username };

    const [shipRows, devlogRows] = await Promise.all([
        db.select({ ...publicShipColumns, project, author })
            .from(ships)
            .innerJoin(projects, eq(projects.id, ships.project))
            .innerJoin(users, eq(users.hcaId, ships.user))
            .where(and(
                isNull(ships.withdrawnAt),
                isNull(projects.deletedAt),
                before ? lt(ships.timestamp, before) : undefined,
            ))
            .orderBy(desc(ships.timestamp))
            .limit(limit),
        db.select({ ...publicDevlogColumns, project, author })
            .from(devlogs)
            .innerJoin(projects, eq(projects.id, devlogs.project))
            .innerJoin(users, eq(users.hcaId, devlogs.author))
            .where(and(
                isNull(projects.deletedAt),
                before ? lt(devlogs.timestamp, before) : undefined,
            ))
            .orderBy(desc(devlogs.timestamp))
            .limit(limit),
    ]);

    const items = [
        ...shipRows.map(ship => ({ type: "ship" as const, ...ship })),
        ...devlogRows.map(devlog => ({ type: "devlog" as const, ...devlog })),
    ]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

    const nextCursor = items.length === limit ? items.at(-1)!.timestamp : null;
    return { items, nextCursor };
});
