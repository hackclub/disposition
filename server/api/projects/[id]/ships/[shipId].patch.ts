// import type { BlobObject } from "@nuxthub/core/blob";
// import { eq, isNull, and } from "drizzle-orm";
// import * as z from "zod";
// import { projects } from "~~/db/schema";
// import { ProjectPatchBody, ProjectAdminPatchBody } from "~~/server/utils/project/project";
// import { isAdmin } from "~~/server/utils/requireAdmin"

// export default defineEventHandler(async event => {
//     const {admin, session} = await isAdmin(event);

//     const { id } = await getValidatedRouterParams(event, z.object({
//         id: z.coerce.number().int().positive(),
//     }).parse);

//     const [existing] = await db.select().from(projects).where(and(eq(projects.id, id), isNull(projects.deletedAt)));
//     if (!existing) throw createError({
//         statusCode: 404,
//         message: "Project not found"
//     });

//     const isOwner = session.user.id === existing.author;
//     if(!admin && !isOwner) throw createError({
//         statusCode: 403,
//         message: "Unauthorized to edit this ship"
//     })

//     const schema = admin ? (isOwner ? )
//     const form = await readFormData(event);
//     const parsed = admin ? ProjectAdminPatchBody.safeParse() : ProjectPatchBody.safeParse(form);
// })

// handled by ari :)