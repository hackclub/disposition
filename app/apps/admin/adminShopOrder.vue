<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type {Order, Item, User, OrderStatus, Media} from "~/types/database";
const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

// maybe i should make the server endpoint return all three but oh well
const user = ref<User>();
const item = ref<Item>();
const order = ref<Order>();

if (admin) {
    order.value = await $fetch<Order>(`/api/shop/orders/${props.id}`);
    item.value = await $fetch<Item>(`/api/shop/items/${order.value.item}`);
    user.value = await $fetch<User>(`/api/user/${order.value.user}`);
}

// form bullshit
const form = reactive({
    status: order.value?.status as OrderStatus,
    adminMessage: order.value?.adminMessage
})
const submitting = ref(false);
const error = ref<string | null>(null);

function save() {

}
</script>

<template>
    <div class="content" v-if="admin && order && item && user">
        <div class="horizontal">
            <div class="vertical">
                <img class="image" :src="`/images/${item!.image}`" alt="Item image" />
            </div>
            <div class="vertical fields">
                <label>Artist</label>
                <p>{{ item.artist }}</p>

                <label>Album</label>
                <p>{{ item.album }}</p>

                <label>Genre</label>
                <p>{{ item.genre }}</p>

                <label>Media</label>
                <p>{{ item.media }}</p>

                <label>Price</label>
                <p>{{ item.price }}</p>
            </div>
        </div>
        <div class="vertical">
            <label>User message</label>
            <p>{{ order.message }}</p>

            <label for="adminMessage">Admin notes</label>
            <textarea v-model="form.adminMessage"></textarea>

            <div class="horizontal">
                <label for="status">Status</label>
                <select name="status" v-model="form.status">
                    <option value="idle">Idle</option>
                    <option value="claimed">Claimed</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <div class="vertical">
                    <label>URLs</label>
                    <template v-for="url in item.urls">
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