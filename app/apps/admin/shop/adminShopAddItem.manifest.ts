import type { AppDef } from "~/types/window"
import AdminShopAddItem from "./adminShopAddItem.vue"

export default {
    appId: 'admin_shop_add_item',
    title: 'Add Shop Item',
    component: AdminShopAddItem,

    minWidth: 500,
    minHeight: 600,

    tool: true,
    resizeable: true,
    hidden: true
} satisfies AppDef
