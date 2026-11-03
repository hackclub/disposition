import { getTableColumns } from "drizzle-orm";
import * as z from "zod";
import { devlogs } from "~~/db/schema";

function getPublicDevlogColumns() {
    const { ...publicDevlogColumns } = getTableColumns(devlogs); // remnant and lowk should be deleted but ill keep it because im lazy
    return publicDevlogColumns
}

export const publicDevlogColumns = getPublicDevlogColumns();

export const DevlogPostBody = z.object({
    project: z.number().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    attachments: z.instanceof(File).array().optional()
})

export const DevlogPatchBody = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    attachments: z.instanceof(File).array().optional()
})

export const DevlogAdminPatchBody = z.object({
    overrideHours: z.number().min(1),
    overrideReason: z.string()
})