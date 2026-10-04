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

function groupBy<T extends { rn: number }>(rows: T[], key: (r: T) => string, keys: readonly string[]) {
    const out: Record<string, Omit<T, "rn">[]> = Object.fromEntries(keys.map(k => [k, []]));
    for (const { rn, ...item } of rows) out[key(item as T)]?.push(item);
    return out;
}

export default defineEventHandler(async (event) => {
    await requireUserSession(event);
    
    /*
    structure:
    ----------------------------------------------
    GENRE
    ----------------------------------------------
    trending - based on shop_orders.timestamp from the last week. if no data then just pull random bullshit
    staff pick - based on shop_items.staff_pick_at
    ----------------------------------------------
    LATEST ADITTIONS PER MEDIA
    ----------------------------------------------
    cd - based on shop_items.added and shop_items.media
    vinyl - ditto
    cassettes - ditto
    other - ditto
    ----------------------------------------------
    LATEST ADITTIONS PER GENRE
    ----------------------------------------------
    rock
    metal
    electronic
    pop
    hiphop
    jazz (?)
    R&B
    latin
    country
    k-pop
    classical
    */

    const staffPicks = await db.select(publicItemColumns).from(shopItems)
        .where(isNotNull(shopItems.staffPickAt))
        .orderBy(desc(shopItems.staffPickAt))
        .limit(shelf_size);

    const trending = await db.select(publicItemColumns).from(shopOrders)
        .innerJoin(shopItems, eq(shopOrders.item, shopItems.id))
        .where(and(gte(shopOrders.timestamp, sql`now() - interval 7 day`), ne(shopOrders.status, 'cancelled')))
        .groupBy(shopItems.id)
        .orderBy(desc(count()), desc(shopItems.id))
        .limit(shelf_size);

    // if there arent enough trending items just add random items
    if (trending.length < shelf_size) {
        const filler = await db.select(publicItemColumns).from(shopItems)
            .where(trending.length ? notInArray(shopItems.id, trending.map(t => t.id)) : undefined)
            .orderBy(sql`rand()`)
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

    // return {
    //     featured: { trending, staffPicks },
    //     media: groupBy(mediaRows, r => r.media, ["cd", "vinyl", "cassette", "other"]),
    //     genres: groupBy(genreRows, r => r.genre, topGenres),
    // }

    return {
        trending, staffPicks,
        ...groupBy(mediaRows, r => r.media, ["cd", "vinyl", "cassette", "other"]),
        ...groupBy(genreRows, r => r.genre, topGenres),
    }
});