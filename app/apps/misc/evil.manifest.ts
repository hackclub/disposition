import type { AppDef } from "~/types/window"
import Evil from "./evil.vue"

export default {
    appId: 'evil',
    title: 'Evil Rigby',
    component: Evil,

    width: 320,
    height: 200,
    minWidth: 320,
    minHeight: 200,

    tool: true,
    resizeable: false
} satisfies AppDef
