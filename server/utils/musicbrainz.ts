const HEADERS = { "User-Agent": "YourShopName/1.0 ( you@example.com )" };

async function call(path: string, query: Record<string, string>): Promise<any> {
    return await $fetch<any>(`https://musicbrainz.org/ws/2/${path}`, {
        query: { ...query, fmt: "json" },
        headers: HEADERS,
    });
}

export async function getReleaseInfo(album: string, artist: string, mbid?: string | null) {
    // search fallback if no mbid
    if (!mbid) {
        const esc = (s: string) => s.replace(/(["\\])/g, "\\$1");
        const search = await call("release", {
            query: `release:"${esc(album)}" AND artist:"${esc(artist)}"`,
            limit: "1",
        });
        mbid = search.releases?.[0]?.id;
        if (!mbid) return null;
    }

    const release = await call(`release/${mbid}`, { inc: "release-groups recordings" });

    const tracks: any[] = (release.media ?? []).flatMap((m: any) => m.tracks ?? []);
    const totalMs = tracks.reduce((sum, t) => sum + (t.length || 0), 0);

    return {
        // the release group's first-release-date is the original release
        // can be partial: "1997", "1997-06" or "1997-06-16"
        releaseDate: (release["release-group"]?.["first-release-date"] || release.date || null) as string | null,
        trackCount: tracks.length || null,
        lengthSeconds: totalMs ? Math.round(totalMs / 1000) : null,
    };
}