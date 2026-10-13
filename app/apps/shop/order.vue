<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { Order, Item, User, OrderStatus, Media } from "~/types/database";
const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()

const { data: order } = await useFetch<Order>(`/api/shop/orders/${props.id}`);
const { data: item } = await useFetch<Item>(`/api/shop/items/${order.value!.item}`);

// form bullshit
const form = reactive({
    message: order.value!.message
})
const submitting = ref(false);

async function save() {
    const data = new FormData();
    if (form.message) data.append("message", form.message);

    const response = await $fetch(`/api/shop/orders/${props.id}`, {
        method: "PATCH",
        body: data
    })

    if (response.id) manager.close(props.instance.id);
}
</script>

<template>
    <div class="content" v-if="order && item">
        <div class="horizontal">
            <div class="vertical">
                <img class="image" :src="`/images/${item!.image}`" alt="Item image" />
            </div>
            <div class="vertical fields">
                <p><b>Price: </b>{{ item.price }}</p>
                <p><b>Shipping address: </b>todo</p>
                <p><b>Ordered on: </b>{{ new Date(order.timestamp).getDate() }}/{{ new Date(order.timestamp).getMonth()
                    }}/{{ new Date(order.timestamp).getFullYear() }}</p>
                <p v-if="order.tracking"><b>Tracking: </b>{{ order.tracking }}</p>
                <p><b>Status: </b>{{ order.status }}</p>

                <button @click="manager.open('item', { id: order.item })">View item in shop</button>
            </div>
        </div>
        <div class="vertical">
            <label>Message to fulfillers</label>
            <textarea v-model="form.message"></textarea>

            <div class="horizontal">
                <div class="upload-div">
                    <button :disabled="submitting" @click="save">Save</button>
                </div>
            </div>
        </div>
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

.drag-and-drop {
    width: 250px;
    height: 250px;
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