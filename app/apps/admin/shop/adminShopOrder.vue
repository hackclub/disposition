<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { ServerOrder, Item, User, OrderStatus, Address } from "~/types/database";
const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

const order = ref<ServerOrder>();
if (admin) order.value = await $fetch<ServerOrder>(`/api/shop/orders/${props.id}`);

// form bullshit
const form = reactive({
    status: order.value?.status as OrderStatus,
    adminMessage: order.value?.adminMessage,
    tracking: order.value?.tracking
})
const submitting = ref(false);

async function save() {
    if (!admin) return;

    const data = new FormData();
    data.append("status", form.status);
    if (form.adminMessage) data.append("adminMessage", form.adminMessage);
    if (form.tracking) data.append("tracking", form.tracking);

    const response = await $fetch(`/api/shop/orders/${props.id}`, {
        method: "PATCH",
        body: data
    })

    if (response.id) manager.close(props.instance.id);
}
</script>

<template>
    <div class="content" v-if="admin && order">
        <div class="horizontal">
            <div class="vertical">
                <img class="image" :src="`/images/${order.item.image}`" alt="Item image" />
            </div>
            <div class="vertical fields">
                <label>Artist:</label>
                <p>{{ order.item.artist }}</p>

                <label>Album:</label>
                <p>{{ order.item.album }}</p>

                <label>Genre:</label>
                <p>{{ order.item.genre }}</p>

                <label>Media:</label>
                <p>{{ order.item.media }}</p>

                <label>Price:</label>
                <p>{{ order.item.price }}</p>

                <button @click="manager.open('profile', { id: order.user.hcaId })">Open User Profile</button>

                <label>Shipping address:</label>
                <p>{{ order.address.line1 }}, {{ order.address.line2 ? order.address.line2 + "," : "" }} {{
                    order.address.city }}, {{ order.address.state }}, {{ order.address.country }}, {{
                        order.address.postalCode }}</p>
            </div>
        </div>
        <div class="vertical">
            <label for="status">Status</label>
            <select name="status" v-model="form.status">
                <option value="idle">Idle</option>
                <option value="claimed">Claimed</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
            </select>

            <label v-if="order.message">User message</label>
            <p v-if="order.message">{{ order.message }}</p>

            <label for="adminMessage">Admin notes</label>
            <textarea v-model="form.adminMessage"></textarea>

            <label for="tracking">Tracking</label>
            <input type="text" v-model="form.tracking" />

            <div class="horizontal">
                <div class="vertical">
                    <label>Item URLs</label>
                    <template v-for="url in order.item.urls">
                        <a :href="url">{{ url }}</a>
                    </template>
                </div>

                <div class="upload-div">
                    <button :disabled="submitting" @click="save">Save</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else style="text-align: center;">
        <p>sorry, not admin :(</p>
    </div>
</template>

<style scoped>
.image {
    width: 200px;
    height: 200px;
}

.upload-div {
    display: flex;
    justify-content: end;
    align-items: end;
    width: 100%;
}

.description {
    min-height: 100px;
    max-height: 100px;

    width: 100%;
    min-width: 100%;
    max-width: 100%;
}

.fields {
    width: 100%;
    gap: 6px !important;
    /* best css oat */
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

    label {
        margin: 0;
        font-weight: bold;
    }

    p {
        margin: 0;
    }
}

.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;
}
</style>