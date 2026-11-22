import type { AppDef } from "~/types/window"
import AdminShopOrder from "./adminShopOrder.vue"

export default {
    appId: 'admin_shop_view_order',
    title: 'View Order (admin)',
    component: AdminShopOrder,

    minWidth: 500,
    minHeight: 600,

    tool: true,
    resizeable: true,
    hidden: true
} satisfies AppDef
