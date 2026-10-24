import { NotificationPostBody } from "#imports";
import * as z from "zod";
import { notifications } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireAdmin(event);

    const form = await readFormData(event);
    const parsed = NotificationPostBody.safeParse(Object.fromEntries(form));

    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error),
    })

    const notification: typeof notifications.$inferInsert = {
        user: parsed.data.user,
        title: parsed.data.title,
        description: parsed.data.description
    }

    const [result] = await db.insert(notifications).values(notification).returning({ id: notifications.id });

    setResponseStatus(event, 201);
    return { id: result!.id };
})