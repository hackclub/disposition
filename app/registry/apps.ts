import Welcome from "~/apps/welcome.vue"
import Documentation from "~/apps/documentation.vue"
import type { AppDef } from "~/types/window"
import Winver from "~/apps/misc/winver.vue"
import Auth from "~/apps/misc/auth.vue"
import Run from "~/apps/misc/run.vue"
import Rigby from "~/apps/misc/rigby.vue"
import AdminStats from "~/apps/admin/adminStats.vue"
import Config from "~/apps/config.vue"
import Shop from "~/apps/shop/shop.vue"
import Notification from "~/apps/notification.vue"
import projectManager from "~/apps/projects/projectManager.vue"
import profileViewer from "~/apps/users/profileViewer.vue"
import AdminShop from "~/apps/admin/shop/adminShop.vue"
import ProfileEdit from "~/apps/users/profileEdit.vue"
import AdminShopAddItem from "~/apps/admin/shop/adminShopAddItem.vue"
import Item from "~/apps/shop/item.vue"
import ShopRequest from "~/apps/shop/request.vue"
import Orders from "~/apps/shop/orders.vue"
import AdminShopOrder from "~/apps/admin/shop/adminShopOrder.vue"
import Order from "~/apps/shop/order.vue"
import Messagebox from "~/components/messageBox.vue"
import Dialogbox from "~/components/dialogBox.vue"
import AdminShopEditItem from "~/apps/admin/shop/adminShopEditItem.vue"
import Category from "~/apps/shop/category.vue"
import ProjectProfile from "~/apps/projects/projectProfile.vue"
import ProjectBrowser from "~/apps/projects/projectBrowser.vue"
import Requests from "~/apps/shop/requests.vue"
import AdminShopRequest from "~/apps/admin/shop/adminShopRequest.vue"
import Feedback from "~/apps/feedback.vue"
import ProjectEdit from "~/apps/projects/projectEdit.vue"
import DevlogView from "~/apps/projects/devlogView.vue"
import Onboarding from "~/apps/onboarding/onboarding.vue"

import AdminAddAnnouncement from "~/apps/admin/notifications/adminAddAnnouncement.vue"
import AdminNotifications from "~/apps/admin/notifications/adminNotifications.vue"

