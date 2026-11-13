import { createHmac, timingSafeEqual } from "node:crypto";
import { and, desc, eq, isNull } from "drizzle-orm";
import { balanceEvents, ships } from "~~/db/schema";
import { sendNotification } from "~~/server/utils/notification";

// ari webhook :)
export default defineEventHandler(async event => {
    const config = useRuntimeConfig();
    if (!config.ari.outboundSecret) throw createError({
        statusCode: 500,
        message: "Ari isn't configured on this server (ARI_OUTBOUND_SECRET is missing)."
    });

    const raw = await readRawBody(event, false);
    const timestamp = getHeader(event, "x-ari-timestamp");
    const deliveryId = getHeader(event, "x-ari-delivery-id");
    const signature = getHeader(event, "x-ari-signature");
    if (!raw || !timestamp || !deliveryId || !signature) throw createError({
        statusCode: 401,
        message: "Missing Ari signature"
    });

    const expected = createHmac("sha256", config.ari.outboundSecret)
        .update(`${timestamp}.${deliveryId}.`)
        .update(raw)
        .digest();
    const received = Buffer.from(signature, "hex");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) throw createError({
        statusCode: 401,
        message: "Bad Ari signature"
    });

    // ignore anything older than 5 mins
    const age = Date.now() / 1000 - Number(timestamp);
    if (!Number.isFinite(age) || Math.abs(age) > 300) throw createError({
        statusCode: 401,
        message: "Ari delivery is too old"
    });

    const payload: {
        event: string,
        external_id: string,
        review?: {
            approved_seconds?: number,
            note_to_maker?: string,
            justification?: { deflation_reason?: string },
        },
    } = JSON.parse(raw.toString("utf8"));

    const result = ({
        "review.approved": { status: "accepted", title: "Accepted" },
        "review.rejected": { status: "rejected", title: "Rejected" },
        "review.changes": { status: "rejected", title: "Changes requested" },
        "review.reverted": { status: "idle", title: "Back in review" },
        "review.requeued": { status: "idle", title: "Back in review" },
    } as Record<string, { status: "accepted" | "rejected" | "idle", title: string }>)[payload.event];
    if (!result) return { ok: true };
    const { status, title } = result;

    const [ship] = await db.select().from(ships)
        .where(and(eq(ships.project, Number(payload.external_id)), isNull(ships.withdrawnAt)))
        .orderBy(desc(ships.timestamp))
        .limit(1);
    if (!ship) throw createError({
        statusCode: 404,
        message: "Ship not found"
    });
    if (ship.status === status) return { ok: true };

    const approved = payload.event === "review.approved";
    const note = payload.review?.note_to_maker || null;
    const approvedSeconds = approved ? payload.review?.approved_seconds ?? 0 : 0;

    // 25 coins an hour
    const coins = (seconds: number) => Math.round(seconds / 3600 * 5 * 5);

    await db.transaction(async tx => {
        await tx.update(ships).set({
            status,
            statusMessage: status === "idle" ? null : note,
            overrideSeconds: approved ? approvedSeconds : null,
            overrideReason: approved ? payload.review?.justification?.deflation_reason ?? null : null,
        }).where(eq(ships.id, ship.id));

        const paid = ship.status === "accepted" ? coins(ship.overrideSeconds ?? 0) : 0;
        if (paid) await tx.insert(balanceEvents).values({
            user: ship.user,
            value: -paid,
            description: `Ship #${ship.id}: approval undone`,
            author: "system",
        });

        const earned = coins(approvedSeconds);
        if (earned) await tx.insert(balanceEvents).values({
            user: ship.user,
            value: earned,
            description: `Ship #${ship.id}: approved (${(approvedSeconds / 3600).toFixed(1)}h)`,
            author: "system",
        });
    });

    try {
        await sendNotification({
            title: `🚢 Ship #${ship.id}: ${title}`,
            description: note ?? (status === "idle"
                ? "A reviewer took another look at your ship, so it's back in the review queue."
                : "A reviewer has looked at your ship."),
            user: ship.user
        });
    } catch (err) {
        console.error("[ari] failed to send review notification:", err);
    }

    return { ok: true };
})
