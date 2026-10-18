<script lang="ts" setup>
import type { Item } from '~/types/database';

const manager = useWindowManager();
const { data } = await useFetch<Record<string, Item[]>>("/api/shop/items/shelves");
</script>

<template>
    
</template>