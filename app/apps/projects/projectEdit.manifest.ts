import type { AppDef } from "~/types/window"
import ProjectEdit from "./projectEdit.vue"

export default {
    appId: 'edit_project',
    title: "Edit Project",
    component: ProjectEdit,

    height: 680,
    minWidth: 542,
    minHeight: 307,

    tool: false,
    resizeable: false,
    hidden: true,
    hiddenUntilLaunch: true,
} satisfies AppDef
