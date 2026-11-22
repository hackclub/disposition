import type { AppDef } from "~/types/window"
import AdminViewAnnouncement from "./adminViewAnnouncement.vue"

export default {
    appId: 'admin_view_announcement',
    title: "View Announcement",
    component: AdminViewAnnouncement,

    minWidth: 400,
    minHeight: 300,

    tool: true,
    resizeable: true,
    hidden: true,
} satisfies AppDef
