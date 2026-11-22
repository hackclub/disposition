import type { AppDef } from "~/types/window"
import AdminProjects from "./adminProjects.vue"

export default {
    appId: 'admin_projects',
    title: 'DispoAdminProjectThing',
    component: AdminProjects,

    minWidth: 600,
    minHeight: 500,

    tool: false,
    resizeable: true,
    hidden: true
} satisfies AppDef
