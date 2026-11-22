import type { AppDef } from "~/types/window"
import Onboarding from "./onboarding.vue"
import onboardingWallpaper from "~/assets/misc/onboardingBackground.png"

export default {
    appId: 'onboarding',
    title: 'Onboarding',
    component: Onboarding,

    minWidth: 600,
    minHeight: 470,

    tool: true, // can't minimize xdxd
    resizeable: false,
    hidden: true,
    wallpaper: onboardingWallpaper,
} satisfies AppDef
