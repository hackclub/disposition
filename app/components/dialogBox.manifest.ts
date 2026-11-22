import type { AppDef } from "~/types/window"
import Dialogbox from "./dialogBox.vue"

export default {
    appId: 'dialog_box',
    title: 'dialogBox',
    component: Dialogbox,

    minWidth: 1,
    minHeight: 1,

    tool: true,
    resizeable: true,
    hidden: true
} satisfies AppDef
