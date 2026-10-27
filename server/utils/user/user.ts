import * as z from "zod";
import { getTableColumns } from "drizzle-orm";
import { users } from "~~/db/schema";
import { like } from "drizzle-orm";
import { db } from "~~/server/utils/db";

function getPublicUserColumns() {
    const { email, firstName, lastName, legalLastName, legalFirstName, birthday, phoneNumber, yswsEligible, verificationStatus, ...publicUserColumns } = getTableColumns(users);
    return publicUserColumns;
}

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
    console.log("[debug] generateUsername", { raw, base });

    // escape wildcards
    const escaped = base.replace(/[\\%_]/g, "\\$&");

    const rows = await db
        .select({ username: users.username })
        .from(users)
        .where(like(users.username, `${escaped}%`));
    const taken = new Set(rows.map(r => r.username));
    console.log("[debug] taken usernames matching base", { base, taken: [...taken] });

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
    onboardedAt: z.date().optional()
})