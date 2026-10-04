<script setup lang="ts">
import type { WindowInstance } from '~/types/window';

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const imageFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const urls = ref<string[]>([""]);
type Media = "cd" | "vinyl" | "cassette" | "other";

const manager = useWindowManager();
const form = reactive({
    artist: "",
    album: "",
    genre: "",
    media: "cd" as Media,
    price: "",
    description: "",
    staffPick: false,
})
const submitting = ref(false);
const error = ref<string | null>(null);
const props = withDefaults(defineProps<{
    instance: WindowInstance
}>(), {
})

// hi dear reviewers. i know, you might be seeing this very out of place svg and wondering: 
// did ai write this? yes. it did. sorry. it looks nice. it's only like one file out of 2 bagillion. please forgive this cardinal sin.
const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">` +
        `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ` +
        `font-family="sans-serif" font-size="16" fill="#888">Drag and drop your image in here</text></svg>`
    );

function pickFile() {
    fileInput.value?.click();
}

function setImage(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;

    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
}

function onFileChange(e: Event) {
    setImage((e.target as HTMLInputElement).files?.[0]);
}

function onDrop(e: DragEvent) {
    isDragging.value = false;
    setImage(e.dataTransfer?.files?.[0]);
}

onBeforeUnmount(() => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

async function upload() {
    if (!imageFile.value) {
        error.value = "Please choose an image";
        return;
    }

    const body = new FormData();
    body.append("image", imageFile.value);
    for (const [key, value] of Object.entries(form)) {
        body.append(key, String(value));
    }
    urls.value
        .map(u => u.trim())
        .filter(Boolean)
        .forEach(u => body.append("urls", u));

    submitting.value = true;
    error.value = null;
    try {
        await $fetch("/api/shop/items", { method: "POST", body });
        manager.close(props.instance.id);
    } catch (e: any) {
        error.value = e.data?.message ?? "Upload failed";
        alert(error);
    } finally {
        submitting.value = false;
    }
}

function addURLField() {
    urls.value.push("");
}

function removeURLField(i: number) {
    urls.value.splice(i, 1);
}
</script>

<template>
    <div class="content">
        <div class="horizontal">
            <div class="vertical">
                <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" style="display: none" @change="onFileChange" />

                <img class="drag-and-drop" :class="{ dragging: isDragging }" :src="previewUrl ?? placeholder"
                    alt="Item image" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                    @drop.prevent="onDrop" />
                <button @click="pickFile">Upload from files</button>
            </div>
            <div class="vertical fields">
                <label for="artist">Artist</label>
                <input type="text" id="artist" v-model="form.artist" placeholder="Artist" />

                <label for="album">Album</label>
                <input type="text" id="album" v-model="form.album" placeholder="Album" />

                <label for="genre">Genre</label>
                <input type="text" id="genre" v-model="form.genre" placeholder="Genre" />

                <label for="media">Media</label>
                <select name="media" id="media" v-model="form.media">
                    <option value="cd">CD</option>
                    <option value="vinyl">Vinyl</option>
                    <option value="cassette">Cassette</option>
                    <option value="other">Other</option>
                </select>

                <label for="price">Price</label>
                <input type="number" min="1" id="price" v-model="form.price" placeholder="Price" />

                <label for="staffPick" class="checkbox">
                    <input type="checkbox" name="staffPick" v-model="form.staffPick" />
                    Staff pick
                </label>
            </div>
        </div>
        <div class="vertical">
            <label for="description">Description</label>
            <textarea id="description" class="description" v-model="form.description"
                placeholder="Description"></textarea>

            <div class="horizontal">
                <div class="vertical">
                    <label>URLs</label>
                    <div v-for="(_, i) in urls" :key="i" class="horizontal">
                        <input v-model="urls[i]" type="url" />
                        <button v-if="i === urls.length - 1" @click="addURLField">+</button>
                        <button v-else @click="removeURLField(i)">-</button>
                    </div>

                </div>

                <div class="upload-div">
                    <button :disabled="submitting" @click="upload">Upload</button>
                </div>
            </div>
        </div>
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
    object-fit: contain;
    border: 2px dashed #888;
    box-sizing: border-box;
}

.drag-and-drop.dragging {
    border-color: #4a90e2;
}

.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;
}
</style>