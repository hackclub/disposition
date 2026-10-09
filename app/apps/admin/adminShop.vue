<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type {Item, Order, Request} from "~/types/database";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);
let currentTab = ref<string>("items");

const items = ref<Item[]>([]);
const orders = ref<Order[]>([]);
const requests = ref<Request[]>([]);

if (admin) {
    items.value = await $fetch<Item[]>("/api/shop/items/");
    orders.value = await $fetch<Order[]>("/api/shop/orders?user=all");
    requests.value = await $fetch<Request[]>("/api/shop/requests?user=all");
}
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/Shop.png" alt="DispoAdminShopThing Logo" class="logo" />
                <span>
                    <h2>DispoAdminShopThing</h2>
                    <p>super secret admin app for super secret people 🙏</p>
                </span>
            </div>

            <div class="tabs">
                <button @click="currentTab = 'items'">Items</button>
                <button @click="currentTab = 'orders'">Orders</button>
                <button @click="currentTab = 'requests'">Requests</button>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main">
            <AuthState v-slot="{ loggedIn, user }">
                <div v-if="loggedIn && $config.public.adminIds.includes(user.slackId)" class="flex">
                    <div v-if="currentTab === 'items'">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Album</th>
                                    <th>Artist</th>
                                    <th>Genre</th>
                                    <th>Media</th>
                                    <th>Price</th>
                                    <th>
                                        <button @click="manager.open('admin_shop_add_item')">Add</button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in items" :key="item.id">
                                    <td>{{ item.id }}</td>
                                    <td>{{ item.album }}</td>
                                    <td>{{ item.artist }}</td>
                                    <td>{{ item.genre }}</td>
                                    <td>{{ item.media }}</td>
                                    <td>{{ item.price }}</td>
                                    <td>
                                        <button @click="manager.open('admin_shop_item', { id: item.id })">Edit</button>
                                        <button
                                            @click="manager.open('admin_shop_item_delete', { id: item.id })">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="currentTab === 'orders'">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Item ID</th>
                                    <th>User ID</th>
                                    <th>Status</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in orders" :key="order.id">
                                    <td>{{ order.id }}</td>
                                    <td @click="manager.open('shop_item', { item: order.item })">{{ order.item }}</td>
                                    <td @click="manager.open('profile_viewer', { user: order.user })">{{ order.user }}
                                    </td>
                                    <td>{{ order.status }}</td>
                                    <td>{{ order.timestamp }}</td>
                                    <td>
                                        <button
                                            @click="manager.open('admin_shop_order', { order: order.id })">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="currentTab === 'requests'">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User ID</th>
                                    <th>Album</th>
                                    <th>Artist</th>
                                    <th>Media</th>
                                    <th>Status</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="request in requests" :key="request.id">
                                    <td>{{ request.id }}</td>
                                    <td>{{ request.user }}</td>
                                    <td>{{ request.album }}</td>
                                    <td>{{ request.artist }}</td>
                                    <td>{{ request.media }}</td>
                                    <td>{{ request.status }}</td>
                                    <td>{{ request.timestamp }}</td>
                                    <td>
                                        <button
                                            @click="manager.open('admin_shop_request', { id: request.id })">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-else class="center">
                    sorry, not admin :(
                </div>
            </AuthState>
        </div>
    </div>
</template>

<style scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.main {
    padding: 10px;
}

.flex {
    display: flex;
    flex-direction: column;

    span h1 {
        margin: 0;
    }
}

.data {
    background-color: #E6E6E6;
    border: 2px solid #8E8F90;
    padding: 5px;
}

.tabs {
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding-left: 5px;

    button {
        background-color: #F2F2F2;
        border: none;
        border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        user-select: none;
    }
}

.logo {
    width: 60px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem black);
}

.header {
    background: repeating-linear-gradient(0deg,
            #d7d7d7 0px,
            #d7d7d7 6px,
            #9f9f9f 6px,
            #9f9f9f 7px);

    display: flex;
    flex-direction: column;

    h2 {
        font-weight: normal;
    }

    font-family: 'Joan',
    serif;
    user-select: none;
}

.striped-bg {
    width: 100%;
    height: 80px;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-left: 7px;
    gap: 2px;

    span {
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: column;

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px #000000);
        }

        h2 {
            margin: 0;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px #000000);
        }
    }
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid #c6c6c4;
    background-color: #dedede;
}

.content {
    display: flex;
    flex-direction: column;
}
</style>