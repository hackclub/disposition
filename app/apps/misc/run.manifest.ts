import type { AppDef } from "~/types/window"
import Run from "./run.vue"

export default {
    appId: 'run',
    title: 'DispoRun',
    component: Run,

    minWidth: 520,
    minHeight: 200,

    posX: 20,
    posY: 20,

    tool: false,
    resizeable: false,
    hidden: true
} satisfies AppDef
