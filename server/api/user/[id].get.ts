import { eq } from "drizzle-orm";
import { users } from "~~/db/schema";
import * as z from "zod";
import { publicUserColumns } from "~~/server/utils/user/user";

export default defineEventHandler(async event => {
    await requireUserSession(event);
    const admin = await isAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.string().min(1).max(16),
    }).parse).then(p => p.id);

    let user;
    if(admin) {
        [user] = await db.select().from(users).where(eq(users.hcaId, id));
    } else {
        [user] = await db.select(publicUserColumns).from(users).where(eq(users.hcaId, id));
    }
    
    if (!user) throw createError({
        statusCode: 400,
        message: "User not found"
    });

    return user;
})