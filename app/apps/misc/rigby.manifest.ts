import type { AppDef } from "~/types/window"
import Rigby from "./rigby.vue"

export default {
    appId: 'rigby',
    title: 'Rigby',
    component: Rigby,

    minWidth: 367,
    minHeight: 476,

    tool: true,
    resizeable: false
} satisfies AppDef
