<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { Item } from '~/types/database';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()

const balance = ref<number>(0);
const item = ref<Item>();
item.value = await $fetch<Item>(`/api/shop/items/${props.id}`)
balance.value = await $fetch<number>(`/api/user/balance`);

async function buy() {
    const response = await $fetch(`/api/shop/orders`, { method: "POST" });
}
</script>

<template>
    <div class="content" v-if="balance >= item.price">
        <h1>Are you sure you want to buy {{ item.album }}?</h1>
        <span>
            <button @click="buy">Yes</button>
            <button @click="manager.close(props.instance.id)">Nevermind</button>
        </span>
    </div>
    <div class="content" v-else>
        <h1>Unfortunately, you can't afford {{ item.album }} yet :(</h1>
        <span>
            <button @click="manager.close(props.instance.id)">OK</button>
        </span>
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