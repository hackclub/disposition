import type { AppDef } from "~/types/window"
import AdminShopRequest from "./adminShopRequest.vue"

export default {
    appId: 'admin_shop_view_request',
    title: 'View Request (admin)',
    component: AdminShopRequest,

    minWidth: 500,
    minHeight: 200,

    tool: true,
    resizeable: true,
    hidden: true
} satisfies AppDef
