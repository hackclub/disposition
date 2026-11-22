import type { AppDef } from "~/types/window"
import AdminShip from "./adminShip.vue"

export default {
    appId: 'admin_ship',
    title: 'View Ship (admin)',
    component: AdminShip,

    minWidth: 500,
    minHeight: 600,

    tool: true,
    resizeable: true,
    hidden: true
} satisfies AppDef
