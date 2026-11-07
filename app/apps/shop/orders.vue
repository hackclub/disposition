<script setup lang="ts">
import type { ServerOrder } from '~/types/database';

const manager = useWindowManager();
const session = useUserSession();
const { data: orders } = await useFetch<ServerOrder[]>("/api/shop/orders", { key: "orders", immediate: session.loggedIn.value });

async function cancelOrder(id: number) {
    await manager.dialogBox("Cancel order?", `Are you sure you want to canel order ${id}?`, async (result: boolean) => {
        if (!result) return;
        
        const data = new FormData();
        data.append("status", "cancelled");

        const response = await $fetch(`/api/shop/orders/${id}`, { method: "PATCH", body: data });
        if (!response) manager.messageBox("Error!", `Error cancelling order ${id}. Check browser console.`, { error: true });
        
        await refreshNuxtData("orders");
    }, { question: true })
}
</script>

<template>
    <div class="content" v-if="orders && orders.length > 0">
        <div class="order" v-for="(order, i) in orders">
            <img :src="`/images/${order.item.image}`" class="cover" />
            <div>
                <h2 v-if="order.item.media == 'other'">{{ order.item.album }}</h2>
                <h2 v-else>{{ order.item.album }} - {{ order.item.artist }} ({{ order.item.media }})</h2>

                <p>{{ new Date(order.timestamp).getDate() }}/{{ new Date(order.timestamp).getMonth() }}/{{ new
                    Date(order.timestamp).getFullYear() }} | {{ order.status }}</p>

                <div>
                    <button @click="manager.open('order', { id: order.id })">View</button>
                    <button v-if="order.status != 'idle'" disabled>Cancel</button>
                    <button v-else @click="cancelOrder(order.id)">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    <div class="content" v-else-if="orders && orders.length == 0">
        <h1>No orders :(</h1>
    </div>
    <div class="content" v-else-if="!session.loggedIn.value">
        <h1>Sorry, not logged in :(</h1>
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