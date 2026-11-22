import type { AppDef } from "~/types/window"
import Devlog from "./devlog.vue"

export default {
    appId: 'devlog',
    title: "Devlog Viewer",
    component: Devlog,

    width: 500,
    minHeight: 700,
    minWidth: 450,

    tool: false,
    resizeable: false,
    hidden: true,
    hiddenUntilLaunch: true,
} satisfies AppDef
