<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import * as z from "zod";

// TODO: make it so you can only send feedback once

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()

const { defineField, errors, handleSubmit, setFieldValue, isSubmitting } = useForm({
    validationSchema: toTypedSchema(z.object({
        recommend: z.number().min(1).max(10),
        well: z.string(),
        improve: z.string(),
        other: z.string().optional(),
    })),
    initialValues: {
        recommend: 5
    },
});

const [recommend] = defineField("recommend");
const [well] = defineField("well");
const [improve] = defineField("improve");
const [other] = defineField("other");

const canSubmit = computed(() => {
    if (!well.value?.trim()) return false;
    if (!improve.value?.trim()) return false;
    return true;
});

// only runs if validation passes
const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("recommend", String(values.recommend));
    body.append("well", values.well);
    body.append("improve", values.improve);
    if (values.other) body.append("other", values.other);

    try {
        const response = await $fetch("/api/feedback", { method: "POST", body });
        manager.messageBox("Success!", `Feedback sent successfully!`, { info: true });
        manager.close(props.instance.id);
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Request upload failed", { error: true });
    }
});
</script>

<template>
    <form class="content" @submit.prevent="onSubmit">
        <div class="vertical fields">
            <label for="recommend">How likely are you to recommend Disposition to a friend?</label>
            <input type="range" min="1" max="10" name="recommend" step="1" v-model="recommend" />

            <label for="well">What are we doing well?</label>
            <textarea class="message" v-model="well"></textarea>

            <label for="improve">What can we improve on?</label>
            <textarea class="message" v-model="improve"></textarea>

            <label for="other">Anything else you want to let us know?</label>
            <textarea class="message" v-model="other"></textarea>

            <button type="submit" :disabled="isSubmitting || !canSubmit">Submit</button>
        </div>
    </form>
</template>

<style scoped>
.message {
    min-height: 100px;
    max-height: 100px;

    width: 100%;
    min-width: 100%;
    max-width: 100%;

    resize: none;
}

.fields {
    width: 100%;
    gap: 6px !important;
    /* best css oat */
}

.horizontal {
    display: flex;
    flex-direction: row;
    gap: 3px;
}

.vertical {
    display: flex;
    flex-direction: column;

    gap: 3px;
}

.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;
}

.error {
    color: var(--color-accent-red, #c33);
    font-size: 0.85em;
}
</style>