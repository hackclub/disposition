import Documentation from "~/apps/documentation.vue";
import Welcome from "~/apps/welcome.vue";
import type { WindowInstance } from "~/types/window"
import { APPS } from "~/registry/apps.ts"
import type { DialogBoxOptions } from "~/components/dialogBox.vue";
import type { MessageBoxOptions } from "~/components/messageBox.vue";

export const useWindowManager = () => {
    const windows = useState<WindowInstance[]>('wm-windows', () => []);
    const nextZ = useState('wm-z', () => 1);
    const focused = (id: string) => { windows.value.find(w => w.id === id)!.z = nextZ.value++ };

    function open(appId: keyof typeof APPS, props: Record<string, any> = {}) {
        if (!APPS[appId]) return;

        let posX = APPS[appId].posX ? APPS[appId].posX : 200;
        let posY = APPS[appId].posY ? APPS[appId].posY : 200;

        if (import.meta.client && !APPS[appId].posX && !APPS[appId].posY) {
            posX = window.innerWidth / 2 - APPS[appId].width / 2;
            posY = window.innerHeight / 2 - APPS[appId].height / 2;
        }

        windows.value.push({
            id: (Math.random() * 10000).toString(),
            appId: appId.toString(),
            title: APPS[appId].title,
            z: nextZ.value++,
            minimized: false,

            width: APPS[appId].width,
            height: APPS[appId].height,
            minWidth: APPS[appId].minWidth,
            minHeight: APPS[appId].minHeight,

            tool: APPS[appId].tool,
            resizeable: APPS[appId].resizeable,

            posX,
            posY,

            props
        });
    }

    function close(id: string) {
        windows.value = windows.value.filter(w => w.id !== id);
    }

    function focus(id: string) {
        windows.value.find(w => w.id === id)!.z = nextZ.value++;
    }

    function minimize(id: string) {
        windows.value.find(w => w.id === id)!.minimized = true;
    }

    function restore(id: string) {
        windows.value.find(w => w.id === id)!.minimized = false;
    }

    function isFocused(id: string) {
        return windows.value.find(w => w.id === id)!.minimized;
    }

    function get(id: string) {
        return windows.value.find(w => w.id === id)!;
    }

    function isTypeOpen(appId: string) {
        return windows.value.find(w => w.appId === appId);
    }

    function messageBox(title: string, message: string, options?: MessageBoxOptions) {
        let posX = 200;
        let posY = 200;

        const width = getTextWidth(message, "bold 20pt Joan") + 100;

        if (import.meta.client) {
            posX = window.innerWidth / 2 - width / 2;
            posY = window.innerHeight / 2 - 120 / 2;
        }

        windows.value.push({
            id: (Math.random() * 10000).toString(),
            appId: "messageBox",
            title: title,
            z: nextZ.value++,
            minimized: false,

            width: width,
            height: 120,
            minWidth: width,
            minHeight: 120,

            tool: true,
            resizeable: true,

            posX,
            posY,

            props: { title, message, options }
        });
    }

    function dialogBox(title: string, message: string, callback: Function, options?: DialogBoxOptions) {
        let posX = 200;
        let posY = 200;

        const width = getTextWidth(message, "bold 20pt Joan") + 100;

        if (import.meta.client) {
            posX = window.innerWidth / 2 - width / 2;
            posY = window.innerHeight / 2 - 120 / 2;
        }

        windows.value.push({
            id: (Math.random() * 10000).toString(),
            appId: "dialogBox",
            title: title,
            z: nextZ.value++,
            minimized: false,

            width: width,
            height: 120,
            minWidth: width,
            minHeight: 120,

            tool: true,
            resizeable: true,

            posX,
            posY,

            props: { title, message, callback, options }
        });
    }

    return {
        windows: readonly(windows),
        focused,
        open,
        close,
        focus,
        minimize,
        restore,
        isFocused,
        get,
        isTypeOpen,
        messageBox,
        dialogBox
    }
}