import type { AppDef } from "~/types/window"
import AdminAddNotification from "./adminAddNotification.vue"

export default {
    appId: 'admin_add_notification',
    title: "Add Notifications",
    component: AdminAddNotification,

    minWidth: 400,
    minHeight: 300,

    tool: true,
    resizeable: false,
    hidden: true,
} satisfies AppDef
