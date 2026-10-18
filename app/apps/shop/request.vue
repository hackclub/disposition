<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import * as z from "zod";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()

const { defineField, errors, handleSubmit, setFieldValue, isSubmitting } = useForm({
    validationSchema: toTypedSchema(z.object({
        artist: z.string().trim().min(1, "Artist is required"),
        album: z.string().trim().min(1, "Album is required"),
        media: z.enum(["cd", "vinyl", "cassette", "other"]),
        message: z.string().min(1),
    })),
    initialValues: {
        media: "cd"
    },
});

const [artist] = defineField("artist");
const [album] = defineField("album");
const [media] = defineField("media");
const [message] = defineField("message");

// only runs if validation passes
const onSubmit = handleSubmit(async (values) => {
    const body = new FormData();
    body.append("artist", values.artist);
    body.append("album", values.album);
    body.append("media", values.media);
    body.append("message", values.message);

    try {
        const response = await $fetch("/api/shop/items", { method: "POST", body });
        manager.messageBox("Success!", `Item id ${response.id} uploaded successfully!`, { info: true });
        manager.close(props.instance.id);
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Upload failed", { error: true });
    }
});
</script>

<template>
    <!-- <form class="content" v-if="admin" @submit.prevent="onSubmit">
        <div class="horizontal">
            <div class="vertical">
                <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" v-show="false"
                    @change="(e) => setImage((e.target as HTMLInputElement).files?.[0])" />

                <img class="drag-and-drop" :class="{ dragging: isDragging }" :src="previewUrl ?? placeholder"
                    alt="Item image" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                    @drop.prevent="onDrop" />
                <button type="button" @click="fileInput?.click()">Upload from files</button>
                <span class="error" v-if="errors.image">{{ errors.image }}</span>
            </div>
            <div class="vertical fields">
                <label for="artist">Artist</label>
                <input type="text" id="artist" v-model="artist" placeholder="Artist" />
                <span class="error" v-if="errors.artist">{{ errors.artist }}</span>

                <label for="album">Album</label>
                <input type="text" id="album" v-model="album" placeholder="Album" />
                <span class="error" v-if="errors.album">{{ errors.album }}</span>

                <label for="genre">Genre</label>
                <input type="text" id="genre" v-model="genre" placeholder="Genre" list="genre-list" />
                <datalist id="genre-list">
                    <option v-for="g in genres" :key="g" :value="g" />
                </datalist>
                <span class="error" v-if="errors.genre">{{ errors.genre }}</span>

                <label for="media">Media</label>
                <select name="media" id="media" v-model="media">
                    <option value="cd">CD</option>
                    <option value="vinyl">Vinyl</option>
                    <option value="cassette">Cassette</option>
                    <option value="other">Other</option>
                </select>

                <label for="price">Price</label>
                <input type="number" min="1" id="price" v-model.number="price" placeholder="Price" />
                <span class="error" v-if="errors.price">{{ errors.price }}</span>

                <label for="staffPick" class="checkbox">
                    <input type="checkbox" id="staffPick" name="staffPick" v-model="staffPick" />
                    Staff pick
                </label>
            </div>
        </div>
        <div class="vertical">
            <label for="description">Description</label>
            <textarea id="description" class="description" v-model="description" placeholder="Description"></textarea>

            <div class="horizontal">
                <div class="vertical">
                    <label>URLs</label>
                    <template v-for="(_, i) in urls" :key="i">
                        <div class="horizontal">
                            <input v-model="urls![i]" type="url" />
                            <button type="button" v-if="i === urls!.length - 1" @click="addUrl">+</button>
                            <button type="button" v-else @click="removeUrl(i)">-</button>
                        </div>
                        <span class="error" v-if="errors[`urls[${i}]`]">{{ errors[`urls[${i}]`] }}</span>
                    </template>
                </div>

                <div class="upload-div">
                    <button type="submit" :disabled="isSubmitting">Upload</button>
                </div>
            </div>
        </div>
    </form>
    <div v-else style="text-align: center;">
        <p>sorry, not admin :(</p>
    </div> -->
</template>

<style scoped>
.upload-div {
    display: flex;
    justify-content: end;
    align-items: end;
    width: 100%;
}

.description {
    min-height: 100px;
    max-height: 100px;

    width: 100%;
    min-width: 100%;
    max-width: 100%;
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

.drag-and-drop {
    width: 250px;
    height: 250px;
    border: 2px dashed var(--color-gray-dark);
    box-sizing: border-box;
}

.drag-and-drop.dragging {
    border-color: blue;
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