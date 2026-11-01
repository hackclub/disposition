import { users } from "~~/db/schema";

export default defineNitroPlugin(async () => {
    const user: typeof users.$inferInsert = {
        hcaId: "system",
        email: "system@disposition.invalid",
        slackId: "SYSTEM",
        firstName: "System",
        lastName: "User",
        username: "system",
        yswsEligible: false,
        verificationStatus: "system",
        system: true,
    };

    await db.insert(users).values(user).onConflictDoNothing({ target: users.hcaId });
});
