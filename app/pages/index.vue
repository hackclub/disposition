<script setup lang="ts">
import "./index.css"
import Welcome from '~/apps/welcome.vue';
import Documentation from '~/apps/documentation.vue';
import StartMenu from "~/components/startMenu.vue";
import Taskbar from '~/components/taskbar.vue';
import TaskbarItem from '~/components/taskbarItem.vue';
import BenjiBuddy from "~/components/benjiBuddy.vue";
import { APPS } from "~/registry/apps";
import { onMounted, nextTick, computed } from "vue";

const {
    windows,
    open,
    isTypeOpen,
} = useWindowManager();


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
</script>

<template>
    <ClientOnly>
        <div :style="{
            backgroundImage: `url('` + wallpaper + `')`
        }" class="wallpaper">
        </div>
    </ClientOnly>


    <Window v-for="w in windows" :key="w.id" :instance="w">
        <Component :is="APPS[w.appId]?.component" :instance="w" v-bind="w.props" />
    </Window>

    <Taskbar>
        <template v-for="w in windows" :key="w.id">
            <TaskbarItem v-if="!w.tool" :instance="w" />
        </template>
    </Taskbar>

    <ClientOnly>
        <BenjiBuddy v-if="useConfiguration('settings').read('showBuddy')" />
    </ClientOnly>
</template>

<style scoped>
.wallpaper {
    width: 100vw;
    height: 100vw;
    background-size: contain;
}
</style>