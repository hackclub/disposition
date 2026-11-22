import type { AppDef } from "~/types/window"
import Messagebox from "./messageBox.vue"

export default {
    appId: 'message_box',
    title: 'messageBox',
    component: Messagebox,

    minWidth: 1,
    minHeight: 1,

    tool: true,
    resizeable: true,
    hidden: true
} satisfies AppDef
