import { and, eq, ne } from "drizzle-orm";
import * as z from "zod";
import { users } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const { username } = await getValidatedQuery(event, z.object({
        username: z.string().min(1).max(24),
    }).parse);

    const slug = slugifyUsername(username);
    if (slug !== username) return { available: false, reason: "invalid" };

    const [taken] = await db.select({ hcaId: users.hcaId })
        .from(users)
        .where(and(eq(users.username, username), ne(users.hcaId, session.user.id)))
        .limit(1);

    return { available: !taken };
});