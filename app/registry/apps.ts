import type { AppDef } from "../types/window"

// apps/
import Welcome from "../apps/welcome.vue"
import Documentation from "../apps/documentation.vue"
import Config from "../apps/config.vue"
import Notifications from "../apps/notifications.vue"

// apps/admin/
import AdminStats from "../apps/admin/adminStats.vue"

// apps/admin/notifications/
import AdminNotifications from "../apps/admin/notifications/adminNotifications.vue"
import AdminAddAnnouncement from "../apps/admin/notifications/adminAddAnnouncement.vue"
import AdminAddNotification from "../apps/admin/notifications/adminAddNotification.vue"
import AdminEditAnnouncement from "../apps/admin/notifications/adminEditAnnouncement.vue"
import AdminViewAnnouncement from "../apps/admin/notifications/adminViewAnnouncement.vue"

// apps/admin/shop
import AdminShop from "../apps/admin/shop/adminShop.vue"
import AdminShopAddItem from "../apps/admin/shop/adminShopAddItem.vue"
import AdminShopEditItem from "../apps/admin/shop/adminShopEditItem.vue"
import AdminShopOrder from "../apps/admin/shop/adminShopOrder.vue"
import AdminShopRequest from "../apps/admin/shop/adminShopRequest.vue"

// apps/misc
import Auth from "../apps/misc/auth.vue"
import Countdown from "../apps/misc/countdown.vue"
import DispoInator3000 from "../apps/misc/dispoInator3000.vue"
import ErrorApp from "../apps/misc/error.vue"
import Evil from "../apps/misc/evil.vue"
import Rigby from "../apps/misc/rigby.vue"
import Run from "../apps/misc/run.vue"
import Winver from "../apps/misc/winver.vue"

// apps/onboarding
import Onboarding from "../apps/onboarding/onboarding.vue"
import onboardingWallpaper from "../assets/misc/onboardingBackground.png"

// apps/projects
import projectManager from "../apps/projects/projectManager.vue"
import ProjectBrowser from "../apps/projects/projectBrowser.vue"
import ProjectProfile from "../apps/projects/projectProfile.vue"
import ProjectEdit from "../apps/projects/projectEdit.vue"
import DevlogView from "../apps/projects/devlogView.vue"
import NewDevlog from "../apps/projects/newDevlog.vue"

// apps/shop
import Shop from "../apps/shop/shop.vue"
import Category from "../apps/shop/category.vue"
import Item from "../apps/shop/item.vue"
import Order from "../apps/shop/order.vue"
import Orders from "../apps/shop/orders.vue"
import ShopRequest from "../apps/shop/request.vue"
import Requests from "../apps/shop/requests.vue"

// apps/users
import profileViewer from "../apps/users/profileViewer.vue"
import ProfileEdit from "../apps/users/profileEdit.vue"

// components (system dialogs)
import Messagebox from "../components/messageBox.vue"
import Dialogbox from "../components/dialogBox.vue"

