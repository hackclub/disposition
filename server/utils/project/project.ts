import * as z from "zod";
import { getTableColumns } from "drizzle-orm";
import { projects } from "~~/db/schema";

function getPublicProjectColumns() {
    const { deletedAt, hackatimeProjects, ...publicProjectColumns } = getTableColumns(projects);
    return publicProjectColumns;
}

export const publicProjectColumns = getPublicProjectColumns()

export const ProjectPostBody = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
})

export const ProjectPatchBody = z.object({
    title: z.string().optional(),
    description: z.string().optional(),

    banner: z.instanceof(File).optional(),
    repository: z.string().optional(),
    demo: z.string().optional(),
    hackatimeProjects: z.array(z.string()).optional(),
})

export const ProjectAdminPatchBody = z.object({
    platinum: z.boolean().optional()
})