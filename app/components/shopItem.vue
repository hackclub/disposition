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
    border: 2px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    padding: 5px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 2px;

    .cover {
        width: 100px;
        height: 100px;
    }

    .album {
        margin: 0;
        font-weight: bold;
    }

    .artist {
        margin: 0;
    }

    .price {
        margin: 0;
        text-align: right;
        width: 100%;
    }

    &:hover {
        cursor: pointer;
    }
}
</style>