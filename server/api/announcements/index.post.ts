import { AnnouncementPostBody } from "~~/server/utils/notification";
import * as z from "zod";
import { announcements } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireAdmin(event);

    const form = await readFormData(event);
    const parsed = AnnouncementPostBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid data",
        data: z.flattenError(parsed.error)
    })

    const announcement: typeof announcements.$inferInsert = {
        title: parsed.data.title,
        description: parsed.data.description,
        author: session.user.id
    }

    const [result] = await db.insert(announcements).values(announcement).returning({ id: announcements.id });

    setResponseStatus(event, 201);
    return { id: result!.id };
})