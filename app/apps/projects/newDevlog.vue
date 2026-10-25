<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onErrorCaptured } from 'vue'
import { Markdown } from '@comark/vue'
import type { WindowInstance } from '~/types/window'
import headerbg from '~/assets/misc/header.png'
import rigby from '~/assets/misc/rigby.jpg'
import badge from '~/assets/icons/badge.png'
import heart from '~/assets/icons/heart.png'
import comment from '~/assets/icons/comment.png'

const props = defineProps<{
    instance: WindowInstance
}>()

const manager = useWindowManager()

const EDIT_SIZE = { width: 570, height: 490 }
const PREVIEW_SIZE = { width: 570, height: 700 }

const projectTitle = 'Restoring Rigby\u2019s faith from the evil'
const author = 'Username'
const hoursLogged = '28h Logged'
const devlogNumber = 13

const text = ref('')
const photoFile = ref<File | null>(null)
const photoUrl = ref('')
const previewing = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const comarkFailed = ref(false)

const fallbackParagraphs = computed(() =>
    text.value
        .split(/\n+/)
        .map(p => p.trim())
        .filter(Boolean)
)

onErrorCaptured((err) => {
    console.error('[New Devlog] Comark failed to render:', err)
    comarkFailed.value = true
    return false
})

function pickPhoto() {
    fileInput.value?.click()
}

function onPhoto(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
    photoFile.value = file
    photoUrl.value = URL.createObjectURL(file)
}

function togglePreview() {
    previewing.value = !previewing.value
    manager.resize(
        props.instance.id,
        previewing.value ? PREVIEW_SIZE : EDIT_SIZE
    )
}

onBeforeUnmount(() => {
    if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
})

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'save', payload: { text: string; photo: File | null }): void
}>()

function save() {
    emit('save', { text: text.value, photo: photoFile.value })
}
</script>
<template>
    <div class="content">
        <div class="header">
            <div class="header-bg">
                <img :src="headerbg" alt="">

                <div class="project-card">
                    <img class="thumb" :src="rigby" alt="">
                    <div class="project-info">
                        <h2>{{ projectTitle }}</h2>
                        <div class="meta">
                            <span>Made by {{ author }}</span>
                            <span>{{ hoursLogged }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="spacer"></div>

        <div class="main">
            <h2 class="heading">New Devlog</h2>

            <div v-if="!previewing" key="edit" class="panel">
                <textarea
                    v-model="text"
                    class="field"
                    placeholder="Write what you added in this devlog... (markdown works)"
                ></textarea>

                <input ref="fileInput" type="file" accept="image/*" hidden @change="onPhoto">
                <button type="button" class="photo-drop" @click="pickPhoto">
                    <img v-if="photoUrl" class="drop-thumb" :src="photoUrl" alt="">
                    <span>{{ photoFile ? photoFile.name : 'Add a photo to your devlog' }}</span>
                </button>
            </div>

            <div v-else key="preview" class="devlog-card">
                <span class="project">{{ projectTitle }}</span>

                <div class="title-row">
                    <h2 class="devlog-title">Devlog {{ devlogNumber }}</h2>
                    <span class="author">By {{ author }}</span>
                    <span class="posted">&bull; posted just now</span>
                </div>

                <div class="devlog-content">
                    <p v-if="!text.trim()" class="empty">Nothing written yet.</p>

                    <template v-else-if="comarkFailed">
                        <p v-for="(p, i) in fallbackParagraphs" :key="i" class="plain">{{ p }}</p>
                    </template>

                    <Suspense v-else>
                        <Markdown class="devlog-text" :value="text" />
                        <template #fallback>
                            <p class="empty">Rendering...</p>
                        </template>
                    </Suspense>

                    <button type="button" class="see-more">See more...</button>
                    <img v-if="photoUrl" class="devlog-photo" :src="photoUrl" alt="">
                </div>

                <div class="card-footer">
                    <button type="button" class="card-open" disabled>Open</button>

                    <span class="stat">
                        <img class="icon" :src="heart" alt="">
                        0
                    </span>

                    <span class="stat">
                        <img class="icon" :src="comment" alt="">
                        0
                    </span>

                    <span class="logged">
                        {{ hoursLogged }}
                        <img class="icon" :src="badge" alt="">
                    </span>
                </div>
            </div>
        </div>

        <div class="actions">
            <button type="button" class="action-btn preview-btn" @click="togglePreview">
                {{ previewing ? 'Back to editing' : 'Preview' }}
            </button>

            <div class="right">
                <button type="button" class="action-btn" @click="emit('cancel')">Cancel</button>
                <button type="button" class="action-btn" @click="save">Save</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 14px;
    user-select: none;
}

