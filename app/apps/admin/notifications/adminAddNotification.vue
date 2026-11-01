<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import type { WindowInstance } from '~/types/window';
import * as z from "zod";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

// Assumes GET /api/users returns [{ id, username }]
const users = ref<{ id: string | number; username: string }[]>([]);
if (admin) {
    try {
        users.value = await $fetch("/api/users");
    } catch {
        users.value = [];
    }
}

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(z.object({
        user: z.string().min(1, "Recipient is required"),
        title: z.string().trim().min(1, "Title is required"),
        description: z.string().trim().min(1, "Description is required")
    })),
    initialValues: { user: "" }
});

const [user] = defineField("user");
const [title] = defineField("title");
const [description] = defineField("description");

const canSubmit = computed(() => {
    if (!user.value) return false;
    if (!title.value) return false;
    if (!description.value) return false;
    return true;
})

const onSubmit = handleSubmit(async (values) => {
    if (!admin) return;

    const body = new FormData();
    body.append("user", values.user);
    body.append("title", values.title);
    body.append("description", values.description);

    try {
        const response = await $fetch("/api/notifications", { method: "POST", body: body })
        manager.messageBox("Success!", `Notification id ${response.id} has been sent out!`, { info: true });
        manager.close(props.instance.id);
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Upload failed", { error: true });
    }
});
</script>

<template>
    <form class="content" v-if="admin" @submit.prevent="onSubmit">
        <label for="user">User</label>
        <select id="user" v-model="user">
            <option value="" disabled>Select a user</option>
            <option v-for="u in users" :key="u.id" :value="String(u.id)">@{{ u.username }}</option>
        </select>
        <span class="error" v-if="errors.user">{{ errors.user }}</span>

        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" placeholder="Title" />
        <span class="error" v-if="errors.title">{{ errors.title }}</span>

        <label for="description">Description</label>
        <textarea id="description" class="description" v-model="description" placeholder="Description"></textarea>
        <span class="error" v-if="errors.description">{{ errors.description }}</span>

        <button type="submit" :disabled="isSubmitting || !canSubmit">Send</button>
    </form>
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