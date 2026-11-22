import type { AppDef } from "~/types/window"
import Requests from "./requests.vue"

export default {
    appId: 'requests',
    title: 'My requests',
    component: Requests,

    minWidth: 670,
    minHeight: 550,

    tool: true,
    resizeable: false
} satisfies AppDef
