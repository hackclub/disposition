export type CachetInfo = {
    id: string,
    userId: string,
    displayName: string,
    realName: string,
    pronouns: string,
    imageUrl: string,
}

export async function getUserInfo(slackId: string): Promise<CachetInfo> {
    return $fetch<CachetInfo>(`https://cachet.hackclub.com/users/${slackId}`);
}