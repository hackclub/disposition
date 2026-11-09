import { eq } from "drizzle-orm";
import { addresses, users } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const mask = Object.fromEntries(
        Object.keys(privateUserColumns).map(key => [key, true])
    ) as Record<keyof typeof privateUserColumns, true>;

    const result = await db.query.users.findFirst({
        columns: mask,
        where: eq(users.hcaId, session.user.id),
        with: { addresses: true }
    })

    if (!result) {
        clearUserSession(event);
        throw createError({
            statusCode: 400,
            message: "Session expired! Please log in again"
        })
    }
    
    return result;
});