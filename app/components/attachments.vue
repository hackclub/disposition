<script setup lang="ts">
const props = defineProps<{ attachments: string[] }>();

// blob: urls are local previews (e.g. the new devlog preview) and are already images
const isLocal = (a: string) => a.startsWith('blob:');
const images = computed(() => props.attachments
    .filter(a => isLocal(a) || /\.(png|jpe?g|gif|webp|avif)$/i.test(a))
    .map(a => isLocal(a) ? a : `/images/${a}`));
</script>

<template>
    <div v-if="images.length" class="attachments">
        <a v-for="image in images" :key="image" :href="image" target="_blank" rel="noopener">
            <img class="photo" :src="image" alt="">
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
