import * as z from "zod";
import { getTableColumns } from "drizzle-orm";
import { users } from "~~/db/schema";

const { email, name, yswsEligible, verificationStatus, ...publicUserColumns } = getTableColumns(users);

const UserPostBody = z.object({
    // empty for now
})

export {UserPostBody, publicUserColumns}