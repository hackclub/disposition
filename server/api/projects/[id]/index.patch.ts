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

    // only the project's owner can change the banner/icon
    const { banner, icon, ...data } = parsed.data as z.infer<typeof ProjectPatchBody>;
    const bannerFile = isOwner && banner instanceof File && banner.size > 0 ? banner : undefined;
    const iconFile = isOwner && icon instanceof File && icon.size > 0 ? icon : undefined;
    const clearBanner = isOwner && banner === null && !!existing.banner;
    const clearIcon = isOwner && icon === null && !!existing.icon;

    if (!Object.keys(data).length && !bannerFile && !iconFile && !clearBanner && !clearIcon) throw createError({
        statusCode: 400,
        message: "Nothing to update"
    });

    // validate both before uploading either so a bad icon doesn't orphan a good banner
    if (bannerFile) validateImage(bannerFile);
    if (iconFile) validateImage(iconFile);

    const uploaded: BlobObject[] = [];
    let newBanner: BlobObject | undefined;
    let newIcon: BlobObject | undefined;
    try {
        if (bannerFile) uploaded.push(newBanner = await blob.put(bannerFile.name, bannerFile, {
            addRandomSuffix: true,
            prefix: "projects",
        }));

        if (iconFile) uploaded.push(newIcon = await blob.put(iconFile.name, iconFile, {
            addRandomSuffix: true,
            prefix: "projects",
        }));

        await db
            .update(projects)
            .set({
                ...data,
                ...(newBanner ? { banner: newBanner.pathname } : clearBanner && { banner: null }),
                ...(newIcon ? { icon: newIcon.pathname } : clearIcon && { icon: null }),
            })
            .where(eq(projects.id, id));
    } catch (err) {
        await Promise.all(uploaded.map(b => blob.delete(b.pathname).catch(() => { })));
        throw err;
    }

    // the old images are unreferenced now
    if ((newBanner || clearBanner) && existing.banner) await blob.delete(existing.banner).catch(() => { });
    if ((newIcon || clearIcon) && existing.icon) await blob.delete(existing.icon).catch(() => { });
});
