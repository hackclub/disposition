import { rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);

    const rsvp: typeof rsvps.$inferInsert = {
        hcaId: session.user.id,
        slackId: session.user.slackId,
        email: session.user.email,
        name: session.user.name,
        yswsEligible: session.user.yswsEligible,
        verificationStatus: session.user.verificationStatus
    };

    const inserted = await db.insert(rsvps).values(rsvp)
        .onConflictDoNothing()
        .returning({ hcaId: rsvps.hcaId });

    if (!inserted.length) {
        throw createError({ statusCode: 409, message: "RSVP already exists" });
    }

    return { ok: true };
});