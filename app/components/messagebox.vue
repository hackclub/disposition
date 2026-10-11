<script setup lang="ts">
import type { WindowInstance } from '~/types/window';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, message: string }>()
</script>

<template>
    <div class="content">
        <h2>{{ props.message }}</h2>
        <button @click="manager.close(props.instance.id)">OK</button>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
}
</style>