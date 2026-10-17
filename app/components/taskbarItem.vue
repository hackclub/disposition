<script lang="ts" setup>
import type { Component } from 'vue';
import { APPS } from '~/registry/apps';
import { ICONS } from '~/registry/icons';
import type { WindowInstance } from '~/types/window';

const manager = useWindowManager();
const props = defineProps<{
    instance: WindowInstance,
}>()

function open() {
    if(props.instance.minimized) {
        manager.restore(props.instance.id);
        manager.focus(props.instance.id);
    } else {
        manager.minimize(props.instance.id);
    }
}
</script>

<template>
    <div class="item" @click="open">
        <button class="icon" :style="{
            backgroundImage: `url(${ICONS[instance.appId]})`
        }"></button>
        <div v-if="!instance.minimized" class="open"></div>
        <div v-else class="minimized"></div>
    </div>

</template>

<style scoped>
.item {
    width: 25px;
    height: 100%;

    gap: 2px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.icon {
    border: none;
    width: 25px;
    height: 25px;

    background-size: cover;
}

.open {
    bottom: 0;
    width: 20px;
    background-color: var(--color-white);

    height: 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}
 
.minimized {
    bottom: 0;
    width: 5px;
    background-color: var(--color-white);

    height: 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}
</style>