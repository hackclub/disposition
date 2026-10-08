<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { Item } from '~/types/shop';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const item = ref<Item>();
item.value = await $fetch<Item>(`/api/shop/items/${props.id}`)

async function buy() {
    const response = await $fetch(`/api/shop/items/:id/buy`, { method: "POST" });
}
</script>

<template>
    <div class="content">
        <h1>Are you sure you want to buy {{ item.album }}?</h1>
        <button @click="buy">Yes</button>
        <button @click="manager.close(props.instance.id)">Nevermind</button>
    </div>
</template>

<style scoped>
.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;
}
</style>