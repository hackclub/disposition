import type { AppDef } from "~/types/window"
import AdminEditAnnouncement from "./adminEditAnnouncement.vue"

export default {
    appId: 'admin_edit_announcement',
    title: "Edit Announcement",
    component: AdminEditAnnouncement,

    minWidth: 400,
    minHeight: 300,

    tool: true,
    resizeable: true,
    hidden: true,
} satisfies AppDef
