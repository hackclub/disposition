import { rsvps } from "~~/db/schema";
import { db } from "~~/server/utils/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    if (!session.user) {
        setResponseStatus(event, 401);
        return;
    }

    const existing = await db
        .select()
        .from(rsvps)
        .where(eq(rsvps.hcaId, session.user.id))
        .limit(1);

    if (existing.length > 0) {
        setResponseStatus(event, 409);
        return { message: "RSVP already exists" };
    }
    
    const rsvp: typeof rsvps.$inferInsert = {
        hcaId: session.user.id,
        slackId: session.user.slackId,
        email: session.user.email,
        name: session.user.name,
        yswsEligible: session.user.yswsEligible,
        verificationStatus: session.user.verificationStatus
    };

    await db.insert(rsvps).values(rsvp);
    setResponseStatus(event, 200);
    return "";
});