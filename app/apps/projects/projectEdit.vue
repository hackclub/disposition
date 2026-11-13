<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import type { ServerProject } from '~/types/database'
import type { WindowInstance } from '~/types/window'
import headerbg from '~/assets/misc/header.png'
import projectImage from '~/assets/misc/project.jpg'

const props = defineProps<{ instance: WindowInstance, id: number }>()
const manager = useWindowManager()

const IMAGE_TYPES = 'image/png,image/jpeg,image/webp' // what the server accepts
const MIN_ICON_SIZE = 100

const { data: project } = await useFetch<ServerProject>(`/api/projects/${props.id}`, { key: `project-${props.id}` })

const { data: hackatime, status: hackatimeStatus } = useFetch<{
    projects: { name: string, total_seconds: number }[]
}>('/api/hackatime/projects', { key: 'hackatimeProjects', server: false, lazy: true })

// form state, seeded from the project
const title = ref('')
const description = ref('')
const repository = ref('')
const demo = ref('')
const hackatimeProjects = ref<string[]>([])

function reset() {
    const p = project.value
    if (!p) return
    title.value = p.title
    description.value = p.description
    repository.value = p.repository ?? ''
    demo.value = p.demo ?? ''
    hackatimeProjects.value = [...(p.hackatimeProjects ?? [])]
}
watch(project, reset, { immediate: true })

// images: a picked File replaces, remove* clears the saved one
const iconFile = ref<File | null>(null)
const bannerFile = ref<File | null>(null)
const iconUrl = ref('')
const bannerUrl = ref('')
const removeIcon = ref(false)
const removeBanner = ref(false)
const iconInput = ref<HTMLInputElement | null>(null)
const bannerInput = ref<HTMLInputElement | null>(null)

const iconSrc = computed(() => iconUrl.value
    || (!removeIcon.value && project.value?.icon ? `/images/${project.value.icon}` : ''))
const bannerSrc = computed(() => bannerUrl.value
    || (!removeBanner.value && project.value?.banner ? `/images/${project.value.banner}` : headerbg))
const hasIcon = computed(() => !!iconSrc.value)
const hasBanner = computed(() => !!bannerUrl.value || (!removeBanner.value && !!project.value?.banner))

const hoursLogged = computed(() => {
    const seconds = project.value?.hackatimeSeconds ?? -1
    return seconds < 0 ? '' : `${(seconds / 3600).toFixed(1)}h Logged`
})

// keep linked projects that hackatime didn't return (archived, renamed, token unlinked) so saving doesn't silently drop them
const hackatimeOptions = computed(() => {
    const options = (hackatime.value?.projects ?? []).map(p => ({
        value: p.name,
        label: `${p.name} (${(p.total_seconds / 3600).toFixed(1)}h logged)`,
    }))
    const known = new Set(options.map(o => o.value))
    for (const name of project.value?.hackatimeProjects ?? []) {
        if (!known.has(name)) options.push({ value: name, label: name })
    }
    return options
})

function readSize(file: File) {
    return new Promise<{ width: number, height: number }>((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.naturalWidth, height: img.naturalHeight }) }
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')) }
        img.src = url
    })
}

async function pick(e: Event, kind: 'icon' | 'banner') {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = '' // so picking the same file again still fires change
    if (!file) return

    if (kind === 'icon') {
        const { width, height } = await readSize(file).catch(() => ({ width: 0, height: 0 }))
        if (width < MIN_ICON_SIZE || height < MIN_ICON_SIZE) {
            await manager.messageBox('Error!', `Your project image must be at least ${MIN_ICON_SIZE} x ${MIN_ICON_SIZE}.`, { error: true })
            return
        }
        if (iconUrl.value) URL.revokeObjectURL(iconUrl.value)
        iconFile.value = file
        iconUrl.value = URL.createObjectURL(file)
        removeIcon.value = false
    } else {
        if (bannerUrl.value) URL.revokeObjectURL(bannerUrl.value)
        bannerFile.value = file
        bannerUrl.value = URL.createObjectURL(file)
        removeBanner.value = false
    }
}

