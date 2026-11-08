import { getTableColumns, eq, isNull, and } from "drizzle-orm";
import { ships, projects } from "~~/db/schema";
import * as z from "zod";

export default defineEventHandler(async event => {
    const session = await requireAdmin(event);
    const { user } = await getValidatedQuery(event, z.object({
        user: z.string().optional(),
    }).parse);

    const result = await db
        .select({ ...getTableColumns(ships), project: projects })
        .from(ships)
        .innerJoin(projects, eq(ships.project, projects.id))
        .where(and(
            isNull(ships.withdrawnAt),
            user ? eq(projects.author, user) : undefined,
        ));

    return result;
})