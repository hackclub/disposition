import type { AppDef } from "~/types/window"
import ShopRequest from "./request.vue"

export default {
    appId: 'request',
    title: 'Submit a request',
    component: ShopRequest,

    minWidth: 300,
    minHeight: 400,

    tool: true,
    resizeable: true,
} satisfies AppDef
