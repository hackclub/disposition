import { eq } from "drizzle-orm";
import { addresses, users } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const [result] = await db.select({
        ...privateUserColumns,
        addresses: addresses
    })
        .from(users)
        .leftJoin(addresses, eq(addresses.user, users.hcaId))
        .where(eq(users.hcaId, session.user.id));
    if(!result) throw createError({
        statusCode: 404,
        message: "Somehow, user not found in db, even if your session has a user. desynced!! please clear cookies and relog."
    })

    return result;
});