<script setup lang="ts">
import type { Item } from '~/types/database';

const manager = useWindowManager();
const props = defineProps<{ item: Item }>()
</script>

<template>
    <div class="item" @click="manager.open('item', { id: item.id })" :key="item.id">
        <img class="cover" :src="`/images/${item.image}`" :alt="`${item.artist} - ${item.album}`" />
        <p class="album" v-if="item.media == 'other'">{{ item.album }}</p>
        <p class="album" v-else>{{ item.album }} ({{ item.media }})</p>
        <p class="artist" v-if="item.media != 'other'">{{ item.artist }}</p>
        <p class="price">{{ item.price }} C</p>
    </div>
</template>

<style scoped>
.item {
    width: 132px;
    min-height: 172px;
    border: 2px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    padding: 5px;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    box-shadow: inset 0 0 0 1px var(--color-white);

    .cover {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border: 1px solid var(--color-border-dark);
        box-shadow: 1px 1px 0 var(--color-white);
    }

    .album {
        margin: 0;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .artist {
        margin: 0;
        color: var(--color-gray-dark);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .price {
        margin: 0;
        align-self: flex-end;
        padding: 1px 4px;
        border: 1px solid var(--color-border-dark);
        background-color: var(--color-white);
        font-weight: bold;
    }
}
</style>