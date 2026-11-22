import type { AppDef } from "~/types/window"
import Cutscene from "./cutscene.vue"

export default {
    appId: 'cutscene',
    title: 'Cutscene',
    component: Cutscene,

    minWidth: 1,
    minHeight: 1,

    tool: true,
    resizeable: false,
    hidden: true,
    fullscreen: true
} satisfies AppDef
