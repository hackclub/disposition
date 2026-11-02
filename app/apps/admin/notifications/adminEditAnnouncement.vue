<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import type { WindowInstance } from '~/types/window';
import type { Notification } from '~/types/notification';
import * as z from "zod";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

const { data: current } = await useFetch<Notification>(`/api/announcements/${props.id}`);

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(z.object({
        title: z.string().trim().min(1, "Title is required"),
        description: z.string().trim().min(1, "Description is required")
    })),
    initialValues: {
        title: current.value?.title ?? "",
        description: current.value?.description ?? ""
    }
});

const [title] = defineField("title");
const [description] = defineField("description");

const canSubmit = computed(() => !!current.value && !!title.value && !!description.value);

const onSubmit = handleSubmit(async (values) => {
    if (!admin || !current.value) return;

    const body = new FormData();
    body.append("title", values.title);
    body.append("description", values.description);

    try {
        await $fetch(`/api/announcements/${props.id}`, { method: "PATCH", body: body });
        manager.messageBox("Success!", `Announcement ${props.id} has been updated!`);
        manager.close(props.instance.id);
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Update failed", { error: true });
    }
});
</script>

<template>
<form class="content" v-if="admin && current" @submit.prevent="onSubmit">
    <label for="title">Title</label>
    <input type="text" id="title" v-model="title" placeholder="Title" />
    <span class="error" v-if="errors.title">{{ errors.title }}</span>

    <label for="description">Description</label>
    <textarea id="description" class="description" v-model="description" placeholder="Description"></textarea>
    <span class="error" v-if="errors.description">{{ errors.description }}</span>

    <button type="submit" :disabled="isSubmitting || !canSubmit">Save changes</button>
</form>
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
    gap: 6px;

    display: flex;
    flex-direction: column;
}

.error {
    color: var(--color-accent-red, #c33);
    font-size: 0.85em;
}
</style>