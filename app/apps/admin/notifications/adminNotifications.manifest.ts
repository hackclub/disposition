import type { AppDef } from "~/types/window"
import AdminNotifications from "./adminNotifications.vue"

export default {
    appId: 'admin_notifications',
    title: 'DispoAdminNotificationThing',
    component: AdminNotifications,

    minWidth: 500,
    minHeight: 500,

    tool: false,
    hidden: true,
    resizeable: true
} satisfies AppDef
