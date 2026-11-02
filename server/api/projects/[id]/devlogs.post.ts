import * as z from "zod";
import { devlogs } from "~~/db/schema";
import { DevlogPostBody } from "~~/server/utils/project/devlog";

export default defineEventHandler(async event => {
    const {admin, session} = await isAdmin(event);

    const form = await readFormData(event);
    const parsed = DevlogPostBody.safeParse(Object.fromEntries(form));
    if(!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error)
    })

    // UGH TODO ATTACHMENTS :SOB::SOB::SOB:
    
    const devlog: typeof devlogs.$inferInsert = {
        title: parsed.data.title,
        description: parsed.data.description,
        author: session.user.id,
        project: parsed.data.project,
    }
});