// don't ask me why, but all app id's should be snake case.
export const APPS: { [key: string]: AppDef } = {

    onboarding: {
        appId: 'onboarding',
        title: 'Onboarding',
        component: Onboarding,

        width: 600,
        height: 470,
        minWidth: 600,
        minHeight: 470,

        tool: false,
        resizeable: false,
    },

    devlog_view: {
        appId: 'devlog_view',
        title: "Project Name | Devlog name",
        component: DevlogView,

        width: 500,
        height: 700,
        minHeight: 700,
        minWidth: 450,

        tool: false,
        resizeable: false,

    },

    project_edit: {
        appId: 'project_edit',
        title: "Project Edit",
        component: ProjectEdit,

        width: 542,
        height: 490,
        minWidth: 542,
        minHeight: 307,

        tool: false,
        resizeable: false,
    },

    project_browser: {
        appId: 'project_browser',
        title: "Project Browser",
        component: ProjectBrowser,

        width: 500,
        height: 700,
        minHeight: 700,
        minWidth: 450,

        tool: false,
        resizeable: false,
    },

    project_profile: {
        appId: 'project_profile',
        title: "Project Profile",
        component: ProjectProfile,

        width: 450,
        height: 700,
        minHeight: 700,
        minWidth: 450,

        tool: false,
        resizeable: false,
    },

    profile_edit: {
        appId: 'profile_edit',
        title: "Profile Edit",
        component: ProfileEdit,

        width: 542,
        height: 410,
        minWidth: 542,
        minHeight: 307,

        tool: false,
        resizeable: false,
    },

    welcome: {
        appId: 'welcome',
        title: 'Welcome!',
        component: Welcome,

        width: 600,
        height: 310,
        minWidth: 600,
        minHeight: 310,

        tool: false,
        resizeable: false
    },

    feedback: {
        appId: 'feedback',
        title: 'Feedback',
        component: Feedback,

        width: 400,
        height: 550,
        minWidth: 400,
        minHeight: 550,

        tool: false,
        resizeable: true,
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

    project_manager: {
        appId: 'project_manager',
        title: 'DispoManager',
        component: projectManager,
        width: 536,
        height: 615,
        minWidth: 536,
        minHeight: 515,

        tool: false,
        resizeable: false,
    },

    profile_viewer: {
        appId: 'profile_viewer',
        title: 'Profile Viewer',
        component: profileViewer,
        width: 541,
        height: 550,
        minWidth: 541,
        minHeight: 550,

        tool: false,
        resizeable: false,
    },

    notification: {
        appId: 'notification',
        title: 'Notifications',
        component: Notification,
        width: 367,
        height: 476,
        minWidth: 367,
        minHeight: 476,

        tool: false,
        resizeable: false,
    },

    winver: {
        appId: 'winver',
        title: 'DispoVer',
        component: Winver,

        width: 650,
        height: 300,
        minWidth: 650,
        minHeight: 300,

        tool: true,
        resizeable: false
    },

    auth: {
        appId: 'auth',
        title: 'Authorize',
        component: Auth,

        width: 500,
        height: 150,
        minWidth: 400,
        minHeight: 150,

        tool: true,
        resizeable: true
    },

    run: {
        appId: 'run',
        title: 'DispoRun',
        component: Run,

        width: 520,
        height: 200,
        minWidth: 520,
        minHeight: 200,

        posX: 20,
        posY: 20,

        tool: false,
        resizeable: false
    },

    rigby: {
        appId: 'rigby',
        title: 'Rigby',
        component: Rigby,

        width: 367,
        height: 476,
        minWidth: 367,
        minHeight: 476,

        tool: true,
        resizeable: false
    },

    config: {
        appId: 'config',
        title: 'DispoConfig',
        component: Config,

        width: 367,
        height: 476,
        minWidth: 367,
        minHeight: 476,

        tool: false,
        resizeable: true,
        hidden: false
    },

    message_box: {
        appId: 'message_box',
        title: 'messageBox',
        component: Messagebox,

        width: 1,
        height: 1,
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

        width: 1,
        height: 1,
        minWidth: 1,
        minHeight: 1,

        tool: true,
        resizeable: true,
        hidden: true
    },

    ///////////////////////////////////////////
    // admin apps                            //
    ///////////////////////////////////////////

    admin_stats: {
        appId: 'admin_stats',
        title: 'DispoStats',
        component: AdminStats,

        width: 380,
        height: 476,
        minWidth: 380,
        minHeight: 476,

        tool: false,
        resizeable: true,
        hidden: true
    },

    admin_notifications: {
        appId: 'admin_notifications',
        title: 'DispoAdminNotificationThing',
        component: AdminNotifications,

        width: 500,
        height: 500,
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

        width: 403,
        height: 561,
        minWidth: 403,
        minHeight: 561,

        tool: false,
        resizeable: false,
    },

    admin_shop: {
        appId: 'admin_shop',
        title: 'DispoAdminShopThing',
        component: AdminShop,

        width: 500,
        height: 500,
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

        width: 500,
        height: 600,
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

        width: 500,
        height: 600,
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

        width: 500,
        height: 600,
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

        width: 500,
        height: 200,
        minWidth: 500,
        minHeight: 200,

        tool: true,
        resizeable: true,
        hidden: true
    },

    ///////////////////////////////////////////
    // shop                                  //
    ///////////////////////////////////////////

    shop: {
        appId: 'shop',
        title: 'DispoShop',
        component: Shop,
        width: 600,
        height: 650,
        minWidth: 600,
        minHeight: 310,

        tool: false,
        resizeable: true
    },

    item: {
        appId: 'item',
        title: 'View Item',
        component: Item,

        width: 671,
        height: 550,
        minWidth: 671,
        minHeight: 550,

        tool: true,
        resizeable: true
    },

    orders: {
        appId: 'orders',
        title: 'My orders',
        component: Orders,

        width: 670,
        height: 550,
        minWidth: 670,
        minHeight: 550,

        tool: true,
        resizeable: false
    },

    order: {
        appId: 'order',
        title: 'View Order',
        component: Order,

        width: 670,
        height: 550,
        minWidth: 670,
        minHeight: 550,

        tool: true,
        resizeable: true
    },

    category: {
        appId: 'category',
        title: 'View Category',
        component: Category,

        width: 500,
        height: 600,
        minWidth: 500,
        minHeight: 600,

        tool: true,
        resizeable: true
    },

    request: {
        appId: 'request',
        title: 'Submit a request',
        component: ShopRequest,

        width: 300,
        height: 400,
        minWidth: 300,
        minHeight: 400,

        tool: true,
        resizeable: true,
    },

    requests: {
        appId: 'requests',
        title: 'My requests',
        component: Requests,

        width: 670,
        height: 550,
        minWidth: 670,
        minHeight: 550,

        tool: true,
        resizeable: false
    },
}