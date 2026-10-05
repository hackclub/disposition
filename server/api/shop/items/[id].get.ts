import { isAdmin } from "#imports"
import { eq } from "drizzle-orm";
import { shopItems } from "~~/db/schema";
import * as z from "zod";

export default defineEventHandler(async event => {
    const { admin } = await isAdmin(event);

    // i love typescript
    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    if (admin) {
        const [item] = await db.select().from(shopItems).where(eq(shopItems.id, id));
        return item;
    } else {
        const [item] = await db.select(publicItemColumns).from(shopItems).where(eq(shopItems.id, id));
        return item;
    }
})