import { eq } from "drizzle-orm";
import * as z from "zod";
import { announcements } from "~~/db/schema";

export default defineEventHandler(async event => {
    await requireAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    if(!announcement) throw createError({
        statusCode: 404,
        message: "Announcement not found~"
    })

    return announcement;
})