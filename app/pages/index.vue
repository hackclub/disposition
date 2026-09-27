<script setup lang="ts">
import "./index.css"
import Welcome from '~/apps/welcome.vue';
import Documentation from '~/apps/documentation.vue';
import StartMenu from "~/components/startMenu.vue";
import Taskbar from '~/components/taskbar.vue';
import TaskbarItem from '~/components/taskbarItem.vue';
import BenjiBuddy from "~/components/benjiBuddy.vue";
import { APPS } from "~/registry/apps";

const {
    windows,
    focused,
    open,
    close,
    focus,
    minimize,
    restore,
    isFocused,
    get,
    isTypeOpen,
} = useWindowManager();

// open welcome for the first app
if (!isTypeOpen("welcome")) open("welcome");
</script>

<template>
    <Window v-for="w in windows" :key="w.id" :instance="w">
        <Component :is="APPS[w.appId]?.component" />
    </Window>

    <Taskbar>
        <template v-for="w in windows" :key="w.id">
            <TaskbarItem v-if="!w.tool" :instance="w" />
        </template>
    </Taskbar>

    <BenjiBuddy />
</template>