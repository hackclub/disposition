<script setup lang="ts">
import type { WindowInstance } from '~/types/window';

const manager = useWindowManager();
const props = withDefaults(defineProps<{
    instance: WindowInstance,
    message?: string,
    info?: boolean,
    warning?: boolean,
    error?: boolean
}>(), {
    message: "",
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