import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import * as z from "zod";
import { projects, ships, users } from "~~/db/schema";

// admin list of every ship (or one user's with ?user=<hcaId>)
export default defineEventHandler(async event => {
    await requireAdmin(event);
    const { user, status, withdrawn } = await getValidatedQuery(event, z.object({
        user: z.string().optional(),
        status: z.enum(["idle", "claimed", "accepted", "rejected"]).optional(),
        // "only" = just withdrawn ships, "include" = everything, default hides them
        withdrawn: z.enum(["include", "only"]).optional(),
    }).parse);

    return db.select({
        id: ships.id,
        status: ships.status,
        hackatimeSeconds: ships.hackatimeSeconds,
        update: ships.update,
        withdrawnAt: ships.withdrawnAt,
        timestamp: ships.timestamp,
        project: { id: projects.id, title: projects.title },
        user: { hcaId: users.hcaId, username: users.username },
    })
        .from(ships)
        .innerJoin(projects, eq(projects.id, ships.project))
        .innerJoin(users, eq(users.hcaId, ships.user))
        .where(and(
            user ? eq(ships.user, user) : undefined,
            status ? eq(ships.status, status) : undefined,
            withdrawn === "only" ? isNotNull(ships.withdrawnAt) : withdrawn === "include" ? undefined : isNull(ships.withdrawnAt),
        ))
        .orderBy(desc(ships.timestamp));
})
