<script setup lang="ts">
import type { Order, Item } from '~/types/database';

const manager = useWindowManager();
const { data: orders } = await useFetch<Order[]>("/api/shop/orders");

// should i make the server return the item info from the db?
// db fetch is cheap but server fetch isnt very cheap. well, for now im kinda lazy so im just gonna do it like this

const items = ref<Item[]>([]);
orders.value!.forEach(async order => {
    items.value.push(await $fetch<Item>(`/api/shop/items/${order.item}`));
})
</script>

<template>
    <div class="content" v-if="orders && orders.length > 0">
        <div class="order" v-for="(order, i) in orders">
            <img :src="`/images/${items[i]?.image}`" class="cover" />
            <div>
                <h2 v-if="items[i]?.media == 'other'">{{ items[i]?.album }}</h2>
                <h2 v-else>{{ items[i]?.album }} - {{ items[i]?.artist }} ({{ items[i]?.media }})</h2>

                <p>{{ new Date(order.timestamp).getDate() }}/{{ new Date(order.timestamp).getMonth() }}/{{ new
                    Date(order.timestamp).getFullYear() }} | {{ order.status }}</p>

                <div>
                    <button @click="manager.open('order', { id: order.id })">View</button>
                    <button v-if="order.status != 'idle'" disabled>Cancel</button>
                    <button v-else @click="manager.open('cancel_order', { id: order.id })">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    <div class="content" v-else-if="orders && orders.length == 0">
        <h1>No orders :(</h1>
    </div>
</template>

<style scoped>
.order {
    display: flex;
    flex-direction: row;
    gap: 5px;

    padding: 5px;
    border: 2px solid var(--color-border-light);
    background-color: var(--color-panel-bg);

    img {
        width: 80px;
        height: 80px;
    }

    div {
        display: flex;
        flex-direction: column;
        gap: 5px;

        h2 {
            margin: 0;
        }

        p {
            margin: 0;
        }

        div {
            display: flex;
            flex-direction: row;
            gap: 5px;
        }
    }
}

.content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;

    overflow-y: auto;
    min-height: 0;
    max-height: 100%;
}
</style>