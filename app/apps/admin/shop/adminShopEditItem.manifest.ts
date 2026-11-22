import type { AppDef } from "~/types/window"
import AdminShopEditItem from "./adminShopEditItem.vue"

export default {
    appId: 'admin_shop_edit_item',
    title: 'Edit Shop Item',
    component: AdminShopEditItem,

    minWidth: 500,
    minHeight: 600,

    tool: true,
    resizeable: true,
    hidden: true,
} satisfies AppDef
