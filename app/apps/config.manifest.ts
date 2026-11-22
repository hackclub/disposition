import type { AppDef } from "~/types/window"
import Config from "./config.vue"

export default {
    appId: 'config',
    title: 'DispoConfig',
    component: Config,

    minWidth: 367,
    minHeight: 476,

    tool: false,
    resizeable: true,
    hidden: false
} satisfies AppDef
