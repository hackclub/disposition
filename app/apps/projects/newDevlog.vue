<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import type { FeedDevlog, ServerProject } from '~/types/database'
import type { WindowInstance } from '~/types/window'
import DevlogCard from '~/components/cards/devlog.vue'
import headerbg from '~/assets/misc/header.png'
import projectImage from '~/assets/misc/project.jpg'

const props = defineProps<{
    instance: WindowInstance,
    id: number
}>()

const manager = useWindowManager()
const session = useUserSession()

const EDIT_SIZE = { width: 570, height: 490 }
const PREVIEW_SIZE = { width: 570, height: 700 }

const { data: project } = await useFetch<ServerProject>(`/api/projects/${props.id}`, { key: `project-${props.id}` })

const hoursLogged = computed(() => {
    const seconds = project.value?.hackatimeSeconds ?? -1
    return seconds < 0 ? '' : `${(seconds / 3600).toFixed(1)}h Logged`
})
const devlogTitle = computed(() => `Devlog ${(project.value?.devlogs.length ?? 0) + 1}`)

const text = ref('')
const photoFile = ref<File | null>(null)
const photoUrl = ref('')
const previewing = ref(false)
const submitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const canSave = computed(() => !!project.value && !!text.value.trim() && !submitting.value)

// shaped like a feed devlog so the preview is the exact card everyone else will see
const previewDevlog = computed<Omit<FeedDevlog, 'type'>>(() => ({
    id: 0,
    linkedShip: null,
    title: devlogTitle.value,
    description: text.value.trim() || '*Nothing written yet.*',
    attachments: photoUrl.value ? [photoUrl.value] : [],
    timestamp: new Date(),
    project: {
        id: props.id,
        title: project.value?.title ?? '',
        icon: project.value?.icon ?? null,
    },
    author: {
        hcaId: session.user.value?.id ?? '',
        username: project.value?.author.username ?? '',
    },
}))

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

async function save() {
    if (!canSave.value) return
    submitting.value = true

    const body = new FormData()
    body.append('title', devlogTitle.value)
    body.append('description', text.value.trim())
    if (photoFile.value) body.append('attachments', photoFile.value)

    try {
        const [created] = await $fetch<{ id: number }[]>(`/api/projects/${props.id}/devlogs`, { method: 'POST', body })
        if (!created) throw new Error('No devlog returned')

        await refreshNuxtData([`project-${props.id}`, 'projects'])
        manager.close(props.instance.id)
    } catch (error: any) {
        console.error(error)
        await manager.messageBox(
            'Error!',
            `There was an error posting your devlog:\n${error?.data?.message ?? error?.message ?? 'unknown error'}`,
            { error: true }
        )
    } finally {
        submitting.value = false
    }
}
</script>
<template>
    <div class="content">
        <div class="header">
            <div class="header-bg">
                <img :src="headerbg" alt="">

                <div class="project-card">
                    <img class="thumb" :src="project?.icon ? `/images/${project.icon}` : projectImage" alt="">
                    <div class="project-info">
                        <h2>{{ project?.title }}</h2>
                        <div class="meta">
                            <span>Made by {{ project?.author.username }}</span>
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

            <DevlogCard
                v-else
                key="preview"
                class="preview"
                :devlog="previewDevlog"
                :show-open="false"
                see-more="expand"
            />
        </div>

        <div class="actions">
            <button type="button" class="action-btn preview-btn" @click="togglePreview">
                {{ previewing ? 'Back to editing' : 'Preview' }}
            </button>

            <div class="right">
                <button type="button" class="action-btn" @click="manager.close(props.instance.id)">Cancel</button>
                <button type="button" class="action-btn" :disabled="!canSave" @click="save">
                    {{ submitting ? 'Saving...' : 'Save' }}
                </button>
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

.preview {
    flex-shrink: 0;
}
</style>
