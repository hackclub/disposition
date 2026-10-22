<script setup lang="ts">
import type { Request } from '~/types/database';

const manager = useWindowManager();
const { data: requests } = await useFetch<Request[]>("/api/shop/requests");
</script>

<template>
    <div class="content" v-if="requests">
        <button @click="manager.open('request')">Submit a request</button>
        
        <div class="request" v-for="request in requests" v-if="requests.length > 0">
            <h2 v-if="request.media == 'other'">{{ request.album }}</h2>
            <h2 v-else>{{ request.album }} - {{ request.artist }} ({{ request.media }})</h2>

            <p>{{ new Date(request.timestamp).getDate() }}/{{ new Date(request.timestamp).getMonth() }}/{{ new
                Date(request.timestamp).getFullYear() }} | {{ request.status }}</p>
        </div>
        <div v-else-if="requests.length < 1">
            <h2>No requests yet, you should make one!</h2>
        </div>
    </div>
</template>

<style scoped>
.request {
    display: flex;
    flex-direction: column;
    gap: 5px;

    padding: 5px;
    border: 2px solid var(--color-border-light);
    background-color: var(--color-panel-bg);

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