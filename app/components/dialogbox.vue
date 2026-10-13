<script setup lang="ts">
import type { WindowInstance } from '~/types/window';

const manager = useWindowManager();
const props = withDefaults(defineProps<{
    instance: WindowInstance,
    message: string,
    callback: Function,
    info?: boolean,
    warning?: boolean,
    error?: boolean
}>(), {
    info: false,
    warning: false,
    error: false
})
</script>

<template>
    <div class="content">
        <img v-if="props.info" src="~/assets/icons/info.png" />
        <img v-else-if="props.warning" src="~/assets/icons/warning.png" />
        <img v-else-if="props.error" src="~/assets/icons/error.png" />

        <div>
            <h2>{{ props.message }}</h2>

            <span>
                <button @click="callback(true); manager.close(instance.id)">Yes</button>
                <button @click="callback(false); manager.close(instance.id)">No</button>
            </span>
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

        span {
            display: flex;
            flex-direction: row;
            gap: 10px;

            button {
                max-width: 100px;
            }
        }

        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>