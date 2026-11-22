import type { AppDef } from "~/types/window"
import Documentation from "./documentation.vue"

export default {
    appId: 'documentation',
    title: 'DispoDocs',
    component: Documentation,

    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 500,

    tool: false,
    resizeable: true
} satisfies AppDef
