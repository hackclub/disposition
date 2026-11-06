import shopIcon from "~/assets/icons/shop.png"
import welcomeIcon from "~/assets/icons/start.png"
import documentationIcon from "~/assets/icons/info.png"
import configIcon from "~/assets/icons/config.png"
import runIcon from "~/assets/icons/run.png"
import notificationsIcon from "~/assets/icons/notifications.png"
import projectBrowserIcon from "~/assets/icons/browser.png"
import adminAnnouncementIcon from "~/assets/icons/megaphone.png"
import feedbackPostIcon from "~/assets/icons/feedback.png"
import managerIcon from "~/assets/icons/manager.png"
import errorIcon from "~/assets/icons/error.png"
export const ICONS: { [key: string]: string } = {
    project_manager: managerIcon,
    feedback: feedbackPostIcon,
    admin_announce_panel: adminAnnouncementIcon,
    project_browser: projectBrowserIcon,
    welcome: welcomeIcon,
    documentation: documentationIcon,
    admin: documentationIcon,
    config: configIcon,
    run: runIcon,
    shop: shopIcon,
    notifications: notificationsIcon,
    admin_shop: shopIcon,
    evil: errorIcon
}