function clearImage(kind: 'icon' | 'banner') {
    if (kind === 'icon') {
        if (iconUrl.value) URL.revokeObjectURL(iconUrl.value)
        iconFile.value = null
        iconUrl.value = ''
        removeIcon.value = !!project.value?.icon
    } else {
        if (bannerUrl.value) URL.revokeObjectURL(bannerUrl.value)
        bannerFile.value = null
        bannerUrl.value = ''
        removeBanner.value = !!project.value?.banner
    }
}

onBeforeUnmount(() => {
    if (iconUrl.value) URL.revokeObjectURL(iconUrl.value)
    if (bannerUrl.value) URL.revokeObjectURL(bannerUrl.value)
})

function isLink(value: string) {
    if (!value.trim()) return true
    try {
        return ['http:', 'https:'].includes(new URL(value.trim()).protocol)
    } catch {
        return false
    }
}

const errors = computed(() => ({
    title: title.value.trim() ? '' : 'Please enter a name',
    description: description.value.trim() ? '' : 'Please enter a description',
    repository: isLink(repository.value) ? '' : 'Must be an http(s) URL',
    demo: isLink(demo.value) ? '' : 'Must be an http(s) URL',
}))
const valid = computed(() => Object.values(errors.value).every(e => !e))

// only send what changed, the PATCH treats missing fields as "leave alone"
function buildBody() {
    const p = project.value!
    const body = new FormData()
    const same = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i])

    if (title.value.trim() !== p.title) body.append('title', title.value.trim())
    if (description.value.trim() !== p.description) body.append('description', description.value.trim())
    if (repository.value.trim() !== (p.repository ?? '')) body.append('repository', repository.value.trim())
    if (demo.value.trim() !== (p.demo ?? '')) body.append('demo', demo.value.trim())

    const linked = [...hackatimeProjects.value].sort()
    if (!same(linked, [...(p.hackatimeProjects ?? [])].sort())) {
        if (linked.length) linked.forEach(name => body.append('hackatimeProjects', name))
        else body.append('hackatimeProjects', '') // blank = unlink everything
    }

    // a File replaces it, "" (null over form data) clears it, leaving it out keeps it
    if (iconFile.value) body.append('icon', iconFile.value)
    else if (removeIcon.value) body.append('icon', '')
    if (bannerFile.value) body.append('banner', bannerFile.value)
    else if (removeBanner.value) body.append('banner', '')

    return body
}

function resetAll() {
    reset()
    clearImage('icon')
    clearImage('banner')
    removeIcon.value = false
    removeBanner.value = false
}

const submitting = ref(false)

