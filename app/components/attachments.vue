<script setup lang="ts">
const props = defineProps<{ attachments: string[] }>();

const images = computed(() => props.attachments.filter(a => /\.(png|jpe?g|gif|webp|avif)$/i.test(a)));
</script>

<template>
    <div v-if="images.length" class="attachments">
        <a v-for="image in images" :key="image" :href="`/images/${image}`" target="_blank" rel="noopener">
            <img class="photo" :src="`/images/${image}`" alt="">
        </a>
    </div>
</template>

<style scoped>
.attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.photo {
    display: block;
    width: 148px;
    height: 129px;
    object-fit: cover;
    background: var(--color-panel-bg);
}
</style>
