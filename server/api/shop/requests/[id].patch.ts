import { requireAdmin } from "~~/server/utils/requireAdmin"
import * as z from "zod";
import { RequestPatchBody } from "~~/server/utils/shop/request";
import { shopRequests } from "~~/db/schema";
import { eq } from "drizzle-orm";
import { sendNotification } from "~~/server/utils/notification";

const requestStatusLabels: Record<string, string> = {
    idle: "Idle",
    claimed: "Claimed",
    accepted: "Accepted",
    rejected: "Rejected",
};

export default defineEventHandler(async event => {
    await requireAdmin(event);

    // i love typescript
    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const form = await readFormData(event);
    const parsed = RequestPatchBody.safeParse(Object.fromEntries(form));

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid input",
            data: z.flattenError(parsed.error)
        })
    }

    const [existing] = await db.select().from(shopRequests).where(eq(shopRequests.id, id));
    if (!existing) {
        throw createError({
            statusCode: 404,
            message: "Item not found"
        })
    }

    await db.update(shopRequests)
        .set(parsed.data)
        .where(eq(shopRequests.id, id))

    if (parsed.data.status !== existing.status) {
        const label = requestStatusLabels[parsed.data.status] ?? parsed.data.status;
        await sendNotification({
            title: `Request #${id}: ${label}`,
            description: `📀 ${existing.album} by ${existing.artist}\nStatus: ${label}`,
            user: existing.user
        });
    }
    
    return { id }
})