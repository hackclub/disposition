<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import type { WindowInstance } from '~/types/window';
import type { Notification } from '~/types/notification';
import * as z from "zod";
import { Markdown } from '@comark/vue';

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

const { data: current } = await useFetch<Notification>(`/api/announcements/${props.id}`);
</script>

<template>
    <div class="content" v-if="admin && current">
        <span>
            <h2><b>{{ current.title }}</b> ({{ formatTimestamp(current.timestamp) }})</h2>
            <p>From <a @click="manager.open('profile', { id: current.author!.id })">@{{ current.author!.username }}</a>
            </p>
        </span>

        <Markdown>{{ current.description }}</Markdown>
    </div>
    <div v-else-if="admin" class="content">
        <span class="error">Announcement {{ props.id }} wasn't found.</span>
    </div>
    <div v-else>Sorry, not admin :(</div>

</template>

<style scoped>
.description {
    height: 100%;
    flex-grow: 1;

    width: 100%;
    min-width: 100%;
    max-width: 100%;
}

.content {
    padding: 10px;
    gap: 10px;

    span {
        display: flex;
        flex-direction: column;
        gap: 6px;

        p {
            margin: 0;
        }
    }

    display: flex;
    flex-direction: column;
}

.error {
    color: var(--color-accent-red, #c33);
    font-size: 0.85em;
}
</style>