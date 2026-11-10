import type { BlobObject } from "@nuxthub/core/blob";
import { eq, isNull, and } from "drizzle-orm";
import * as z from "zod";
import { projects } from "~~/db/schema";
import { ProjectPatchBody, ProjectAdminPatchBody } from "~~/server/utils/project/project";
import { isAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse);

    const [existing] = await db.select().from(projects).where(and(eq(projects.id, id), isNull(projects.deletedAt)));
    if (!existing) throw createError({ statusCode: 404, message: "Project not found" });

    const isOwner = session.user.id === existing.author;
    if (!admin && !isOwner) throw createError({
        statusCode: 403,
        message: "Unauthorized to edit this project"
    });

    const schema = admin ? (isOwner ? ProjectPatchBody : ProjectAdminPatchBody) : ProjectPatchBody;
    const form = await readFormData(event);
    // Object.fromEntries only keeps the last value of a repeated key, so collect the array field separately.
    // only include it when it was sent, otherwise every PATCH would wipe the linked projects
    const parsed = schema.safeParse({
        ...Object.fromEntries(form),
        ...(form.has("hackatimeProjects") && { hackatimeProjects: form.getAll("hackatimeProjects") }),
    });
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error as z.ZodError),
    });

    // only the project's owner can change the banner
    const { banner, icon, ...data } = parsed.data as z.infer<typeof ProjectPatchBody>;
    const bannerFile = isOwner && banner instanceof File && banner.size > 0 ? banner : undefined;
    const iconFile = isOwner && icon instanceof File && icon.size > 0 ? icon : undefined;

    if (!Object.keys(data).length && !bannerFile && !iconFile) throw createError({
        statusCode: 400,
        message: "Nothing to update"
    });

    let newBanner: BlobObject | undefined;
    let newIcon: BlobObject | undefined;
    if (bannerFile) {
        validateImage(bannerFile);
        newBanner = await blob.put(bannerFile.name, bannerFile, {
            addRandomSuffix: true,
            prefix: "projects",
        });
    }

    if (iconFile) {
        validateImage(iconFile);
        newIcon = await blob.put(iconFile.name, iconFile, {
            addRandomSuffix: true,
            prefix: "projects"
        })
    }

    try {
        await db
            .update(projects)
            .set({
                ...data,
                ...(newBanner && { banner: newBanner.pathname }),
                ...(newIcon && { icon: newIcon.pathname })
            })
            .where(eq(projects.id, id));
    } catch (err) {
        if (newBanner) await blob.delete(newBanner.pathname).catch(() => { });
        throw err;
    }

    if (newBanner && existing.banner) await blob.delete(existing.banner).catch(() => { });
    if (newIcon && existing.icon) await blob.delete(existing.icon).catch(() => { });
});