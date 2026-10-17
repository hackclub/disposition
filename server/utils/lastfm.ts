async function call(method: string, params: Record<string, any>): Promise<any> {
    const url = new URL("https://ws.audioscrobbler.com/2.0/")
    url.searchParams.set("api_key", useRuntimeConfig().lastfm.apiKey);
    url.searchParams.set("method", method);
    url.searchParams.set("format", "json");
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    })

    const response = await $fetch<any>(url.toString());
    if (!response || response.error) throw createError({
        statusCode: 502,
        message: `last.fm: ${response?.message ?? "request failed"}`
    })

    return response;
}

export async function getAlbumInfo(album: string, artist: string) {
    return await call("album.getinfo", {
        artist,
        album,
        autocorrect: "1",
        lang: "en"
    });
}