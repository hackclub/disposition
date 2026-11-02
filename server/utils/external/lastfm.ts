async function call(method: string, params: Record<string, any>): Promise<any> {
    const url = new URL("https://ws.audioscrobbler.com/2.0/")
    url.searchParams.set("api_key", useRuntimeConfig().lastfm.apiKey);
    url.searchParams.set("method", method);
    url.searchParams.set("format", "json");
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    })

    // last.fm returns errors (incl. "not found") with a non-2xx status, which $fetch would throw on
    const res = await $fetch.raw<any>(url.toString(), { ignoreResponseError: true });
    const body = res._data;

    // error 6 = not found (e.g. album.getinfo for an album last.fm doesn't know about)
    if (body?.error === 6) return null;
    if (!res.ok || !body || body.error) throw createError({
        statusCode: 502,
        message: `last.fm: ${body?.message ?? `request failed (${res.status})`}`
    })

    return body;
}

export const getAlbumInfo = defineCachedFunction(async (album: string, artist: string) => {
    return await call("album.getinfo", {
        artist,
        album,
        autocorrect: "1",
        lang: "en"
    });
},
{
    name: "lastfm-album",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    getKey: (album: string, artist: string) => safeCacheKey(artist, album),
})