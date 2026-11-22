import type { AppDef } from "~/types/window"
import NewDevlog from "./newDevlog.vue"

export default {
    appId: 'new_devlog',
    title: 'New Devlog',
    component: NewDevlog,

    width: 570,
    height: 490,
    minWidth: 570,
    minHeight: 490,

    tool: false,
    resizeable: false,
    hidden: true,
    hiddenUntilLaunch: true,
} satisfies AppDef
