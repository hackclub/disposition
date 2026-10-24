export type CachetResponse = {
    id: string,
    userId: string,
    displayName: string,
    realName: string,
    pronouns: string,
    imageUrl: string,
}

export async function getCachetInfo(id: string): Promise<CachetResponse> {
    const info = await $fetch<CachetResponse>(`https://cachet.hackclub.com/users/${id}`);

    return info;
}
