import { eq } from "drizzle-orm";
import * as z from "zod";
import { notifications } from "~~/db/schema";
import { NotificationPatchBody } from "~~/server/utils/notification";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const form = await readFormData(event);
    const parsed = NotificationPatchBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid data",
        data: z.flattenError(parsed.error)
    })

    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    if (!notification) throw createError({
        statusCode: 404,
        message: "Notification not found"
    })

    if (notification.user !== session.user.id) throw createError({
        statusCode: 403,
        message: "Unauthorized to view this notification"
    })

    await db.update(notifications).set({ read: parsed.data.read }).where(eq(notifications.id, id))
    return { id };
});