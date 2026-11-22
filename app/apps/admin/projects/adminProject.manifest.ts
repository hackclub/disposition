import type { AppDef } from "~/types/window"
import AdminProject from "./adminProject.vue"

export default {
    appId: 'admin_project',
    title: 'View Project (admin)',
    component: AdminProject,

    minWidth: 500,
    minHeight: 600,

    tool: true,
    resizeable: true,
    hidden: true
} satisfies AppDef
