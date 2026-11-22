import type { AppDef } from "~/types/window"
import ErrorApp from "./error.vue"

export default {
    appId: 'error',
    title: 'Error',
    component: ErrorApp,

    minWidth: 1,
    minHeight: 1,

    tool: true,
    resizeable: false,
    hidden: true,
    fullscreen: true
} satisfies AppDef
