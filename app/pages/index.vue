<script setup lang="ts">
import "./index.css"
import Welcome from '~/apps/welcome.vue';
import Documentation from '~/apps/documentation.vue';
import StartMenu from "~/components/startMenu.vue";
import Taskbar from '~/components/taskbar.vue';
import TaskbarItem from '~/components/taskbarItem.vue';
import BenjiBuddy from "~/components/benjiBuddy.vue";
import AugustBuddy from "~/components/augustBuddy.vue";
import { APPS } from "~/registry/apps";
import type { PrivateUser } from "~/types/database";
import { onMounted, nextTick, computed } from "vue";

const {
    windows,
    open,
    isTypeOpen,
} = useWindowManager();

const {
    notifications
} = useNotificationManager();

const route = useRoute();
const { showError } = useErrorHandler();

onMounted(async () => {
    await nextTick();

    // callback failures redirect here with an error message
    if (route.query.error) {
        const { error, errorCode, message, ...query } = route.query;
        showError({
            error: error,
            message: String(message),
            statusCode: errorCode ? Number(errorCode) : undefined,
        });
        await navigateTo({ path: route.path, query }, { replace: true });
        return;
    }

    // launch onboarding for logged in users that haven't finished it yet
    const { loggedIn } = useUserSession();
    if (loggedIn.value) {
        const user = await $fetch<PrivateUser>("/api/user").catch(() => null);
        if (user && !user.onboardedAt) {
            if (!isTypeOpen("onboarding")) open("onboarding");
            return;
        }
    }

    // open welcome for the first app
    const { read } = useConfiguration("welcome");
    // if (!has("openNext")) write("openNext", true);
    if (!read("openNext")) return;
    if (!isTypeOpen("welcome")) open("welcome");
});

const fullscreenWindow = computed(() => windows.value.find((w) => w.fullscreen));
const wallpaperWindow = computed(() => windows.value.find((w) => w.wallpaper));
const overlayWindow = computed(() => fullscreenWindow.value ?? wallpaperWindow.value);

const wallpaper = computed(() =>
    wallpaperWindow.value?.wallpaper
    || useConfiguration("settings").read("wallpaperSource")
    || "/wallpaper/default.png"
);
</script>

<template>
    <ClientOnly>
        <div :style="{ backgroundImage: `url('${wallpaper}')` }" class="wallpaper"></div>
    </ClientOnly>

    <template v-for="w in windows" :key="w.id">
        <Window v-if="fullscreenWindow ? w.fullscreen : (!wallpaperWindow || w.wallpaper)" :instance="w">
            <Component :is="APPS[w.appId]?.component" :instance="w" v-bind="w.props" />
        </Window>
    </template>

    <Taskbar v-if="!overlayWindow">
        <template v-for="w in windows" :key="w.id">
            <TaskbarItem v-if="!w.tool" :instance="w" />
        </template>
    </Taskbar>

    <ClientOnly>
        <NotificationShim>
            <Notification v-for="notification in notifications" :notification="notification"></Notification>
        </NotificationShim>
    </ClientOnly>

    <ClientOnly v-if="!overlayWindow">
        <BenjiBuddy v-if="useConfiguration('settings').read('showBuddies')" />
        <AugustBuddy v-if="useConfiguration('settings').read('showBuddies')" />
    </ClientOnly>
</template>

<style scoped>
.wallpaper {
    width: 100vw;
    height: 100vw;
    background-size: contain;
}
</style>