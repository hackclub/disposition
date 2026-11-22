import type { AppDef } from "~/types/window"
import Item from "./item.vue"

export default {
    appId: 'item',
    title: 'View Item',
    component: Item,

    minWidth: 671,
    minHeight: 550,

    tool: true,
    resizeable: true
} satisfies AppDef
