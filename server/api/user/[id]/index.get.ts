import { eq, getTableColumns } from "drizzle-orm";
import { users } from "~~/db/schema";
import * as z from "zod";
import { privateUserColumns, publicUserColumns } from "~~/server/utils/user/user";
import { isAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);
    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.string().min(1).max(16),
    }).parse);
    const isOwner = session.user.id === id;

    const userColumns = admin ? getTableColumns(users) : (isOwner ? privateUserColumns : publicUserColumns);
    const mask = Object.fromEntries(
        Object.keys(userColumns).map(key => [key, true])
    ) as Record<keyof typeof userColumns, true>;

    const result = await db.query.users.findFirst({
        where: eq(users.hcaId, id),
        columns: mask
    })
    if (!result) throw createError({
        statusCode: 404,
        message: "User not found"
    })

    return result;
})
