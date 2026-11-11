import { and, eq, getTableColumns, isNull } from "drizzle-orm";
import * as z from "zod";
import { devlogs, projects, ships } from "~~/db/schema";

function getPublicDevlogColumns() {
    const { ...publicDevlogColumns } = getTableColumns(devlogs); // remnant and lowk should be deleted but ill keep it because im lazy
    return publicDevlogColumns
}

export const publicDevlogColumns = getPublicDevlogColumns();

// the project comes from the route (/api/projects/:id/devlogs), not the body
export const DevlogPostBody = z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    attachments: z.instanceof(File).array().optional()
})

export const DevlogPatchBody = z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    // sending attachments replaces all of them
    attachments: z.instanceof(File).array().optional()
})

export const DevlogAdminPatchBody = z.object({
    overrideHours: z.number().min(1),
    overrideReason: z.string()
})

export const devlogRouteParams = z.object({
    id: z.coerce.number().int().positive(),
    devlogId: z.coerce.number().int().positive(),
});

// helper function so i dont repeat the same code over and over
export async function getDevlog(projectId: number, devlogId: number) {
    const [result] = await db.select({ devlog: devlogs, project: projects })
        .from(devlogs)
        .innerJoin(projects, eq(projects.id, devlogs.project))
        .where(and(
            eq(devlogs.id, devlogId),
            eq(devlogs.project, projectId),
            isNull(projects.deletedAt),
        ));

    if (!result) throw createError({
        statusCode: 404,
        message: "Devlog not found"
    });

    return result;
}

export async function isShipped(devlog: typeof devlogs.$inferSelect) {
    if (!devlog.linkedShip) return false;
    const [ship] = await db.select({ id: ships.id }).from(ships).where(and(eq(ships.id, devlog.linkedShip), isNull(ships.withdrawnAt)));
    return !!ship;
}

export async function uploadAttachments(files: File[], prefix: string) {
    const valid = files.filter(file => file.size > 0);
    valid.forEach(validateImage);

    const uploaded: string[] = [];
    try {
        for (const file of valid) {
            uploaded.push((await blob.put(file.name, file, { addRandomSuffix: true, prefix })).pathname);
        }
    } catch (err) {
        await deleteAttachments(uploaded);
        throw err;
    }
    return uploaded;
}

export async function deleteAttachments(pathnames: string[]) {
    await Promise.all(pathnames.map(pathname => blob.del(pathname).catch(console.error)));
}
