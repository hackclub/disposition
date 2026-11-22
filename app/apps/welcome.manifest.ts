import type { AppDef } from "~/types/window"
import Welcome from "./welcome.vue"

export default {
    appId: 'welcome',
    title: 'Welcome!',
    component: Welcome,

    minWidth: 600,
    minHeight: 310,

    tool: false,
    resizeable: false
} satisfies AppDef
