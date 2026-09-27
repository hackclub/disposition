import Welcome from "~/apps/welcome.vue"
import Documentation from "~/apps/documentation.vue"
import type { AppDef } from "~/types/window"
import Winver from "~/apps/winver.vue"
import Auth from "~/apps/auth.vue"
import Run from "~/apps/run.vue"
import Rigby from "~/apps/rigby.vue"
import Admin from "~/apps/admin.vue"

export const APPS: { [key: string]: AppDef } = {
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

    admin: {
        appId: 'admin',
        title: 'DispoStats',
        component: Admin,

        width: 367,
        height: 476,
        minWidth: 367,
        minHeight: 476,

        tool: false,
        resizeable: true,
        hidden: true
    }
}