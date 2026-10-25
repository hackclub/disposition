<script setup lang="ts">
import { ref } from 'vue'
import headerbg from '~/assets/misc/header.png'
import projectImage from '~/assets/misc/rigby.jpg'

const projectName = ref('')
const about = ref('')

const title = 'Restoring Rigby\u2019s faith from the evil'
const author = 'Username'
const hoursLogged = '28h Logged'

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'save', payload: { projectName: string; about: string }): void
}>()

function save() {
    emit('save', { projectName: projectName.value, about: about.value })
}
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="header-bg">
                <img :src="headerbg" alt="">

                <button class="change-banner">Change banner</button>

                <div class="project-card">
                    <img class="thumb" :src="projectImage" alt="">
                    <div class="project-info">
                        <h2>{{ title }}</h2>
                        <div class="meta">
                            <span>Made by {{ author }}</span>
                            <span>{{ hoursLogged }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main">
            <div class="edit-panel">
                <div class="previews">
                    <div class="preview large"></div>
                </div>

                <div class="image-actions">
                    <button class="change-btn">Change/Delete image</button>
                    <span class="hint">Image must be minimum 100 x 100</span>
                </div>

                <input v-model="projectName" class="field name" type="text" placeholder="Change Project’s name">

                <div class="about-row">
                    <textarea v-model="about" class="field about" placeholder="Change About..."></textarea>

                    <div class="actions">
                        <button class="btn" @click="emit('cancel')">Cancel</button>
                        <button class="btn" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    font-family: 'Fira Sans', sans-serif;
    user-select: none;
}

.header {
    display: flex;
    flex-direction: column;
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

.change-banner {
    position: absolute;
    top: 4px;
    right: 8px;
    width: 142px;
    height: 22px;
    cursor: pointer;
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
    padding: 6px 12px 12px;
}

.edit-panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
}

.previews {
    display: flex;
    align-items: flex-end;
}

.preview {
    background: var(--color-gray-medium);
}

.preview.large {
    width: 132px;
    height: 132px;
}

.image-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: -4px;
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

.field {
    box-sizing: border-box;
    display: block;
    width: 100%;
    max-width: 367px;
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

.about-row {
    display: flex;
    align-items: flex-end;
    gap: 14px;
    margin-top: 6px;
}

.about {
    flex-shrink: 0;
    height: 46px;
    resize: none;
    overflow: hidden;
}

.actions {
    display: flex;
    flex: 1;
    gap: 8px;

    .btn {
        flex: 1;
        height: 24px;
        padding: 2px 6px;
    }
}
</style> 