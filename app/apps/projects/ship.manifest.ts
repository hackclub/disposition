import type { AppDef } from "~/types/window"
import ShipWizard from "./ship.vue"
import onboardingWallpaper from "~/assets/misc/onboardingBackground.png"

export default {
    appId: 'ship',
    title: "Ship Wizard",
    component: ShipWizard,

    width: 640,
    height: 560,
    minWidth: 640,
    minHeight: 560,

    tool: true,
    resizeable: false,
    hidden: true,
    wallpaper: onboardingWallpaper,
} satisfies AppDef
