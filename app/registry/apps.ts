import Welcome from "~/apps/welcome.vue"
import Documentation from "~/apps/documentation.vue"
import type { AppDef } from "~/types/window"
import Winver from "~/apps/misc/winver.vue"
import Auth from "~/apps/misc/auth.vue"
import Run from "~/apps/misc/run.vue"
import Rigby from "~/apps/misc/rigby.vue"
import AdminStats from "~/apps/admin/adminStats.vue"
import Config from "~/apps/config.vue"
import Shop from "~/apps/shop.vue"
import Notification from "~/apps/notification.vue"
import projectManager from "~/apps/projectManager.vue"
import profileViewer from "~/apps/profileViewer.vue"
import AdminShop from "~/apps/admin/adminShop.vue"
import AdminShopAddItem from "~/apps/admin/adminShopAddItem.vue"

export const APPS: { [key: string]: AppDef } = {

    profileViewer: {
        appId: 'profileViewer',
        title: 'Profile Viewer',
        component: profileViewer,
        width: 500,
        height: 550,
        minWidth: 541,
        minHeight: 550,

        tool: false,
        resizeable: false,

    },

    projectManager: {
        appId: 'projectManager',
        title: 'DispoManager',
        component: projectManager,
        width: 536,
        height: 615,
        minWidth: 536,
        minHeight: 515,

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

    shop: {
        appId: 'shop',
        title: 'DispoShop',
        component: Shop,
        width: 500,
        height: 650,
        minWidth: 600,
        minHeight: 310,

        tool: false,
        resizeable: false
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

    admin_shop: {
        appId: 'admin_shop',
        title: 'DispoAdminShopThing',
        component: AdminShop,

        width: 400,
        height: 500,
        minWidth: 450,
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
    }
}