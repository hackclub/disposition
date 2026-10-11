<script setup lang="ts">
import type { Order, Item } from '~/types/database';

const manager = useWindowManager();
const orders = ref<Order[]>([]);
orders.value = await $fetch<Order[]>("/api/shop/orders");

// should i make the server return the item info from the db?
// db fetch is cheap but server fetch isnt very cheap. well, for now im kinda lazy so im just gonna do it like this

const items = ref<Item[]>([]);
orders.value.forEach(async order => {
    items.value.push(await $fetch<Item>(`/api/shop/items/${order.item}`));
})
</script>

<template>
    <div class="content" v-if="orders">
        <div class="order" v-for="(order, i) in orders">
            <img :src="`/images/${items[i]?.image}`" class="cover" />
            <div>
                <h2 v-if="items[i]?.media == 'other'">{{ items[i]?.album }}</h2>
                <h2 v-else>{{ items[i]?.artist }} - {{ items[i]?.artist }} ({{ items[i]?.media }})</h2>

                <p>{{ new Date(order.timestamp) }}</p>

                <div>
                    <button @click="manager.open('view_order', { id: order.id })">View</button>
                    <button v-if="order.status == 'fulfilled' || order.status == 'claimed'" disabled>Cancel</button>
                    <button v-else @click="manager.open('cancel_order', { id: order.id })">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.order {
    display: flex;
    flex-direction: row;
    gap: 5px;

    padding: 5px;
    border: 2px solid #c6c6c4;
    background-color: #dedede;

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
}
</style>