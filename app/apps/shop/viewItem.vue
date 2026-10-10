<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { Item } from '~/types/database';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();

const item = ref<Item>();
const balance = ref<number>(0);
item.value = await $fetch<Item>(`/api/shop/items/${props.id}`);
balance.value = await $fetch<number>("/api/user/balance");
</script>

<template>
    <AuthState v-slot="{ loggedIn }">
        <div class="content">
            <div class="horizontal">
                <div class="vertical">
                    <img class="image" :src="`/images/${item.image}`" alt="Item image" />
                </div>
                <div class="vertical fields">
                    <p>
                        <b>Genre: </b>{{ item.genre }}
                    </p>
                    <p>
                        <b>Length: </b>13 tracks, 85:13
                    </p>
                    <p>
                        <b>Release date: </b>9/11/2001
                    </p>

                    <p>
                    <h3>Price: </h3>{{ item.price }}
                    </p>

                    <!-- todo: add some tags here like staff pick, trending, most bought item, etc -->
                    <b>Tags:</b>
                    <div class="tags">
                        <p v-if="item.staffPickAt">Staff pick</p>
                    </div>
                </div>
            </div>

            <div class="horizontal">
                <div class="vertical">
                    <h2 v-if="item.media == 'other'">{{ item.album }}</h2>
                    <h2 v-else>{{ item.artist }} - {{ item.album }} ({{ item.media }})</h2>

                    <p>{{ item.description }}</p>

                    <div class="vertical" v-if="admin && item.urls && item.urls.length > 0">
                        <label>URLs</label>
                        <div v-for="url in item.urls">
                            <a :href="url">{{ url }}</a>
                        </div>
                    </div>
                    <div class="vertical">
                        <h2>Links</h2>

                        <a>last.fm</a>
                        <a>spotify</a>
                    </div>
                </div>

                <div class="vertical order" v-if="loggedIn">
                    <h2>Finish your order</h2>

                    <b>Shipping address</b>
                    <select>
                        <option>308 Arroyo Negra Lane, New Mexico, USA, 540080</option>
                    </select>

                    <b>Order summary</b>
                    <div class="summary">
                        <p><b>Item price: </b>{{ item.price }}</p>
                        <p><b>Current balance: </b>{{ balance }}</p>

                        <hr />

                        <p><b>Balance after purchase: {{ balance - item.price }}</b></p>
                    </div>

                    <button v-if="item.price > balance" disabled>You need {{ item.price - balance }} more coins!</button>
                    <button v-else @click="manager.open('confirm_order', { id: props.id })">Buy {{ item.album }}</button>
                </div>
            </div>
        </div>
    </AuthState>
</template>

<style scoped>
.order {
    justify-content: space-evenly;
    min-width: 300px;
}

.summary {
    padding: 10px;
    border: 1px solid #c6c6c4;
    background-color: #dedede;
}

h3 {
    margin: 0;
}

p {
    margin: 2px;
}

.tags {
    display: flex;
    flex-direction: row;
    gap: 5px;

    p {
        padding: 3px;
        border: 1px solid #c6c6c4;
        background-color: #dedede;
    }
}

.description {
    min-height: 100px;
    max-height: 100px;

    width: 100%;
    min-width: 100%;
    max-width: 100%;
}

.horizontal {
    display: flex;
    flex-direction: row;
    gap: 3px;
}

.vertical {
    display: flex;
    flex-direction: column;

    gap: 3px;
}

.image {
    width: 200px;
    height: 200px;
    object-fit: contain;
    border: 2px dashed #888;
    box-sizing: border-box;
}

.drag-and-drop.dragging {
    border-color: #4a90e2;
}

.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;
}
</style>