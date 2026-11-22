import type { AppDef } from "~/types/window"
import NewProject from "./newProject.vue"
import onboardingWallpaper from "~/assets/misc/onboardingBackground.png"

export default {
    appId: 'new_project',
    title: "Project Creation Wizard",
    component: NewProject,

    minWidth: 600,
    minHeight: 470,

    tool: true, // can't minimize xdxd
    resizeable: false,
    hidden: true,
    wallpaper: onboardingWallpaper,
} satisfies AppDef
