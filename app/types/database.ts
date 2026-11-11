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

/* what GET /api/projects/:id returns */
export type ServerProject = {
    id: number,
    author: {
        hcaId: string,
        slackId: string,
        username: string
    },

    title: string,
    description: string,
    devlogs: Devlog[],
    ships: Ship[],

    hackatimeSeconds: number,
    banner: string | null,
    icon: string | null,
    repository: string | null,
    demo: string | null,

    timestamp: Date,
    platinum: boolean
}

export type Devlog = {
    id: number,
    project: number,
    linkedShip: number | null,
    author: string,

    title: string,
    description: string,
    attachments: string[],

    timestamp: Date,
}

/* fields marked "owner" only show up for the ship's owner (or admins) */
export type Ship = {
    id: number,
    user: string,
    project: number,
    description: string,
    attachments: string[],
    hackatimeSeconds: number,
    status: ShipStatus,
    timestamp: Date,

    // owner
    hackatimeProjects?: string[],
    statusMessage?: string | null,
    reviewerNote?: string | null,
    ai?: boolean,
    aiDeclaration?: string | null,
    update?: boolean,
    updateDeclaration?: string | null,

    // admin
    overrideSeconds?: number | null,
    overrideReason?: string | null,
    internalMessage?: string | null,
    withdrawnAt?: Date | null,
}

export type VerificationStatus = "needs_submission" | "pending" | "verified" | "ineligible";
export type ShipStatus = "idle" | "claimed" | "accepted" | "rejected";

/* what GET /api/user/:id returns. fields marked "owner" only show up on your own profile (or for admins) */
export type ServerUser = {
    hcaId: string,
    slackId: string,
    username: string,
    created: Date,

    banner: string | null,
    bio: string | null,

    // owner
    onboardedAt?: Date | null,
    email?: string,
    firstName?: string,
    lastName?: string,
    yswsEligible?: boolean,
    verificationStatus?: VerificationStatus,
    birthday?: string | null,
    legalFirstName?: string | null,
    legalLastName?: string | null,
    phoneNumber?: string | null,

    // admin
    hackatimeToken?: string | null,
    system?: boolean,
}

export type FeedProject = {
    id: number,
    title: string,
    icon: string | null,
}

export type FeedShip = Omit<Ship, "project"> & { type: "ship", project: FeedProject }
export type FeedDevlog = Omit<Devlog, "project"> & { type: "devlog", project: FeedProject }

/* what GET /api/user/:id/feed returns, newest first. narrow on `type` */
export type ServerFeed = (FeedShip | FeedDevlog)[]

/* what GET /api/user/:id/projects returns, newest first. hackatimeSeconds is -1 if it couldn't be fetched */
export type ServerUserProject = {
    id: number,
    author: string,
    title: string,
    description: string,

    icon: string | null,
    banner: string | null,
    repository: string | null,
    demo: string | null,

    timestamp: Date,
    platinum: boolean,
    hackatimeSeconds: number,

    // owner
    hackatimeProjects?: string[],

    // admin
    deletedAt?: Date | null,
}

/* admin lists: GET /api/projects?user=all, GET /api/ships, GET /api/devlogs */
export type AdminProjectRow = {
    id: number,
    author: { hcaId: string, slackId: string, username: string },
    title: string,
    description: string,
    hackatimeProjects: string[],
    icon: string | null,
    banner: string | null,
    repository: string | null,
    demo: string | null,
    deletedAt: Date | null,
    timestamp: Date,
    platinum: boolean,
}

export type AdminShipRow = {
    id: number,
    status: ShipStatus,
    hackatimeSeconds: number,
    update: boolean,
    withdrawnAt: Date | null,
    timestamp: Date,
    project: { id: number, title: string },
    user: { hcaId: string, username: string },
}

export type AdminDevlogRow = {
    id: number,
    title: string,
    linkedShip: number | null,
    timestamp: Date,
    project: { id: number, title: string },
    user: { hcaId: string, username: string },
}

/* what GET /api/projects/:id/ships/:shipId returns */
export type ServerShip = Omit<Ship, "project"> & {
    project: { id: number, title: string, author: string, deletedAt: Date | null },
    user: { hcaId: string, username: string, slackId: string },
    devlogs: { id: number, title: string, timestamp: Date }[],
}

/* what GET /api/projects/:id/devlogs/:devlogId returns */
export type ServerDevlog = Omit<Devlog, "project"> & {
    project: FeedProject,
    user: { hcaId: string, slackId: string, username: string },
}

/* what GET /api/projects/:id/devlogs/:devlogId/comments returns, newest first */
export type DevlogComment = {
    id: number,
    content: string,
    timestamp: Date,
    user: { hcaId: string, slackId: string, username: string },
}
