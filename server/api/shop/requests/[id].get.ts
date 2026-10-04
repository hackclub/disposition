import { eq } from "drizzle-orm";
import * as z from "zod";
import { shopRequests } from "~~/db/schema";

export default defineEventHandler(async event => {
    const { admin, session } = await isAdmin(event);

    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const [request] = await db.select().from(shopRequests).where(eq(shopRequests.id, id));

    // 404 and not 403 for other people's requests, so ids can't be probed
    if (!request || (!admin && request.user !== session.user.id)) {
        throw createError({ statusCode: 404, message: "Request not found" });
    }

    return request;
});
