export type NotificationType = "notification" | "announcement"

export type Notification = {
    serverId: number,
    type: NotificationType,
    title: string,
    description: string,
    timestamp: Date,
    read: boolean,
    author?: {
        id: string
        username: string,
    },
    user?: {
        id: string,
        username: string
    }
}

export type NotificationInstance = {
    id: string,
    serverId: number,
    type: NotificationType,
    title: string,
    description: string,
    timestamp: Date,
    read: boolean,
    author?: {
        id: string
        username: string,
    },
}