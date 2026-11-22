import type { AppDef } from "~/types/window"
import ProfileEdit from "./profileEdit.vue"

export default {
    appId: 'edit_profile',
    title: "Edit Profile",
    component: ProfileEdit,

    height: 410,
    minWidth: 542,
    minHeight: 307,

    tool: false,
    resizeable: false,
    hidden: true,
    hiddenUntilLaunch: true,
} satisfies AppDef
