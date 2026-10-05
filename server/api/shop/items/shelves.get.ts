import { sql, lte, isNotNull, desc, gte, eq, count, notInArray, AnyColumn, SQL, inArray, ne, and } from "drizzle-orm";
import { shopItems, shopOrders } from "~~/db/schema";
import { db } from "~~/server/utils/db";

const shelf_size = 15;
const genre_shelves = 8;

function latestPer(partitionBy: AnyColumn, filter?: SQL) {
    const ranked = db.select({
        ...publicItemColumns,
        rn: sql<number>`row_number() over (
                partition by ${partitionBy}
                order by ${shopItems.added} desc, ${shopItems.id} desc)`.as("rn"),
    })
        .from(shopItems)
        .where(filter)
        .as("ranked");

    return db.select().from(ranked).where(lte(ranked.rn, shelf_size));
}

function groupBy<T extends { rn: number }>(
    rows: T[],
    key: (r: T) => string,
    keys: readonly string[],
    prettyNames?: readonly string[],
) {
    const labelByKey = new Map<string, string>();
    const out: Record<string, Omit<T, "rn">[]> = {};

    keys.forEach((keyValue, index) => {
        const label = prettyNames?.[index] ?? keyValue;
        labelByKey.set(keyValue, label);
        if (!out[label]) out[label] = [];
    });

    for (const row of rows) {
        const label = labelByKey.get(key(row));
        if (!label) continue;

        const bucket = out[label] ?? [];
        out[label] = bucket;

        const { rn, ...item } = row;
        bucket.push(item);
    }

    return out;
}

export default defineEventHandler(async (event) => {
    // hello this might seem like a nightmare of a function but really im putting together the shop home screen
    // the client displays the home screen purely based on what the server gives it
    // the categories are the following:
    /*
        trending (based on order count, if there arent enough orders then its just random xdxd)
        staff picks (in the db staff pick is a timestamp so it goes by latest staff pick)
        // then a category for every media type //
        CDs
        Vinyls
        Cassettes
        Other
        // then every genre sorted by latest addition //
        // so lets say hip hop has the latest addition //
        Hip Hop (the items within the category are also sorted by latest addition)
        Rock
        Jazz
        Metal
        // etc.. //
    */

    const staffPicks = await db.select(publicItemColumns).from(shopItems)
        .where(isNotNull(shopItems.staffPickAt))
        .orderBy(desc(shopItems.staffPickAt))
        .limit(shelf_size);

    const trending = await db.select(publicItemColumns).from(shopOrders)
        .innerJoin(shopItems, eq(shopOrders.item, shopItems.id))
        .where(and(gte(shopOrders.timestamp, sql`now() - interval '7 days'`), ne(shopOrders.status, 'cancelled')))
        .groupBy(shopItems.id)
        .orderBy(desc(count()), desc(shopItems.id))
        .limit(shelf_size);

    // if there arent enough trending items just add random items
    if (trending.length < shelf_size) {
        const filler = await db.select(publicItemColumns).from(shopItems)
            .where(trending.length ? notInArray(shopItems.id, trending.map(t => t.id)) : undefined)
            .orderBy(sql`random()`)
            .limit(shelf_size - trending.length)
        trending.push(...filler);
    }

    const mediaRows = await latestPer(shopItems.media);

    const topGenres = await db.select({ genre: shopItems.genre }).from(shopItems)
        .groupBy(shopItems.genre)
        .orderBy(desc(count()), shopItems.genre)
        .limit(genre_shelves)
        .then(rows => rows.map(r => r.genre))

    const genreRows = topGenres.length
        ? await latestPer(shopItems.genre, inArray(shopItems.genre, topGenres))
        : [];

    // i wanna have like categories of categories but im waiting for luca to do the shop rewrite
    // return {
    //     featured: { trending, staffPicks },
    //     media: groupBy(mediaRows, r => r.media, ["cd", "vinyl", "cassette", "other"]),
    //     genres: groupBy(genreRows, r => r.genre, topGenres),
    // }

    return {
        "Trending": trending, 
        "Staff Picks": staffPicks,
        ...groupBy(
            mediaRows,
            r => r.media,
            ["cd", "vinyl", "cassette", "other"],
            ["CDs", "Vinyl", "Cassettes", "Other"],
        ),
        ...groupBy(genreRows, r => r.genre, topGenres),
    }
});
