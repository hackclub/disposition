import type { AppDef } from "~/types/window"
import Auth from "./auth.vue"

export default {
    appId: 'auth',
    title: 'Authorize',
    component: Auth,

    width: 289,
    height: 285,
    minWidth: 289,
    minHeight: 285,

    tool: true,
    resizeable: false
} satisfies AppDef
