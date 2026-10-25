import { eq } from "drizzle-orm";
import * as z from "zod";
import { shopItems, shopOrders } from "~~/db/schema";
import { Notification, sendNotification } from "~~/server/utils/notification";
import { OrderAdminPatchBody, OrderPatchBody } from "~~/server/utils/shop/order";

const orderStatusLabels: Record<string, string> = {
    idle: "Idle",
    claimed: "Claimed",
    fulfilled: "Fulfilled",
    cancelled: "Cancelled",
};

export default defineEventHandler(async event => {
    await requireUserSession(event);
    const { admin, session } = await isAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const body = await readFormData(event);

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

    await db.update(shopOrders)
        .set(parsed.data)
        .where(eq(shopOrders.id, id));

    if (admin) {
        const newStatus = "status" in parsed.data && parsed.data.status !== existing.status ? parsed.data.status : undefined;
        const newTracking = "tracking" in parsed.data && parsed.data.tracking !== existing.tracking ? parsed.data.tracking : undefined;

        if (newStatus || newTracking) {
            const [item] = await db.select({ album: shopItems.album, artist: shopItems.artist })
                .from(shopItems)
                .where(eq(shopItems.id, existing.item));

            const lines: string[] = [];
            if (item) lines.push(`📀 ${item.album} by ${item.artist}`);
            if (newStatus) lines.push(`Status: ${orderStatusLabels[newStatus] ?? newStatus}`);
            if (newTracking) lines.push(`🚚 Tracking: ${newTracking}`);

            await sendNotification({
                title: newStatus
                    ? `Order #${id}: ${orderStatusLabels[newStatus] ?? newStatus}`
                    : `Order #${id} updated`,
                description: lines.join("\n"),
                user: existing.user
            });
        }
    }

    return { id };
});
