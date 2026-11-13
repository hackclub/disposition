import shopIcon from "~/assets/icons/shop.png"
import welcomeIcon from "~/assets/icons/start.png"
import documentationIcon from "~/assets/icons/notes.png"
import configIcon from "~/assets/icons/config.png"
import runIcon from "~/assets/icons/run.png"
import notificationsIcon from "~/assets/icons/notifications.png"
import projectBrowserIcon from "~/assets/icons/browser.png"
import countdownIcon from "~/assets/icons/countdown.png"
import feedbackPostIcon from "~/assets/icons/feedback.png"
import managerIcon from "~/assets/icons/manager.png"
import errorIcon from "~/assets/icons/error.png"
import profileIcon from "~/assets/icons/profile.png"

export const ICONS: { [key: string]: string } = {
    manager: managerIcon,
    feedback: feedbackPostIcon,
    countdown: countdownIcon,
    project_browser: projectBrowserIcon,
    welcome: welcomeIcon,
    documentation: documentationIcon,
    admin: documentationIcon,
    config: configIcon,
    run: runIcon,
    shop: shopIcon,
    notifications: notificationsIcon,
    admin_shop: shopIcon,
    admin_projects: managerIcon,
    evil: errorIcon,
    profile: profileIcon
}