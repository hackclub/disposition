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
    address: Address
}

/* what shop/orders/[id].get.ts returns */
export type ServerOrder = {
    id: number,
    user: User,
    item: Item,
    status: OrderStatus,
    message: string,
    adminMessage?: string,
    timestamp: Date
    tracking?: string,
    shippingAddress: Address
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

/* what you get from GET /api/users */
export type PrivateUser = {
    hcaId: string,
    email: string,
    slackId: string,
    firstName: string,
    lastName: string,
    username: string,
    created: Date,

    yswsEligible: boolean,
    verificationStatus: string,

    banner: string,
    bio: string,
    onboardedAt: Date | undefined,

    // sensitive info !!!! :scream:
    birthday?: Date,
    legalFirstName?: string,
    legalLastName?: string,
    phoneNumber?: string,
    addresses?: {
        id: string,
        firstName: string,
        lastName: string,
        line1: string,
        line2?: string,
        city: string,
        state: string,
        postalCode: string,
        country: string,
        phoneNumber: string,
        primary: boolean
    }[]
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

export type Address = {
    id: string,
    firstName: string,
    lastName: string,
    line1: string,
    line2: string,
    city: string,
    state: string,
    postalCode: string,
    country: string,
    phoneNumber: string,
    primary: boolean
}

export type Request = {
    id: number,
    user: string,
    timestamp: Date,
    album: string,
    artist: string,
    media: Media,
    status: RequestStatus,
    message?: string
}

export type ServerProject = {
    id: number,
    author: {
        hcaId: string,
        slackId: string,
        username: string
    },

    title: string,
    description: string,
    devlogs: {
        id: number,
        project: number,
        linkedShip: number,
        author: string,

        title: string,
        description: string,
        attachments: string[],
        
        timestamp: Date,
    },

    hackatimeSeconds: number,
    banner: string,
    repository: string,
    demo: string,
    
    timestamp: Date,
    platinum: boolean
}