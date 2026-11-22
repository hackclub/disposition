import type { AppDef } from "~/types/window"
import Shop from "./shop.vue"

export default {
    appId: 'shop',
    title: 'DispoShop',
    component: Shop,
    height: 650,
    minWidth: 600,
    minHeight: 310,

    tool: false,
    resizeable: true
} satisfies AppDef
