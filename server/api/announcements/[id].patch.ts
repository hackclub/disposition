import { eq } from "drizzle-orm";
import * as z from "zod";
import { announcements } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const form = await readFormData(event);
    const parsed = AnnouncementPatchBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid Input",
        data: z.flattenError(parsed.error)
    });

    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    if(!announcement) throw createError({
        statusCode: 404,
        message: "Announcement not found"
    })

    if(announcement.author !== session.user.id) throw createError({
        statusCode: 403,
        message: "Unauthorized to patch this announcement"
    })

    const [result] = await db.update(announcements)
        .set({
            title: parsed.data.title,
            description: parsed.data.description,
        })
        .where(eq(announcements.id, id))
        .returning({ id: announcements.id })

    return { id: result!.id }
})