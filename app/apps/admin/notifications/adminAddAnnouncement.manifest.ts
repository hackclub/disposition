import type { AppDef } from "~/types/window"
import AdminAddAnnouncement from "./adminAddAnnouncement.vue"

export default {
    appId: 'admin_add_announcement',
    title: "Add Announcement",
    component: AdminAddAnnouncement,

    minWidth: 400,
    minHeight: 300,

    tool: true,
    resizeable: false,
    hidden: true,
} satisfies AppDef
