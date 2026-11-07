import { eq } from "drizzle-orm";
import { createHmac } from "node:crypto";
import { projects, ships, users } from "~~/db/schema";

const config = useRuntimeConfig();
async function call(unsigned: any) {
    const url = `https://webhooks.ari.hackclub.com/api/ingest/${config.ari.programId}`;
    const { headers, body } = signAriRequest(JSON.stringify(unsigned));

    return $fetch(url, {
        method: "POST",
        body: body,
        headers: {
            ...headers,
            "Content-Type": "application/json"
        }
    })
}

export async function sendShip(ship: typeof ships.$inferSelect) {
    const [project] = await db.select().from(projects).where(eq(projects.id, ship.project));
    if (!project) return;

    const [author] = await db.select().from(users).where(eq(users.hcaId, project.author));
    if (!author) return;

    return call({
        external_id: project.id,
        title: project.title,
        description: project.description,
        maker: {
            email: author.email,
            name: `${author.firstName} ${author.lastName}`,
            slack_id: author.slackId
        },

        repo_url: project.repository,
        demo_url: project.demo,
        thumbnail_url: `${config.public.baseUrl}/images/${project.banner}`,
        hackatime_projects: ship.hackatimeProjects,
        evidence: ["commits", "elapsed"],
        meta: {
            //"Project page": "https://example.com/project1/page", // TODO: implement ts
            "Internal note": ship.internalMessage,
            
            "Used AI?": ship.ai,
            "AI Declaration": ship.aiDeclaration,
        },

        is_update: ship.update,
        update_message: ship.updateDeclaration
    });
}

// thank you ari (more specifically thank you santi shoutout santi u the goat)
// (also shoutout archer you the goat aswell)
interface SignedRequest {
    headers: {
        "X-Ari-Timestamp": string;
        "X-Ari-Signature": string;
    };
    body: string | Buffer;
}

function signAriRequest(body: string | Buffer): SignedRequest {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = createHmac("sha256", config.ari.inboundSecret)
        .update(timestamp)
        .update(".")
        .update(body)
        .digest("hex");

    return {
        headers: {
            "X-Ari-Timestamp": timestamp,
            "X-Ari-Signature": signature,
        },
        body,
    };
}