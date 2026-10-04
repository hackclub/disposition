import type { H3Event } from "h3";
import * as z from "zod";

// resolves the ?user= query param of an endpoint
// "me" -> your id
// another id or "all" -> admins only; "all" resolves to undefined (= no user filter)
export async function resolveUserScope(event: H3Event, sessionUserId: string) {
    const { user } = await getValidatedQuery(event, z.object({
        user: z.string().default("me"),
    }).parse);

    if (user === "me" || user === sessionUserId) return sessionUserId;

    await requireAdmin(event);
    return user === "all" ? undefined : user;
}
