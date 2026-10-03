import { rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);

    const rsvp: typeof rsvps.$inferInsert = {
        hcaId: session.user.id,
        slackId: session.user.slackId,
        email: session.user.email,
        name: session.user.name,
        yswsEligible: Number(session.user.yswsEligible),
        verificationStatus: session.user.verificationStatus
    };

    try {
        await db.insert(rsvps).values(rsvp);
    } catch (err: any) {
        // new drizzle shi
        const code = err?.code ?? err?.cause?.code;
        if (code === "ER_DUP_ENTRY") {
            throw createError({ statusCode: 409, message: "RSVP already exists" });
        }
        throw err;
    }

    return { ok: true };
});