export type Media = "cd" | "cassette" | "vinyl" | "other";
export type OrderStatus = "idle" | "claimed" | "fulfilled" | "cancelled";
export type RequestStatus = "idle" | "claimed" | "accepted" | "rejected";

export type Order = {
    id: number,
    user: number,
    item: number,
    status: OrderStatus,
    message: string,
    adminMessage?: string,
    timestamp: Date
    tracking?: string,
}

export type Item = {
    id: number,
    album: string,
    artist: string,
    genre: string,
    image: string,
    description: string,
    media: Media,
    urls?: string[],
    added: Date,
    price: number,
    staffPickAt: Date
}

/* basically this is just the item that you get from shop/item/[id].get.ts. it includes extra data from last.fm & musicbrainz */
export type ServerItem = {
    id: number,
    album: string,
    artist: string,
    genre: string,
    image: string,
    description: string,
    media: Media,
    urls?: string[],
    added: Date,
    price: number,
    staffPickAt: Date,

    tracks: number,
    length: number,
    releaseDate: string,
    tags: string[],
}

export type User = {
    hcaId: string,
    slackId: string,
    email: string,
    name: string,
    created: Date,
    yswsEligible: boolean,
    verificationStatus: string
}

export type Request = {
    id: number,
    user: string,
    timestamp: Date,
    album: string,
    artist: string,
    media: Media,
    status: RequestStatus,
    message: string
}