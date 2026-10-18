<script lang="ts" setup>
import type { WindowInstance } from '~/types/window';
import type { Item } from '~/types/database';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, category: string }>();
const { data } = await useFetch<Item[]>(`/api/shop/genres/${props.category}`);
</script>

<template>
    <div class="content" v-if="data">
        <h1>{{ props.category }}</h1>
        <div class="divider"></div>

        <div class="items">
            <div v-for="item in data" class="item" @click="manager.open('item', { id: item.id })" :key="item.id">
                <img class="cover" :src="`/images/${item.image}`" :alt="`${item.artist} - ${item.album}`" />
                <p class="album" v-if="item.media == 'other'">{{ item.album }}</p>
                <p class="album" v-else>{{ item.album }} ({{ item.media }})</p>
                <p class="artist" v-if="item.media != 'other'">{{ item.artist }}</p>
                <p class="price">{{ item.price }} C</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    align-items: start;

    padding: 10px;
    h1 {
        margin: 0;
    }
}

.divider {
    width: 100%;
    height: 2px;
    background-color: var(--color-border-dark);
}

.items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;

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
    }

    .item:hover {
        cursor: pointer;
    }
}
</style>