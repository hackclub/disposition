<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import type { Item } from '~/types/database';
import * as z from "zod";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

const { data: item } = await useFetch<Item>(`/api/shop/items/${props.id}`);
const { defineField, errors, handleSubmit, setFieldValue, isSubmitting } = useForm({
    validationSchema: toTypedSchema(z.object({
        image: z.instanceof(File, { message: "Please choose an image" }).optional(),
        artist: z.string().trim().min(1, "Artist is required").optional(),
        album: z.string().trim().min(1, "Album is required").optional(),
        genre: z.string().trim().min(1, "Genre is required").optional(),
        media: z.enum(["cd", "vinyl", "cassette", "other"]).optional(),
        price: z.number({ error: "Price is required" }).min(1, "Price must be at least 1").optional(),
        description: z.string().optional(),
        staffPick: z.boolean().optional(),
        urls: z.array(z.url({ error: "Invalid URL" }).or(z.literal(""))).optional(),
    })),
    initialValues: {
        image: undefined,
        artist: item.value?.artist,
        album: item.value?.album,
        genre: item.value?.genre,
        media: item.value?.media,
        price: item.value?.price,
        description: item.value?.description,
        staffPick: item.value?.staffPickAt ? true : false,
        urls: item.value?.urls,
    },
});

const [artist] = defineField("artist");
const [album] = defineField("album");
const [genre] = defineField("genre");
const [media] = defineField("media");
const [price] = defineField("price");
const [description] = defineField("description");
const [staffPick] = defineField("staffPick");
const [urls] = defineField("urls");

const hasChanges = computed(() => {
    const current = item.value;
    if (!current) return false;

    if (previewUrl.value.startsWith("blob:")) return true; // new image picked

    const cleaned = (urls.value ?? []).map(u => u.trim()).filter(Boolean);
    const original = (current.urls ?? []).map(u => u.trim()).filter(Boolean);

    return (
        artist.value !== current.artist ||
        album.value !== current.album ||
        genre.value !== current.genre ||
        media.value !== current.media ||
        price.value !== current.price ||
        description.value !== current.description ||
        staffPick.value !== (current.staffPickAt != null) ||
        JSON.stringify(cleaned) !== JSON.stringify(original)
    );
});

// drag and drop bullshit
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const previewUrl = ref<string>(`/images/${item.value?.image}`);

// genre dropdown bullshit
const genres = ref<string[]>([]);
if (admin) genres.value = await $fetch<string[]>("/api/shop/genres");

function setImage(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;

    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
    setFieldValue("image", file); // validates against the schema
}

function onDrop(e: DragEvent) {
    isDragging.value = false;
    setImage(e.dataTransfer?.files?.[0]);
}

function addUrl() {
    urls.value = [...(urls.value ?? []), ""];
}

function removeUrl(i: number) {
    urls.value = (urls.value ?? []).filter((_, idx) => idx !== i);
}

onBeforeUnmount(() => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

// only runs if validation passes
const onSubmit = handleSubmit(async (values) => {
    if (!admin) return;

    const body = new FormData();
    const current = item.value!;

    if (values.image) body.append("image", values.image);
    if (values.artist !== undefined && values.artist !== current.artist) body.append("artist", values.artist);
    if (values.album !== undefined && values.album !== current.album) body.append("album", values.album);
    if (values.genre !== undefined && values.genre !== current.genre) body.append("genre", values.genre);
    if (values.media !== undefined && values.media !== current.media) body.append("media", values.media);
    if (values.price !== undefined && values.price !== current.price) body.append("price", String(values.price));
    if (values.description !== undefined && values.description !== current.description) body.append("description", values.description);
    if (values.staffPick !== undefined && values.staffPick !== (current.staffPickAt != null)) body.append("staffPick", String(values.staffPick));

    if (values.urls) {
        const cleaned = values.urls.map(u => u.trim()).filter(Boolean);
        const original = (current.urls ?? []).map(u => u.trim()).filter(Boolean);
        if (JSON.stringify(cleaned) !== JSON.stringify(original)) {
            // send a marker so the server can tell "cleared all URLs" apart from "URLs unchanged"
            body.append("urlsChanged", "true");
            cleaned.forEach(u => body.append("urls", u));
        }
    }
    try {
        const response = await $fetch(`/api/shop/items/${props.id}`, { method: "PATCH", body });
        manager.messageBox("Success!", `Item id ${response.id} edited successfully!`, { info: true });
        manager.close(props.instance.id);
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Edit failed", { error: true });
    }
});
</script>

<template>
    <form class="content" v-if="admin" @submit.prevent="onSubmit">
        <div class="horizontal">
            <div class="vertical">
                <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" v-show="false"
                    @change="(e) => setImage((e.target as HTMLInputElement).files?.[0])" />

                <img class="drag-and-drop" :class="{ dragging: isDragging }" :src="previewUrl" alt="Item image"
                    @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
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
                    <button type="submit" :disabled="isSubmitting || !hasChanges">Upload</button>
                </div>
            </div>
        </div>
    </form>
    <div v-else style="text-align: center;">
        <p>sorry, not admin :(</p>
    </div>
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