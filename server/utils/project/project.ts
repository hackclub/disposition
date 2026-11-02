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

// ships //
export const ShipPostBody = z.object({
    project: z.number().min(1),
    reviewerNote: z.string().optional(),
    
    ai: z.boolean().default(false).optional(),
    aiDeclaration: z.string().optional(),

    update: z.boolean().default(false).optional(),
    updateDeclaration: z.string().optional()
})

export const ShipAdminPatchBody = z.object({
    overrideHours: z.number().optional(),
    overrideReason: z.string().optional(),
    internalMessage: z.string().optional(),
    statusMessage: z.string(),
})