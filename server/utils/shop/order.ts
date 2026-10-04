import * as z from "zod";

const OrderPostBody = z.object({
    item: z.coerce.number().int().positive(),
    message: z.string().max(2048).optional(),
})

const OrderPatchBody = z.object({
    status: z.enum(["idle", "claimed", "cancelled", "fulfilled"]),
    adminMessage: z.string(),
})

export { OrderPostBody, OrderPatchBody }
