import { App } from "@slack/bolt";
import type { KnownBlock } from "@slack/types";
import { Notification } from "./notification";

const config = useRuntimeConfig();
export const slackBot = new App({
    token: config.slack.token,
    appToken: config.slack.appToken,
    socketMode: true,
});

export async function sendSlackDM(slackId: string, text: string, blocks?: KnownBlock[]) {
    return slackBot.client.chat.postMessage({
        channel: slackId,
        text, // fallback
        blocks,
    });
}

export async function sendSlackNotification(slackId: string, notification: Notification) {
    return sendSlackDM(
        slackId,
        `${notification.title}: ${notification.description}`,
        [
            {
                type: "context",
                elements: [
                    { type: "mrkdwn", text: "Yo... Benji here, you got a notification on Disposition!" },
                ],
            },
            {
                type: "section",
                text: { type: "mrkdwn", text: `*${notification.title}*` },
            },
            {
                type: "section",
                text: { type: "mrkdwn", text: notification.description },
            },
        ],
    );
}