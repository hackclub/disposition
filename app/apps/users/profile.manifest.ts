import type { AppDef } from "~/types/window"
import profile from "./profile.vue"

export default {
    appId: 'profile',
    title: 'Profile Viewer',
    component: profile,
    minWidth: 541,
    minHeight: 550,

    tool: false,
    resizeable: false,
    hidden: false,
    hiddenUntilLaunch: true
} satisfies AppDef
