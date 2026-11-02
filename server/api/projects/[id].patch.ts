import { BlobObject } from "@nuxthub/core/blob";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { projects } from "~~/db/schema";
import { ProjectPatchBody, ProjectAdminPatchBody } from "~~/server/utils/project/project";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const { id } = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse);

    const [existing] = await db.select().from(projects).where(eq(projects.id, id));
    if (!existing) throw createError({ statusCode: 404, message: "Project not found" });

    const isOwner = session.user.id === existing.author;
    if (!admin && !isOwner) throw createError({
        statusCode: 403,
        message: "Unauthorized to edit this project"
    });

    const schema = admin ? (isOwner ? ProjectPatchBody : ProjectAdminPatchBody) : ProjectPatchBody;
    const form = await readFormData(event);
    const parsed = schema.safeParse(Object.fromEntries(form));
    if (!parsed.success) throw createError({
        statusCode: 400,
        message: "Invalid input",
        data: z.flattenError(parsed.error as z.ZodError),
    });

    // only the project's owner can change the banner
    const { banner, ...data } = parsed.data as z.infer<typeof ProjectPatchBody>;
    const bannerFile = isOwner && banner instanceof File && banner.size > 0 ? banner : undefined;

    if (!Object.keys(data).length && !bannerFile) throw createError({
        statusCode: 400,
        message: "Nothing to update"
    });

    let newImage: BlobObject | undefined;
    if (bannerFile) {
        validateImage(bannerFile);
        newImage = await blob.put(bannerFile.name, bannerFile, {
            addRandomSuffix: true,
            prefix: "projects",
        });
    }

    try {
        await db
            .update(projects)
            .set({ ...data, ...(newImage && { banner: newImage.pathname }) })
            .where(eq(projects.id, id));
    } catch (err) {
        if (newImage) await blob.delete(newImage.pathname).catch(() => { });
        throw err;
    }

    if (newImage && existing.banner) {
        await blob.delete(existing.banner).catch(() => { });
    }
});