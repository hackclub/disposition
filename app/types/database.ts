export type Media = "cd" | "cassette" | "vinyl" | "other";
export type OrderStatus = "idle" | "claimed" | "fulfilled" | "cancelled";
export type RequestStatus = "idle" | "claimed" | "accepted" | "rejected";

export type Order = {
    id: number,
    user: number,
    item: number,
    status: OrderStatus,
    message: string,
    adminMessage: string,
    timestamp: Date
}

export type Item = {
    id: number,
    album: string,
    artist: string,
    genre: string,
    image: string,
    description: string,
    media: Media,
    urls: string[],
    added: Date,
    price: number,
    staffPickAt: Date
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