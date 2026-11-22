import type { AppDef } from "~/types/window"
import Manager from "./manager.vue"

export default {
    appId: 'manager',
    title: 'DispoManager',
    component: Manager,
    height: 615,
    minWidth: 536,
    minHeight: 515,

    tool: false,
    resizeable: false,
    hiddenUntilLaunch: true
} satisfies AppDef
