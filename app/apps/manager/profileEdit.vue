<script setup lang="ts">
import { ref } from 'vue'
import badge from '~/assets/icons/badge.png'
import avatar from '~/assets/icons/avatar.png'
import headerbg from '~/assets/misc/header.png'

const username = ref('')
const bio = ref('')

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'save', payload: { username: string; bio: string }): void
}>()

function save() {
    emit('save', { username: username.value, bio: bio.value })
}
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="header-bg">
                <img :src="headerbg" alt="">
                <div class="profile-card">
                    <img class="avatar" :src="avatar" alt="">
                    <div class="profile-info">
                        <h2>Username <img class="badge" :src="badge" alt=""></h2>
                        <p>"This is a bio look at me"</p>
                        <button class="btn">Edit profile</button>
                    </div>
                </div>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main">
            <div class="edit-panel">
                <div class="image-col">
                    <div class="previews">
                        <div class="preview large"></div>
                        <div class="preview small"></div>
                    </div>
                    <div class="image-actions">
                        <button class="change-btn">Change/Delete image</button>
                        <span class="hint">Image must be minimum 100 x 100</span>
                    </div>
                </div>

                <div class="form-col">
                    <input v-model="username" class="field username" type="text" placeholder="Change username...">
                    <textarea v-model="bio" class="field bio" placeholder="Change bio..."></textarea>

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

.profile-card {
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

    .avatar {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border: 1px solid var(--color-gray-dark);
        background: var(--color-gray-medium);
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;

        h2 {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 0;
            font-weight: 500;
            font-family: 'Joan', serif;
        }

        p {
            margin: 0 0 6px;
            font-size: 12px;
        }
    }
}

.badge {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}

.main {
    padding: 10px;
}

.btn {
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 5px;

    button {
        width: 100px;
    }
}

.edit-panel {
    margin: 0px;
    display: grid;
    grid-template-columns: auto 190px;
    gap: 0 8px;
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
    padding: 2px 6px;
    background: white;
    font-family: 'Fira Sans', sans-serif;
    font-size: 14px;
    user-select: none;
}

.image-col {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.previews {
    display: flex;
    align-items: flex-end;
    gap: 6px;
}

.preview {
    background: var(--color-gray-medium);
}

.preview.large {
    width: 150px;
    height: 150px;
}

.preview.small {
    width: 28px;
    height: 28px;
}

.image-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 3px;
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
    font-size: 11px;
}

.form-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
}

.field {
    box-sizing: border-box;
    display: block;
    width: 100%;
    margin: 0;
    padding: 3px 5px;
    font-family: inherit;
    font-size: 14px;
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

.username {
    height: 24px;
}

.bio {
    height: 40px;
    resize: none;
    overflow: hidden;
}

.actions {
    display: flex;
    gap: 5px;
    margin-top: auto;

    .btn {
        flex: 1;
        height: 24px;
        padding: 2px 6px;
    }
}
</style>