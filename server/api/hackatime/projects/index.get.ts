import { eq } from "drizzle-orm";
import { users } from "~~/db/schema";
import { getProjects } from "~~/server/utils/external/hackatime";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const [user] = await db.select().from(users).where(eq(users.hcaId, session.user.id));
    if (!user || !user.hackatimeToken) throw createError({
        statusCode: 403,
        message: "User not found or user hasn't linked hackatime"
    })

    return await getProjects(user.hackatimeToken);
});