// don't ask me why, but all app id's should be snake case.
export const APPS: { [key: string]: AppDef } = {
    ///////////////////////////////////////////////
    // apps                                      //
    ///////////////////////////////////////////////

    welcome: {
        appId: 'welcome',
        title: 'Welcome!',
        component: Welcome,

        minWidth: 600,
        minHeight: 310,

        tool: false,
        resizeable: false
    },

    documentation: {
        appId: 'documentation',
        title: 'DispoDocs',
        component: Documentation,

        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 500,

        tool: false,
        resizeable: true
    },

    config: {
        appId: 'config',
        title: 'DispoConfig',
        component: Config,

        minWidth: 367,
        minHeight: 476,

        tool: false,
        resizeable: true,
        hidden: false
    },

    notifications: {
        appId: 'notifications',
        title: 'Notifications',
        component: Notifications,
        minWidth: 450,
        minHeight: 500,

        tool: false,
        resizeable: true,
        hiddenUntilSignedIn: true,
    },

    ///////////////////////////////////////////////
    // apps/admin                                //
    ///////////////////////////////////////////////

    admin_stats: {
        appId: 'admin_stats',
        title: 'DispoStats',
        component: AdminStats,

        minWidth: 380,
        minHeight: 476,

        tool: false,
        resizeable: true,
        hidden: true
    },

    ///////////////////////////////////////////////
    // apps/admin/notifications                  //
    ///////////////////////////////////////////////

    admin_notifications: {
        appId: 'admin_notifications',
        title: 'DispoAdminNotificationThing',
        component: AdminNotifications,

        minWidth: 500,
        minHeight: 500,

        tool: false,
        hidden: true,
        resizeable: true
    },

    admin_add_announcement: {
        appId: 'admin_add_announcement',
        title: "Add Announcement",
        component: AdminAddAnnouncement,

        minWidth: 400,
        minHeight: 300,

        tool: true,
        resizeable: false,
        hidden: true,
    },

    admin_add_notification: {
        appId: 'admin_add_notification',
        title: "Add Notifications",
        component: AdminAddNotification,

        minWidth: 400,
        minHeight: 300,

        tool: true,
        resizeable: false,
        hidden: true,
    },

    admin_edit_announcement: {
        appId: 'admin_edit_announcement',
        title: "Edit Announcement",
        component: AdminEditAnnouncement,

        minWidth: 400,
        minHeight: 300,

        tool: true,
        resizeable: true,
        hidden: true,
    },

    admin_view_announcement: {
        appId: 'admin_view_announcement',
        title: "View Announcement",
        component: AdminViewAnnouncement,

        minWidth: 400,
        minHeight: 300,

        tool: true,
        resizeable: true,
        hidden: true,
    },

    ///////////////////////////////////////////////
    // apps/admin/shop                           //
    ///////////////////////////////////////////////

    admin_shop: {
        appId: 'admin_shop',
        title: 'DispoAdminShopThing',
        component: AdminShop,

        minWidth: 500,
        minHeight: 500,

        tool: false,
        resizeable: true,
        hidden: true
    },

    admin_shop_add_item: {
        appId: 'admin_shop_add_item',
        title: 'Add Shop Item',
        component: AdminShopAddItem,

        minWidth: 500,
        minHeight: 600,

        tool: true,
        resizeable: true,
        hidden: true
    },

    admin_shop_edit_item: {
        appId: 'admin_shop_edit_item',
        title: 'Edit Shop Item',
        component: AdminShopEditItem,

        minWidth: 500,
        minHeight: 600,

        tool: true,
        resizeable: true,
        hidden: true,
    },

    admin_shop_view_order: {
        appId: 'admin_shop_view_order',
        title: 'View Order (admin)',
        component: AdminShopOrder,

        minWidth: 500,
        minHeight: 600,

        tool: true,
        resizeable: true,
        hidden: true
    },

    admin_shop_view_request: {
        appId: 'admin_shop_view_request',
        title: 'View Request (admin)',
        component: AdminShopRequest,

        minWidth: 500,
        minHeight: 200,

        tool: true,
        resizeable: true,
        hidden: true
    },

    ///////////////////////////////////////////////
    // apps/misc                                 //
    ///////////////////////////////////////////////

    auth: {
        appId: 'auth',
        title: 'Authorize',
        component: Auth,

        width: 289,
        height: 285,
        minWidth: 289,
        minHeight: 285,

        tool: true,
        resizeable: false
    },

    countdown: {
        appId: 'countdown',
        title: 'Countdown',
        component: Countdown,

        minWidth: 400,
        minHeight: 400,

        tool: false,
        resizeable: false,
        hiddenAfterLaunch: true,
    },

    dispo_inator_3000: {
        appId: 'dispo_inator_3000',
        title: 'Surprise me',
        component: DispoInator3000,

        width: 570,
        height: 490,
        minWidth: 570,
        minHeight: 490,

        tool: false,
        resizeable: false,
        hidden: true
    },

    error: {
        appId: 'error',
        title: 'Error',
        component: ErrorApp,

        minWidth: 1,
        minHeight: 1,

        tool: true,
        resizeable: false,
        hidden: true,
        fullscreen: true
    },

    evil: {
        appId: 'evil',
        title: 'Evil Rigby',
        component: Evil,

        width: 320,
        height: 200,
        minWidth: 320,
        minHeight: 200,

        tool: true,
        resizeable: false
    },

    rigby: {
        appId: 'rigby',
        title: 'Rigby',
        component: Rigby,

        minWidth: 367,
        minHeight: 476,

        tool: true,
        resizeable: false
    },

    run: {
        appId: 'run',
        title: 'DispoRun',
        component: Run,

        minWidth: 520,
        minHeight: 200,

        posX: 20,
        posY: 20,

        tool: false,
        resizeable: false,
        hidden: true
    },

    winver: {
        appId: 'winver',
        title: 'DispoVer',
        component: Winver,

        minWidth: 650,
        minHeight: 300,

        tool: true,
        resizeable: false
    },

    ///////////////////////////////////////////////
    // apps/onboarding                           //
    ///////////////////////////////////////////////

    onboarding: {
        appId: 'onboarding',
        title: 'Onboarding',
        component: Onboarding,

        minWidth: 600,
        minHeight: 470,

        tool: true, // can't minimize xdxd
        resizeable: false,
        hidden: true,
        wallpaper: onboardingWallpaper,
    },

    ///////////////////////////////////////////////
    // apps/projects                             //
    ///////////////////////////////////////////////

    project_manager: {
        appId: 'project_manager',
        title: 'DispoManager',
        component: projectManager,
        height: 615,
        minWidth: 536,
        minHeight: 515,

        tool: false,
        resizeable: false,
        hiddenUntilLaunch: true
    },

    project_browser: {
        appId: 'project_browser',
        title: "Project Browser",
        component: ProjectBrowser,

        width: 500,
        minHeight: 700,
        minWidth: 450,

        tool: false,
        resizeable: false,
        hiddenUntilLaunch: true,
    },

    project_profile: {
        appId: 'project_profile',
        title: "Project Profile",
        component: ProjectProfile,

        minHeight: 700,
        minWidth: 450,

        tool: false,
        resizeable: false,
        hidden: true,
        hiddenUntilLaunch: true,
    },

    project_edit: {
        appId: 'project_edit',
        title: "Project Edit",
        component: ProjectEdit,

        height: 490,
        minWidth: 542,
        minHeight: 307,

        tool: false,
        resizeable: false,
        hidden: true,
        hiddenUntilLaunch: true,
    },

    devlog_view: {
        appId: 'devlog_view',
        title: "Project Name | Devlog name",
        component: DevlogView,

        width: 500,
        minHeight: 700,
        minWidth: 450,

        tool: false,
        resizeable: false,
        hidden: true,
        hiddenUntilLaunch: true,
    },

    new_devlog: {
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
    },

    ///////////////////////////////////////////////
    // apps/shop                                 //
    ///////////////////////////////////////////////

    shop: {
        appId: 'shop',
        title: 'DispoShop',
        component: Shop,
        height: 650,
        minWidth: 600,
        minHeight: 310,

        tool: false,
        resizeable: true
    },

    category: {
        appId: 'category',
        title: 'View Category',
        component: Category,

        minWidth: 500,
        minHeight: 600,

        tool: true,
        resizeable: true
    },

    item: {
        appId: 'item',
        title: 'View Item',
        component: Item,

        minWidth: 671,
        minHeight: 550,

        tool: true,
        resizeable: true
    },

    order: {
        appId: 'order',
        title: 'View Order',
        component: Order,

        minWidth: 670,
        minHeight: 550,

        tool: true,
        resizeable: true
    },

    orders: {
        appId: 'orders',
        title: 'My orders',
        component: Orders,

        minWidth: 670,
        minHeight: 550,

        tool: true,
        resizeable: false
    },

    request: {
        appId: 'request',
        title: 'Submit a request',
        component: ShopRequest,

        minWidth: 300,
        minHeight: 400,

        tool: true,
        resizeable: true,
    },

    requests: {
        appId: 'requests',
        title: 'My requests',
        component: Requests,

        minWidth: 670,
        minHeight: 550,

        tool: true,
        resizeable: false
    },

    ///////////////////////////////////////////////
    // apps/users                                //
    ///////////////////////////////////////////////

    profile_viewer: {
        appId: 'profile_viewer',
        title: 'Profile Viewer',
        component: profileViewer,
        minWidth: 541,
        minHeight: 550,

        tool: false,
        resizeable: false,
        hidden: true,
        hiddenUntilLaunch: true
    },

    profile_edit: {
        appId: 'profile_edit',
        title: "Profile Edit",
        component: ProfileEdit,

        height: 410,
        minWidth: 542,
        minHeight: 307,

        tool: false,
        resizeable: false,
        hidden: true,
        hiddenUntilLaunch: true,
    },

    ///////////////////////////////////////////////
    // components (system dialogs)               //
    ///////////////////////////////////////////////

    message_box: {
        appId: 'message_box',
        title: 'messageBox',
        component: Messagebox,

        minWidth: 1,
        minHeight: 1,

        tool: true,
        resizeable: true,
        hidden: true
    },

    dialog_box: {
        appId: 'dialog_box',
        title: 'dialogBox',
        component: Dialogbox,

        minWidth: 1,
        minHeight: 1,

        tool: true,
        resizeable: true,
        hidden: true
    },
}
