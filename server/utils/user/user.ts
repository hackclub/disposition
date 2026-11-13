import * as z from "zod";
import { getTableColumns } from "drizzle-orm";
import { users } from "~~/db/schema";
import { like } from "drizzle-orm";
import { db } from "~~/server/utils/db";

function getPrivateUserColumns() {
    const { system, hackatimeToken, ...privateUserColumns } = getTableColumns(users);
    return privateUserColumns
}

function getPublicUserColumns() {
    const { onboardedAt, system, hackatimeToken, email, firstName, lastName, legalLastName, legalFirstName, birthday, phoneNumber, yswsEligible, verificationStatus, ...publicUserColumns } = getTableColumns(users);
    return publicUserColumns;
}

export const privateUserColumns = getPrivateUserColumns();
export const publicUserColumns = getPublicUserColumns();

export function slugifyUsername(raw?: string | null) {
    const slug = (raw ?? "")
        .normalize("NFKD").replace(/[\u0300-\u036f]/g, "") // strip accents
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "") // letters, numbers, underscore
        .slice(0, 24); // if your username is bigger than 24 characters, it's time to pack it up
    return slug.length >= 2 ? slug : "user";
}

export async function generateUsername(raw?: string | null) {
    const base = slugifyUsername(raw);

    // escape wildcards
    const escaped = base.replace(/[\\%_]/g, "\\$&");

    const rows = await db
        .select({ username: users.username })
        .from(users)
        .where(like(users.username, `${escaped}%`));
    const taken = new Set(rows.map(r => r.username));

    if (!taken.has(base)) return base;
    for (let i = 2; ; i++) {
        const candidate = `${base}.${i}`;
        if (!taken.has(candidate)) return candidate;
    }
}

export const UserPostBody = z.object({
    // empty for now
})

export const UserPatchBody = z.object({
    username: z.string().optional(),
    bio: z.string().optional(),
    // a date marks onboarding as done, null ("" over form data) resets it so onboarding runs again
    onboardedAt: z.union([z.literal("").transform(() => null), z.coerce.date()]).nullable().optional(),
    // a File replaces the banner, an empty string clears it (back to the default one)
    banner: z.union([z.instanceof(File), z.literal("")]).optional(),
})