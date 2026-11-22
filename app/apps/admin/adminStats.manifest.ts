import type { AppDef } from "~/types/window"
import AdminStats from "./adminStats.vue"

export default {
    appId: 'admin_stats',
    title: 'DispoStats',
    component: AdminStats,

    minWidth: 380,
    minHeight: 476,

    tool: false,
    resizeable: true,
    hidden: true
} satisfies AppDef
