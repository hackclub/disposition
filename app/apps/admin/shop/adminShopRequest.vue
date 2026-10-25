<script lang="ts" setup>
import type { WindowInstance } from '~/types/window';
import type { RequestStatus, Request } from "~/types/database";
import Item from '../shop/item.vue';
const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

const request = ref<Request>();
if (admin) request.value = await $fetch<Request>(`/api/shop/requests/${props.id}`);

// form bullshit
const form = reactive({
    status: request.value?.status as RequestStatus
})

async function save() {
    if (!admin) return;

    const data = new FormData();
    data.append("status", form.status);

    const response = await $fetch(`/api/shop/requests/${props.id}`, {
        method: "PATCH",
        body: data
    })

    if (response.id) manager.close(props.instance.id);
}
</script>

<template>
    <div class="content" v-if="admin && request">
        <div class="fields">
            <template v-if="request.media != 'other'">
                <b>Artist</b>
                <p>{{ request.artist }}</p>
            </template>

            <template v-if="request.media == 'other'">
                <b>Item Name</b>
                <p>{{ request.album }}</p>
            </template>
            <template>
                <b>Album</b>
                <p>{{ request.album }}</p>
            </template>

            <b>Media</b>
            <p>{{ request.media }}</p>

            <b>Timestamp</b>
            <p>{{ new Date(request.timestamp).getDate() }}/{{ new Date(request.timestamp).getMonth() }}/{{ new
                Date(request.timestamp).getFullYear() }}</p>

            <template v-if="request.message">
                <b>User Message</b>
                <p>{{ request.message }}</p>
            </template>
        </div>
        <div class="vertical">
            <div class="vertical">
                <button @click="manager.open('profile', { id: request.user })">Open Profile</button>

                <b>Status</b>
                <select name="status" v-model="form.status">
                    <option value="idle">Idle</option>
                    <option value="claimed">Claimed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <button @click="save">Save</button>
        </div>
    </div>
    <div v-else>
        Sorry, not admin :(
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    padding: 10px;
}

.vertical {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.fields {
    b {
        margin: 0;
    }

    p {
        margin: 0;
    }

    display: flex;
    flex-direction: column;
    gap: 5px;
}
</style>