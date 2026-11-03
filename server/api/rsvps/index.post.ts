import { rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
    const user = await getDBUser(event);

    const rsvp: typeof rsvps.$inferInsert = {
        hcaId: user.hcaId,
        slackId: user.slackId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        yswsEligible: user.yswsEligible,
        verificationStatus: user.verificationStatus
    };

    const inserted = await db.insert(rsvps).values(rsvp)
        .onConflictDoNothing()
        .returning({ id: rsvps.hcaId });

    if (!inserted.length) {
        throw createError({ statusCode: 409, message: "RSVP already exists" });
    }

    return inserted;
});