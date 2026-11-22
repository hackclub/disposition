import type { AppDef } from "~/types/window"
import DispoInator3000 from "./dispoInator3000.vue"

export default {
    appId: 'dispo_inator_3000',
    title: 'Surprise me',
    component: DispoInator3000,

    width: 570,
    height: 490,
    minWidth: 570,
    minHeight: 490,

    tool: false,
    resizeable: false,
    hidden: true
} satisfies AppDef
