import type { AppDef } from "~/types/window"
import Winver from "./winver.vue"

export default {
    appId: 'winver',
    title: 'DispoVer',
    component: Winver,

    minWidth: 650,
    minHeight: 400,

    tool: true,
    resizeable: false
} satisfies AppDef
