import { eq } from "drizzle-orm";
import * as z from "zod";
import { shopOrders } from "~~/db/schema";
import { OrderAdminPatchBody, OrderPatchBody } from "~~/server/utils/shop/order";

export default defineEventHandler(async event => {
    await requireUserSession(event);
    const { admin, session } = await isAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const body = await readFormData(event);
    console.log(Object.fromEntries(body))
    let parsed;
    if (admin) { // i dont like this if statement either
        parsed = OrderAdminPatchBody.safeParse(Object.fromEntries(body));
        if (!parsed.success) throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error)
        })
    } else {
        parsed = OrderPatchBody.safeParse(Object.fromEntries(body));
        if (!parsed.success) throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error)
        })
    }

    const [existing] = await db.select().from(shopOrders)
        .where(eq(shopOrders.id, id));
    if (!existing) throw createError({ statusCode: 404, message: "Order not found" });
    if (!admin && existing.user != session.user.id) throw createError({ statusCode: 403, message: "Forbidden from patching this order" })

    console.log(parsed.data);
    await db.update(shopOrders)
        .set(parsed.data)
        .where(eq(shopOrders.id, id));

    return { id };
});
