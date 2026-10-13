<script setup lang="ts">
import type { WindowInstance } from '~/types/window';

export type MessageBoxOptions = {
    info?: boolean,
    warning?: boolean,
    error?: boolean,
    question?: boolean
}

const manager = useWindowManager();
const props = defineProps<{
    instance: WindowInstance,
    message?: string,
    options?: MessageBoxOptions
}>()
</script>

<template>
    <div class="content">
        <img v-if="props.options?.info" src="~/assets/icons/info.png" />
        <img v-else-if="props.options?.warning" src="~/assets/icons/warning.png" />
        <img v-else-if="props.options?.error" src="~/assets/icons/error.png" />
        <img v-else-if="props.options?.question" src="~/assets/icons/info.png" /> <!-- ditto from dialogBox.vue -->

        <div>
            <h2>{{ props.message }}</h2>
            <button @click="manager.close(props.instance.id)">OK</button>
        </div>
    </div>
</template>

<style scoped>
.content {
    padding: 10px;

    display: flex;
    flex-direction: row;

    justify-content: start;
    align-items: center;
    gap: 10px;

    img {
        width: 50px;
        height: 50px;
    }

    div {
        h2 {
            margin: 0;
        }
        
        button {
            max-width: 100px;
        }


        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>