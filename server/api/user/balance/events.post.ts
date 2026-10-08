import { BalanceEventPostBody } from "~~/server/utils/user/balanceEvent";
import * as z from "zod";
import { balanceEvents } from "~~/db/schema";

export default defineEventHandler(async event => {
    await requireAdmin(event);

    const form = await readFormData(event);
    const parsed = BalanceEventPostBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error),
        })
    }

    const balanceEvent: typeof balanceEvents.$inferInsert = {
        user: parsed.data.user,
        description: parsed.data.description,
        value: parsed.data.value,
    }

    const [result] = await db.insert(balanceEvents).values(balanceEvent).returning({ id: balanceEvents.id });
    setResponseStatus(event, 201);
    return { id: result!.id };
})