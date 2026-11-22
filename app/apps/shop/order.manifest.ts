import type { AppDef } from "~/types/window"
import Order from "./order.vue"

export default {
    appId: 'order',
    title: 'View Order',
    component: Order,

    minWidth: 670,
    minHeight: 550,

    tool: true,
    resizeable: true
} satisfies AppDef
