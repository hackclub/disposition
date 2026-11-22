import type { AppDef } from "~/types/window"
import Orders from "./orders.vue"

export default {
    appId: 'orders',
    title: 'My orders',
    component: Orders,

    minWidth: 670,
    minHeight: 550,

    tool: true,
    resizeable: false
} satisfies AppDef
