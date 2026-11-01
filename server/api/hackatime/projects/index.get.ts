import { eq } from "drizzle-orm";
import { users } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const [user] = await db.select().from(users).where(eq(users.hcaId, session.user.id));
    if (!user || !user.hackatimeToken) throw createError({
        statusCode: 403,
        message: "User not found or user hasn't linked hackatime"
    })

    // where tf would i store the launch date..? anyways...
    // TODO: add ?since=LAUNCH_DATE
    return await $fetch("https://hackatime.hackclub.com/api/v1/authenticated/projects" as string, {
        headers: {
            Authorization: `Bearer ${user.hackatimeToken}`
        }
    })
});