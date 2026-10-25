<script setup lang="ts">
import { ref } from 'vue'
import { string } from 'zod'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import type { WindowInstance } from '~/types/window';
import megaphone from '~/assets/icons/megaphone.png'
import * as z from "zod";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(z.object({
        title: z.string().trim().min(1, "Title is required"),
        description: z.string().trim().min(1, "Description is required")
    }))
});

const [title] = defineField("title");
const [description] = defineField("description");

const canSubmit = computed(() => {
    if (!title.value) return false;
    if (!description.value) return false;
    return true;
})

const onSubmit = handleSubmit(async (values) => {
    if (!admin) return;

    const body = new FormData();
    body.append("title", values.title);
    body.append("description", values.description);

    try {
        const response = await $fetch("/api/announcements", { method: "POST", body: body })
        manager.messageBox("Success!", `Announcement id ${response.id} has been sent out!`);
        manager.close(props.instance.id);
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Upload failed", { error: true });
    }
});
</script>

<template>
    <form class="content" v-if="admin" @submit.prevent="onSubmit">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" placeholder="Title" />
        <span class="error" v-if="errors.title">{{ errors.title }}</span>

        <label for="description">Description</label>
        <textarea id="description" class="description" v-model="description" placeholder="Description"></textarea>
        <span class="error" v-if="errors.description">{{ errors.description }}</span>

        <button type="submit" :disabled="isSubmitting || !canSubmit">Upload</button>
    </form>
</template>

<style scoped>
.description {
    min-height: 100px;
    max-height: 100px;

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