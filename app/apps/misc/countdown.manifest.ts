import type { AppDef } from "~/types/window"
import Countdown from "./countdown.vue"

export default {
    appId: 'countdown',
    title: 'Countdown',
    component: Countdown,

    minWidth: 400,
    minHeight: 400,

    tool: false,
    resizeable: false,
    hiddenAfterLaunch: true,
} satisfies AppDef
