import { getTableColumns } from "drizzle-orm";
import * as z from "zod";
import { shopOrders } from "~~/db/schema";

const { adminMessage, ...publicOrderColumns } = getTableColumns(shopOrders);

const OrderPostBody = z.object({
    item: z.coerce.number().int().positive(),
    message: z.string().max(2048).optional(),
    address: z.string().min(1).max(12),
})

const OrderAdminPatchBody = z.object({
    status: z.enum(["idle", "claimed", "cancelled", "fulfilled"]).optional(),
    adminMessage: z.string().optional(),
    tracking: z.string().optional(),
})

const OrderPatchBody = z.object({
    message: z.string(),
})

export { OrderPostBody, OrderAdminPatchBody, OrderPatchBody, publicOrderColumns }
