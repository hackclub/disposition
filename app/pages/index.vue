<script setup lang="ts">
import "./index.css"
import Welcome from '~/apps/welcome.vue';
import Documentation from '~/apps/documentation.vue';
import StartMenu from "~/components/startMenu.vue";
import Taskbar from '~/components/taskbar.vue';
import TaskbarItem from '~/components/taskbarItem.vue';
import BenjiBuddy from "~/components/benjiBuddy.vue";
import AugustBuddy from "~/components/augustBuddy.vue";
import onboardingWallpaper from "~/assets/misc/onboardingBackground.png"
import { APPS } from "~/registry/apps";
import { onMounted, nextTick, computed } from "vue";

const {
    windows,
    open,
    isTypeOpen,
} = useWindowManager();

const {
    notifications
} = useNotificationManager();

onMounted(async () => {
    await nextTick();

    // open welcome for the first app
    const { read } = useConfiguration("welcome");
    // if (!has("openNext")) write("openNext", true);
    if (!read("openNext")) return;
    if (!isTypeOpen("welcome")) open("welcome");
});

const wallpaper = computed(() =>
    useConfiguration("settings").read("wallpaperSource") || "/wallpaper/default.png"
);

const onboardingOn = computed(() => windows.value.find((w) => w.appId == 'onboarding'))
</script>

<template>
    <ClientOnly>
        <div v-if="onboardingOn" :style="{ backgroundImage: `url('${onboardingWallpaper}')` }" class="wallpaper"></div>
        <div v-else :style="{ backgroundImage: `url('${wallpaper}')` }" class="wallpaper"></div>
    </ClientOnly>

    <template v-for="w in windows" :key="w.id">
        <Window v-if="!onboardingOn || w.appId === 'onboarding'" :instance="w">
            <Component :is="APPS[w.appId]?.component" :instance="w" v-bind="w.props" />
        </Window>
    </template>

    <Taskbar v-if="!onboardingOn">
        <template v-for="w in windows" :key="w.id">
            <TaskbarItem v-if="!w.tool" :instance="w" />
        </template>
    </Taskbar>

    <ClientOnly>
        <NotificationShim>
            <Notification v-for="notification in notifications" :notification="notification"></Notification>
        </NotificationShim>
    </ClientOnly>

    <ClientOnly v-if="!onboardingOn">
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