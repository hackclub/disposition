import type { AppDef } from "~/types/window"
import Project from "./project.vue"

export default {
    appId: 'project',
    title: "Project Viewer",
    component: Project,

    minHeight: 700,
    minWidth: 450,

    tool: false,
    resizeable: false,
    hidden: true,
    hiddenUntilLaunch: true,
} satisfies AppDef
