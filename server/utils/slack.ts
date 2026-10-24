import { WebClient } from '@slack/web-api'

const slack = new WebClient(useRuntimeConfig().slackApiKey)

// todo change ts
export async function notifySlackUser(slackUserId: string, text: string) {
    await slack.chat.postMessage({ channel: slackUserId, text })
}