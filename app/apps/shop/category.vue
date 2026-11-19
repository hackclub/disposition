<script lang="ts" setup>
import type { WindowInstance } from '~/types/window';
import type { Item } from '~/types/database';
import ItemCard from '~/components/cards/item.vue';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, category: string }>();
const { data } = await useFetch<Item[]>(`/api/shop/genres/${props.category}`);
</script>

<template>
    <div class="content" v-if="data">
        <h1>{{ props.category }}</h1>
        <div class="divider"></div>

        <div class="items">
            <ItemCard v-for="item in data" :item="item"></ItemCard>
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
}
</style>