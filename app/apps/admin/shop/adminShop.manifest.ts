import type { AppDef } from "~/types/window"
import AdminShop from "./adminShop.vue"

export default {
    appId: 'admin_shop',
    title: 'DispoAdminShopThing',
    component: AdminShop,

    minWidth: 500,
    minHeight: 500,

    tool: false,
    resizeable: true,
    hidden: true
} satisfies AppDef