async function save() {
    if (!project.value || !valid.value || submitting.value) return

    const body = buildBody()
    if ([...body.keys()].length === 0) {
        manager.close(props.instance.id)
        return
    }

    submitting.value = true
    try {
        await $fetch(`/api/projects/${props.id}`, { method: 'PATCH', body })
        await refreshNuxtData([`project-${props.id}`, 'projects'])
        manager.close(props.instance.id)
    } catch (error: any) {
        console.error(error)
        await manager.messageBox(
            'Error!',
            `There was an error saving your project:\n${error?.data?.message ?? error?.message ?? 'unknown error'}`,
            { error: true }
        )
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="content" v-if="project">
        <div class="header">
            <div class="header-bg">
                <img :src="bannerSrc" alt="">

                <input ref="bannerInput" type="file" :accept="IMAGE_TYPES" hidden @change="pick($event, 'banner')">
                <div class="banner-actions">
                    <button type="button" @click="bannerInput?.click()">Change banner</button>
                    <button v-if="hasBanner" type="button" @click="clearImage('banner')">Remove</button>
                </div>

                <div class="project-card">
                    <img class="thumb" :src="iconSrc || projectImage" alt="">
                    <div class="project-info">
                        <h2>{{ title.trim() || project.title }}</h2>
                        <div class="meta">
                            <span>Made by {{ project.author.username }}</span>
                            <span>{{ hoursLogged }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main">
            <div class="edit-panel">
                <div class="image-row">
                    <img v-if="hasIcon" class="preview large" :src="iconSrc" alt="">
                    <div v-else class="preview large"></div>

                    <div class="image-actions">
                        <input ref="iconInput" type="file" :accept="IMAGE_TYPES" hidden @change="pick($event, 'icon')">
                        <button type="button" class="change-btn" @click="iconInput?.click()">Change image</button>
                        <button v-if="hasIcon" type="button" class="change-btn" @click="clearImage('icon')">Delete image</button>
                        <span class="hint">Image must be minimum {{ MIN_ICON_SIZE }} x {{ MIN_ICON_SIZE }}</span>
                    </div>
                </div>

                <label class="row">
                    <span>Project name</span>
                    <input v-model="title" class="field name" type="text" placeholder="Change Project’s name">
                    <span v-if="errors.title" class="error">{{ errors.title }}</span>
                </label>

                <label class="row">
                    <span>About</span>
                    <textarea v-model="description" class="field about" placeholder="Change About... (markdown works)"></textarea>
                    <span v-if="errors.description" class="error">{{ errors.description }}</span>
                </label>

                <label class="row">
                    <span>Git repository URL</span>
                    <input v-model="repository" class="field" type="url" placeholder="https://github.com/...">
                    <span v-if="errors.repository" class="error">{{ errors.repository }}</span>
                </label>

                <label class="row">
                    <span>Demo URL</span>
                    <input v-model="demo" class="field" type="url" placeholder="https://...">
                    <span v-if="errors.demo" class="error">{{ errors.demo }}</span>
                </label>

                <div class="row">
                    <span>Linked Hackatime projects</span>
                    <MultiSelect v-model="hackatimeProjects" :options="hackatimeOptions"
                        :disabled="hackatimeStatus === 'pending'"
                        :placeholder="hackatimeStatus === 'pending' ? 'Loading projects...' : 'Select projects...'"
                        empty-text="No Hackatime projects found" />
                </div>
            </div>
        </div>

        <div class="actions">
            <button type="button" class="btn" @click="resetAll">Reset</button>
            <div class="right">
                <button type="button" class="btn" @click="manager.close(props.instance.id)">Cancel</button>
                <button type="button" class="btn" :disabled="!valid || submitting" @click="save">
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
    font-family: 'Fira Sans', sans-serif;
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
    height: 150px;
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

.banner-actions {
    position: absolute;
    top: 4px;
    right: 8px;
    display: flex;
    gap: 6px;

    button {
        height: 22px;
        cursor: pointer;
    }
}

.project-card {
    position: absolute;
    top: 8px;
    left: 20px;
    width: 330px;
    max-width: calc(100% - 48px);
    display: flex;
    gap: 12px;
    padding: 6px;
    background: white;
    border: 1px solid var(--color-gray-medium);

    .thumb {
        flex-shrink: 0;
        width: 90px;
        height: 90px;
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
            font-weight: 600;
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
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}

.main {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 6px 12px 12px;
}

.edit-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
}

.image-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
}

.preview {
    flex-shrink: 0;
    object-fit: cover;
    background: var(--color-gray-medium);
    border: 1px solid var(--color-gray-dark);
    box-sizing: border-box;
}

.preview.large {
    width: 132px;
    height: 132px;
}

.image-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.change-btn {
    height: 22px;
    padding: 0 5px;
    font-family: inherit;
    font-size: 13px;
    background: linear-gradient(var(--color-btn-gradient-top), var(--color-btn-gradient-bottom-alt));
    border: 1px solid var(--color-gray-800);
    border-radius: 3px;
    cursor: pointer;
    white-space: nowrap;
}

.hint {
    color: var(--color-gray-dark);
    font-size: 13px;
}

.row {
    display: flex;
    flex-direction: column;
    gap: 4px;

    > span:first-child {
        font-weight: bold;
    }
}

.error {
    color: #c00;
    font-size: 13px;
}

.field {
    box-sizing: border-box;
    display: block;
    width: 100%;
    margin: 0;
    padding: 3px 6px;
    font-family: inherit;
    font-size: 16px;
    line-height: 1.2;
    color: var(--color-gray-900);
    background: var(--color-white);
    border: 1px solid var(--color-gray-dark);
    border-radius: 0;
    outline: none;
}

.field::placeholder {
    color: var(--color-gray-muted);
}

.field:focus {
    border-color: var(--color-gray-800);
}

.name {
    height: 28px;
}

.about {
    height: 90px;
    resize: none;
}

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    padding: 8px 12px 12px;

    .right {
        display: flex;
        gap: 8px;
    }

    .btn {
        width: 94px;
        height: 24px;
        padding: 2px 6px;
    }
}
</style>
