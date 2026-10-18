<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import * as z from "zod";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()

const { defineField, errors, handleSubmit, setFieldValue, isSubmitting } = useForm({
    validationSchema: toTypedSchema(z.object({
        artist: z.string().nullish().optional(),
        album: z.string().trim().min(1, "Album is required"),
        media: z.enum(["cd", "vinyl", "cassette", "other"]),
        message: z.string().optional(),
    })),
    initialValues: {
        media: "cd"
    },
});

const [artist] = defineField("artist");
const [album] = defineField("album");
const [media] = defineField("media");
const [message] = defineField("message");

const canSubmit = computed(() => {
    if (!album.value?.trim()) return false;
    if (media.value != "other") if (!artist.value?.trim()) return false;
    return true;
});

// only runs if validation passes
const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    if (values.artist) body.append("artist", values.artist);
    body.append("album", values.album);
    body.append("media", values.media);
    if(values.message) body.append("message", values.message);

    try {
        const response = await $fetch("/api/shop/requests", { method: "POST", body });
        manager.messageBox("Success!", `Request id ${response.id} submitted successfully!`, { info: true });
        manager.close(props.instance.id);
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Request upload failed", { error: true });
    }
});
</script>

<template>
    <form class="content" @submit.prevent="onSubmit">
        <div class="vertical fields">
            <template v-if="media != 'other'">
                <label for="artist">Artist</label>
                <input type="text" id="artist" v-model="artist" placeholder="Artist" />
                <span class="error" v-if="errors.artist">{{ errors.artist }}</span>
            </template>

            <template v-if="media == 'other'">
                <label for="album">Item name</label>
                <input type="text" id="album" v-model="album" placeholder="Item name" />
                <span class="error" v-if="errors.album">{{ errors.album }}</span>
            </template>
            <template v-else>
                <label for="album">Album</label>
                <input type="text" id="album" v-model="album" placeholder="Album" />
                <span class="error" v-if="errors.album">{{ errors.album }}</span>
            </template>

            <label for="media">Media</label>
            <select name="media" id="media" v-model="media">
                <option value="cd">CD</option>@
                <option value="vinyl">Vinyl</option>
                <option value="cassette">Cassette</option>
                <option value="other">Other</option>
            </select>

            <label for="message">Message</label>
            <textarea id="message" class="message" v-model="message"
                placeholder="Any extra info (e.g. URLs)"></textarea>

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