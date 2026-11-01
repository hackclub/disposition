import { and, eq, ne } from "drizzle-orm";
import * as z from "zod";
import { users } from "~~/db/schema";
import { slugifyUsername } from "~~/server/utils/user/user";

// drizzle can wrap pg errors, so unwrap `cause` before inspecting
function isUniqueViolation(error: unknown, constraint: string) {
    const err = (error as { cause?: unknown }).cause ?? error;
    const { code, constraint: name } = err as { code?: string; constraint?: string };
    return code === "23505" && name === constraint;
}

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const form = await readFormData(event);
    const parsed = UserPatchBody.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error),
    })

    // normalize the username the same way it is normalized when generated
    const rawUsername = parsed.data.username;
    const username = rawUsername === undefined ? undefined : slugifyUsername(rawUsername);
    if (username !== undefined && username !== rawUsername) throw createError({
        statusCode: 400,
        message: "Invalid username",
        data: { username: "Usernames must be 2-24 characters, letters, numbers and underscores only" },
    })

    // check ahead of the unique constraint so we can return a nice error
    if (username !== undefined) {
        const [taken] = await db.select({ hcaId: users.hcaId })
            .from(users)
            .where(and(eq(users.username, username), ne(users.hcaId, session.user.id)))
            .limit(1);

        if (taken) throw createError({
            statusCode: 409,
            message: "Username already taken",
            data: { username: "That username is already taken" },
        })
    }

    const file = form.get("banner");
    let uploaded;
    if (file instanceof File && file.size > 0) {
        validateImage(file);

        uploaded = await blob.put(file.name, file, {
            addRandomSuffix: true,
            prefix: "banner",
        });
    }

    let result;
    try {
        [result] = await db.update(users)
            .set({
                username,
                bio: parsed.data.bio,
                onboardedAt: parsed.data.onboardedAt,
                banner: uploaded?.pathname,
            })
            .where(eq(users.hcaId, session.user.id))
            .returning({ hcaId: users.hcaId })
    } catch (error) {
        // someone could have grabbed the username between the check and the update
        if (isUniqueViolation(error, "users_username_unique")) throw createError({
            statusCode: 409,
            message: "Username already taken",
            data: { username: "That username is already taken" },
        })

        throw error;
    }

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
