import * as z from "zod";
import { desc, eq, getTableColumns, and, gt, isNull } from "drizzle-orm";
import { projects, ships, users, devlogs } from "~~/db/schema";

function getPublicProjectColumns() {
    const { deletedAt, hackatimeProjects, ...publicProjectColumns } = getTableColumns(projects);
    return publicProjectColumns;
}

function getPrivateProjectColumns() {
    const { deletedAt, ...privateProjectColumns } = getTableColumns(projects);
    return privateProjectColumns;
}

export const publicProjectColumns = getPublicProjectColumns()
export const privateProjectColumns = getPrivateProjectColumns();

// modelled after the project setup wizard thing. i don't ask for a demo url on new project because that would be stupid
// same applies to the ai declaration and update declaration
export const ProjectPostBody = z.object({
    title: z.string().min(1),
    description: z.string().min(1),

    // banner: z.instanceof(File).optional(),
    // icon: z.instanceof(File).optional(),
    repository: z.string().optional(),
    // demo: z.string().optional(),
    hackatimeProjects: z.array(z.string()).optional(),
})

export const ProjectPatchBody = z.object({
    title: z.string().optional(),
    description: z.string().optional(),

    banner: z.instanceof(File).optional(),
    icon: z.instanceof(File).optional(),
    repository: z.string().optional(),
    demo: z.string().optional(),
    hackatimeProjects: z.array(z.string()).optional(),

    ai: z.stringbool().optional(),
    aiDeclaration: z.string().optional(),

    update: z.stringbool().optional(),
    updateDeclaration: z.string().optional(),
})

export const ProjectAdminPatchBody = z.object({
    platinum: z.boolean().optional()
})

// ships // 
export async function getSecondsSinceLastShip(id: number): Promise<number> {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, id), isNull(projects.deletedAt)));
    if (!project) return -1;

    const [author] = await db.select().from(users).where(eq(users.hcaId, project.author));
    if (!author) return -1;
    if (!author.hackatimeToken) return -1;

    const [lastShip] = await db.select().from(ships).where(and(eq(ships.project, id), isNull(ships.withdrawnAt))).orderBy(desc(ships.timestamp));
    const since = lastShip ? lastShip.timestamp : getLaunchDate();

    const details = await Promise.all(project.hackatimeProjects.map(hackatimeProject =>
        getProjectDetails(author.hackatimeToken!, hackatimeProject, author.slackId, since)
    ));
    const seconds = details.reduce((total, d) => total + (d?.total_seconds ?? 0), 0);

    return seconds;
}

export async function getTotalSeconds(id: number): Promise<number> {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, id), isNull(projects.deletedAt)));
    if (!project) return -1;

    const [author] = await db.select().from(users).where(eq(users.hcaId, project.author));
    if (!author) return -1;
    if (!author.hackatimeToken) return -1;
    const since = getLaunchDate();

    const details = await Promise.all(project.hackatimeProjects.map(hackatimeProject =>
        getProjectDetails(author.hackatimeToken!, hackatimeProject, author.slackId, since)
    ));
    const seconds = details.reduce((total, d) => total + (d?.total_seconds ?? 0), 0);

    return seconds;
}

// export async function getSecondsSinceLastDevlog(id: number): Promise<number> {
//     const [project] = await db.select().from(projects).where(eq(projects.id, id));
//     if (!project) return -1;

//     const [author] = await db.select().from(users).where(eq(users.hcaId, project.author));
//     if (!author) return -1;
//     if (!author.hackatimeToken) return -1;

//     const [lastDevlog] = await db.select().from(devlogs).where(eq(devlogs.project, id)).orderBy(desc(devlogs.timestamp));
//     let since: Date;
//     if (!lastDevlog) since = config.public.startDate;
//     else since = lastDevlog.timestamp;

//     let seconds: number = 0;
//     project.hackatimeProjects.forEach(async hackatimeProject => {
//         const details = await getProjectDetails(author.hackatimeToken!, hackatimeProject, author.slackId, since);
//         seconds += details.total_seconds
//     })

//     return seconds;
// }

function getPublicShipColumns() {
    const { hackatimeProjects, statusMessage, reviewerNote, overrideSeconds, overrideReason, internalMessage, ai, aiDeclaration, update, updateDeclaration, withdrawnAt, ...publicShipColumns } = getTableColumns(ships);
    return publicShipColumns
}

function getPrivateShipColumns() {
    const { internalMessage, overrideSeconds, overrideReason, withdrawnAt, ...privateShipColumns } = getTableColumns(ships);
    return privateShipColumns
}

export const publicShipColumns = getPublicShipColumns()
export const privateShipColumns = getPrivateShipColumns()

export const ShipPostBody = z.object({
    project: z.number().min(1),
    reviewerNote: z.string().optional(),

    ai: z.boolean().default(false).optional(),
    aiDeclaration: z.string().optional(),

    update: z.boolean().default(false).optional(),
    updateDeclaration: z.string().optional()
})

// export const ShipAdminPatchBody = z.object({
//     overrideHours: z.number().optional(),
//     overrideReason: z.string().optional(),
//     internalMessage: z.string().optional(),
//     statusMessage: z.string(),
// }) // handled by ari