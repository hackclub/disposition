<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { ServerItem } from '~/types/database';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();

const { data: balance } = await useFetch<number>("/api/user/balance", { key: "balance" });
const { data: item } = await useFetch<ServerItem>(`/api/shop/items/${props.id}`);

console.log(await $fetch(`/api/shop/items/${props.id}`))

async function callback(result: boolean) {
    if (!result) return;
    const data = new FormData();
    data.append("item", String(props.id));
    data.append("message", "");

    const response = await $fetch(`/api/shop/orders`, {
        method: "POST", body: data
    });
    if (!response) {
        await manager.messageBox("Error!", `There was an error placing your order,\nplease check the browser console and report this to #disposition-help!`, { error: true });
        return;
    }

    await manager.messageBox("Success!", `Order ID ${response.id} placed successfully! You can check it's status in the future from the "my orders" buttons in the shop!`, { info: true });
    refreshNuxtData("balance");
}
</script>

<template>
    <AuthState v-slot="{ loggedIn }">
        <div class="content" v-if="item && balance">
            <div class="horizontal">
                <div class="vertical">
                    <img class="image" :src="`/images/${item.image}`" alt="Item image" />
                </div>
                <div class="vertical fields">
                    <p>
                        <b>Price: </b>{{ item.price }}
                    </p>
                    <p>
                        <b>Genre: </b>{{ item.genre }}
                    </p>

                    <p v-if="item.tracks && item.length">
                        <b>Length: </b>{{ item.tracks }} tracks, {{ formatDuration(item.length) }}
                    </p>
                    <p v-if="item.releaseDate">
                        <b>Release date: </b>{{ item.releaseDate }}
                    </p>


                    <!-- add some concrete way of counting tags so if no tags the tags: text doesnt show up -->
                    <!-- todo: add some tags here like staff pick, trending, most bought item, etc -->
                    <b v-if="item.tags.length > 0">Tags:</b>
                    <div class="tags">
                        <p v-if="item.staffPickAt">Staff pick</p>
                    </div>
                </div>
            </div>

            <div class="horizontal2">
                <div class="vertical">
                    <h2 v-if="item.media == 'other'">{{ item.album }}</h2>
                    <h2 v-else>{{ item.album }} - {{ item.artist }} ({{ item.media }})</h2>

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

                    <button v-if="item.price > balance" disabled>You need {{ item.price - balance }} more
                        coins!</button>
                    <button v-else @click="manager.dialogBox(
                        'Confirm order',
                        `Are you sure you want to buy ${item.album} for ${item.price}C?`,
                        callback,
                        {
                            question: true
                        })">Buy {{ item.album
                        }}</button>
                </div>
            </div>
        </div>
        <div v-else class="content">
            <p>Sorry, app went boom boom trying to load this item :(</p>
        </div>
    </AuthState>
</template>

<style scoped>
.order {
    justify-content: space-evenly;
    min-width: 300px;

    background-color: var(--color-panel-bg);
    border: 2px solid var(--color-border-light);
    padding: 5px;

    h2 {
        margin: 0;
    }
}

.summary {
    padding: 10px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-white);
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
        border: 1px solid var(--color-border-light);
        background-color: var(--color-panel-bg);
    }
}

.description {
    min-height: 100px;
    max-height: 100px;

    width: 100%;
    min-width: 100%;
    max-width: 100%;
}

.horizontal2 {
    display: flex;
    flex-direction: row;
    gap: 3px;
    justify-content: space-around;
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
    /* object-fit: contain; */
    /* border: 2px dashed var(--color-gray-dark); */
    box-sizing: border-box;
}

.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;

    min-height: 0;
    max-height: 100%;
    overflow-y: auto;
}
</style>