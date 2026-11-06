import Documentation from "~/apps/documentation.vue";
import Welcome from "~/apps/welcome.vue";
import type { WindowInstance } from "~/types/window"
import { APPS } from "~/registry/apps.ts"
import type { DialogBoxOptions } from "~/components/dialogBox.vue";
import type { MessageBoxOptions } from "~/components/messageBox.vue";

export const useWindowManager = () => {
    const windows = useState<WindowInstance[]>("wm-windows", () => []);

    // keeps z values at 1..n so they never grow without bound
    function restack(topId?: string) {
        const ordered = [...windows.value].sort((a, b) => a.z - b.z);
        const topIndex = ordered.findIndex(w => w.id === topId);
        if (topIndex !== -1) ordered.push(...ordered.splice(topIndex, 1));

        // fullscreen windows always sit above everything else
        const normal = ordered.filter(w => !w.fullscreen);
        const fullscreen = ordered.filter(w => w.fullscreen);
        [...normal, ...fullscreen].forEach((w, i) => w.z = i + 1);
    }

    function add(instance: Omit<WindowInstance, "id" | "z">) {
        const id = (Math.random() * 10000).toString();
        windows.value.push({ ...instance, id, z: 0 });
        restack(id);
    }

    function open(appId: keyof typeof APPS, props: Record<string, any> = {}) {
        const app = APPS[appId];
        if (!app) return;

        const width = app.width ?? app.minWidth;
        const height = app.height ?? app.minHeight;

        const centered = import.meta.client && app.posX === undefined && app.posY === undefined;

        let posX = app.posX ?? 200;
        let posY = app.posY ?? 200;

        if (centered) {
            posX = window.innerWidth / 2 - width / 2;
            posY = window.innerHeight / 2 - height / 2;
        }

        add({
            appId: appId.toString(),
            title: app.title,
            minimized: false,

            width,
            height,
            minWidth: app.minWidth,
            minHeight: app.minHeight,

            tool: app.tool,
            resizeable: app.resizeable,
            fullscreen: app.fullscreen ?? false,
            wallpaper: app.wallpaper,

            posX,
            posY,

            props
        });
    }

    function close(id: string) {
        windows.value = windows.value.filter(w => w.id !== id);
    }

    function focus(id: string) {
        restack(id);
    }

    function minimize(id: string) {
        windows.value.find(w => w.id === id)!.minimized = true;
    }

    function restore(id: string) {
        windows.value.find(w => w.id === id)!.minimized = false;
    }

    function resize(id: string, size: { width?: number; height?: number }) {
        const w = get(id);
        if (size.width !== undefined) w.width = Math.max(w.minWidth, size.width);
        if (size.height !== undefined) w.height = Math.max(w.minHeight, size.height);
    }

    function move(id: string, pos: { posX?: number; posY?: number }) {
        const w = get(id);
        if (pos.posX !== undefined) w.posX = pos.posX;
        if (pos.posY !== undefined) w.posY = pos.posY;
    }

    function isFocused(id: string) {
        return get(id).z === Math.max(...windows.value.map(w => w.z));
    }

    function get(id: string) {
        return windows.value.find(w => w.id === id)!;
    }

    function isTypeOpen(appId: string) {
        return windows.value.find(w => w.appId === appId);
    }

    function openBox(appId: "message_box" | "dialog_box", title: string, props: Record<string, any>) {
        const width = 360;
        const height = 160;

        add({
            appId,
            title,
            minimized: false,

            width,
            height,
            minWidth: 260,
            minHeight: 140,

            tool: true,
            resizeable: true,

            posX: import.meta.client ? (window.innerWidth - width) / 2 : 200,
            posY: import.meta.client ? (window.innerHeight - height) / 2 : 200,

            props
        });
    }

    function messageBox(title: string, message: string, options?: MessageBoxOptions) {
        openBox("message_box", title, { message, options });
    }

    function dialogBox(title: string, message: string, callback: Function, options?: DialogBoxOptions) {
        openBox("dialog_box", title, { message, callback, options });
    }

    return {
        windows: readonly(windows),
        open,
        close,
        focus,
        minimize,
        restore,
        resize,
        move,
        isFocused,
        get,
        isTypeOpen,
        messageBox,
        dialogBox
    }
}
