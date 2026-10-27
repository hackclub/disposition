import { eq } from "drizzle-orm";
import * as z from "zod";
import { users } from "~~/db/schema";

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const form = await readFormData(event);
    const parsed = UserPatchBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error),
    })

    const file = form.get("banner");
    let uploaded;
    if (file instanceof File && file.size > 0) {
        validateImage(file);

        uploaded = await blob.put(file.name, file, {
            addRandomSuffix: true,
            prefix: "banner",
        });
    }

    const [result] = await db.update(users)
        .set({
            username: parsed.data.username,
            bio: parsed.data.bio,
            onboardedAt: parsed.data.onboardedAt,
            banner: uploaded?.pathname,
        })
        .where(eq(users.hcaId, session.user.id))
        .returning({ hcaId: users.hcaId })

    if(!result) throw createError({
        statusCode: 500,
        message: "Error updating database user"
    })

    await setUserSession(event, {
        ...session,
        user: {
            ...session.user,
            username: parsed.data.username ? parsed.data.username : session.user.username,
            bio: parsed.data.bio ?? session.user.bio,
            onboardedAt: parsed.data.onboardedAt ?? session.user.onboardedAt,
            banner: uploaded?.pathname ?? session.user.banner
        }
    });

    return { id: users.hcaId }
});