.header {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    font-family: 'Joan', serif;
}

.header-bg {
    position: relative;
    width: 100%;
    height: 110px;
    overflow: hidden;

    > img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        display: block;
    }
}

.project-card {
    position: absolute;
    top: 8px;
    left: 14px;
    width: 330px;
    max-width: calc(100% - 28px);
    height: 90px;
    box-sizing: border-box;
    display: flex;
    gap: 12px;
    padding: 6px;
    background: var(--color-panel-bg);
    border: 1px solid var(--color-gray-medium);

    .thumb {
        flex-shrink: 0;
        width: 70px;
        height: 76px;
        object-fit: cover;
        border: 1px solid var(--color-gray-dark);
        background: var(--color-gray-medium);
    }

    .project-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        min-width: 0;

        h2 {
            margin: 0;
            text-align: center;
            font-size: 20px;
            font-weight: 500;
            font-family: 'Joan', serif;
            line-height: 1.1;
        }

        .meta {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 14px;
            white-space: nowrap;
        }
    }
}

.spacer {
    flex-shrink: 0;
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}

.main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 6px 13px 8px;
}

.heading {
    flex-shrink: 0;
    margin: 0 0 6px;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    font-family: inherit;
}

.panel {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 8px;
    box-sizing: border-box;
    padding: 12px 10px;
    background: var(--color-bg-light);
    border: 1px solid var(--color-gray-light);
}

.field {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 72px;
    margin: 0;
    padding: 6px 8px;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.3;
    color: var(--color-gray-900);
    background: var(--color-white);
    border: 1px solid var(--color-gray-dark);
    border-radius: 0;
    outline: none;
    resize: none;
}

.field::placeholder {
    color: var(--color-gray-muted);
}

.field:focus {
    border-color: var(--color-gray-800);
}

.panel button.photo-drop {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-sizing: border-box;
    width: 100%;
    height: 42px;
    padding: 0 8px;
    font-family: inherit;
    font-size: 14px;
    background: var(--color-bg-dark);
    background-image: none;
    border: 1px solid var(--color-gray-dark);
    border-radius: 0 !important;
    box-shadow: none;
    cursor: pointer;

    .drop-thumb {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 0;
    }
}

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    padding: 8px 14px 12px;

    .right {
        display: flex;
        gap: 14px;
    }
}

.action-btn {
    width: 94px;
}

.preview-btn {
    width: 96px;
}

.devlog-card {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 6px 6px 8px;
    background: var(--color-bg-light);
    border: 1px solid var(--color-gray-light);
}

.project {
    margin-left: 2px;
    font-size: 14px;
    color: var(--color-gray-medium);
}

.title-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 0 2px 4px;
}

.devlog-title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    font-family: inherit;
}

.author {
    font-size: 16px;
}

.posted {
    font-size: 14px;
}

.devlog-content {
    box-sizing: border-box;
    padding: 6px 7px 10px;
    background: var(--color-white);
    border: 1px solid var(--color-border-dark);

    .empty,
    .plain {
        margin: 0 0 12px;
        font-size: 13px;
        line-height: 1.3;
    }

    .empty {
        color: var(--color-gray-muted);
    }

    .see-more {
        display: block;
        margin: 0 0 4px;
        padding: 0;
        font-family: inherit;
        font-size: 15px;
        font-weight: 700;
        text-align: left;
        color: inherit;
        background: none;
        border: none;
        cursor: pointer;
    }

    .devlog-photo {
        display: block;
        width: 148px;
        height: 129px;
        object-fit: cover;
        background: var(--color-panel-bg);
    }
}

.devlog-content :deep(.devlog-text) {
    font-size: 13px;
    line-height: 1.3;
    overflow-wrap: anywhere;
}

.devlog-content :deep(.devlog-text p) {
    margin: 0 0 12px;
}

.devlog-content :deep(.devlog-text h1),
.devlog-content :deep(.devlog-text h2),
.devlog-content :deep(.devlog-text h3) {
    margin: 0 0 8px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 700;
}

.devlog-content :deep(.devlog-text ul),
.devlog-content :deep(.devlog-text ol) {
    margin: 0 0 12px;
    padding-left: 20px;
}

.devlog-content :deep(.devlog-text a) {
    color: #1a1aff;
}

.devlog-content :deep(.devlog-text img) {
    max-width: 100%;
}

.devlog-content :deep(.devlog-text code) {
    padding: 0 3px;
    background: var(--color-panel-bg);
}

.card-footer {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 10px;
    padding: 0 2px;
}

.card-open {
    width: 126px;
}

.stat {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 14px;
}

.logged {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-size: 14px;
    white-space: nowrap;
}

.icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
    flex-shrink: 0;
}
</style>