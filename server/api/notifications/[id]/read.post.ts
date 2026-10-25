import { eq } from "drizzle-orm";
import { notifications } from "~~/db/schema";
import * as z from "zod";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const [result] = await db.select().from(notifications).where(eq(notifications.id, id));
    if (!result) throw createError({
        statusCode: 404,
        message: "Notification not found"
    })

    if (result.user !== session.user.id) throw createError({
        statusCode: 403,
        message: "Unauthroized to read this notification"
    })

    if (result.read === true) return; // already marked as read
    const [update] = await db.update(notifications).set({ read: true }).where(eq(notifications.id, id)).returning({ id: notifications.id });
    if(!update) throw createError("Error updating notification");
    
    return { id: update.id };
})