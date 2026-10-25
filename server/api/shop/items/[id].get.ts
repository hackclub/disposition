import { isAdmin } from "#imports"
import { eq } from "drizzle-orm";
import { shopItems } from "~~/db/schema";
import { getAlbumInfo } from "~~/server/utils/lastfm";
import { getReleaseInfo } from "~~/server/utils/musicbrainz";
import * as z from "zod";

export default defineEventHandler(async event => {
    const session = await getUserSession(event);
    const slackId = session.user?.slackId;
    const admin = !!slackId && useRuntimeConfig().public.adminIds.includes(slackId);

    // TODO: cache the info we get from last.fm and musicbrainz

    // i love typescript
    const id = await getValidatedRouterParams(event, z.object({
        id: z.coerce.number().int().positive(),
    }).parse).then(p => p.id);

    const [item] = admin ? await db.select().from(shopItems).where(eq(shopItems.id, id)) : await db.select(publicItemColumns).from(shopItems).where(eq(shopItems.id, id))
    if (!item) throw createError({
        statusCode: 400,
        message: "Item not found!"
    })

    if (item.media == "other") return item;

    const asArray = <T>(v: T | T[] | undefined): T[] =>
        v == null ? [] : Array.isArray(v) ? v : [v];

    try {
        const album = (await getAlbumInfo(item.album, item.artist!))?.album ?? {};
        const tracks = asArray<any>(album.tracks?.track);
        const lfmSeconds = tracks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0);
        const mbInfo = await getReleaseInfo(item.album, item.artist!, album.mbid).catch(() => null);

        return {
            ...item,
            tags: asArray<any>(album.tags?.tag).map(t => t.name as string),
            releaseDate: mbInfo?.releaseDate ?? null,
            tracks: mbInfo?.trackCount ?? (tracks.length || null),
            length: mbInfo?.lengthSeconds ?? (lfmSeconds || null),
        };
    } catch {
        return { ...item, tags: [], releaseDate: null, tracks: null, length: null };
    }
})