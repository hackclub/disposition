import type { AppDef } from "~/types/window"
import Notifications from "./notifications.vue"

export default {
    appId: 'notifications',
    title: 'Notifications',
    component: Notifications,
    minWidth: 450,
    minHeight: 500,

    tool: false,
    resizeable: true,
    hiddenUntilSignedIn: true,
} satisfies AppDef
