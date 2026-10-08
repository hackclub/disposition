import * as z from "zod";

const BalanceEventPostBody = z.object({
    user: z.string().min(1),
    value: z.number(),
    description: z.string().min(1)
})

export {BalanceEventPostBody}