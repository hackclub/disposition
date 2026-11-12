<script lang="ts">
export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";
</script>

<script setup lang="ts">
import defaultBanner from '~/assets/misc/banner.png'

const username = defineModel<string | undefined>("username");
const bio = defineModel<string | undefined>("bio");
const banner = defineModel<File | null | undefined>("banner");
const props = defineProps<{ avatar?: string, usernameStatus: UsernameStatus, usernameError?: string }>();

const fileInput = ref<HTMLInputElement | null>(null);

function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type.startsWith("image/")) banner.value = file;
    input.value = ""; // allow reselecting the same file
}

// banner preview
const previewUrl = ref<string>(defaultBanner);
let objectUrl: string | null = null;
watch(banner, file => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = file instanceof Blob ? URL.createObjectURL(file) : null;
    previewUrl.value = objectUrl ?? defaultBanner;
}, { immediate: true });
onBeforeUnmount(() => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
});

const statusText = computed(() => {
    switch (props.usernameStatus) {
        case "checking": return "Checking username...";
        case "available": return "Username available!";
        case "taken": return "That username is already taken";
        case "invalid": return "2-24 characters, lowercase letters, numbers and underscores only";
        default: return props.usernameError ?? "";
    }
});
</script>

<template>
    <div class="header-bg">
        <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" hidden @change="onFileChange" />
        <img class="banner" :src="previewUrl" alt="Banner image" />

        <div class="profile-card">
            <img class="avatar" :src="avatar" alt="">
            <div class="profile-info">
                <input type="text" v-model="username" placeholder="Username" maxlength="24" />
                <span class="username-status" :class="usernameStatus">{{ statusText }}</span>
                <textarea v-model="bio" class="bio" placeholder="Change your bio... (you can use markdown!)"></textarea>
            </div>
        </div>

        <span class="banner-buttons">
            <button v-if="banner" @click="banner = null">Reset banner</button>
            <button @click="fileInput?.click()">Change banner</button>
        </span>
    </div>
</template>

<style scoped>
.header-bg {
    position: relative;
    width: 100%;
    height: 175px;
    flex-shrink: 0;
    overflow: hidden;

    .banner {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        user-select: none;
        pointer-events: none;
    }
}

.profile-card {
    position: absolute;
    top: 24px;
    left: 24px;
    width: 66%;
    max-width: calc(100% - 48px);
    box-sizing: border-box;
    display: flex;
    gap: 8px;
    padding: 14px;
    background: var(--color-panel-bg);
    border: 1px solid var(--color-gray-medium);

    .avatar {
        flex-shrink: 0;
        width: 104px;
        height: 104px;
        object-fit: cover;
        border: 1px solid var(--color-gray-dark);
        background: var(--color-gray-medium);
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;

        input[type="text"] {
            box-sizing: border-box;
            width: 100%;
            height: 26px;
            font-size: 15px;
        }

        .bio {
            box-sizing: border-box;
            width: 100%;
            flex: 1;
            min-height: 0;
            resize: none;
            font-size: 15px;
            line-height: 1.2;
        }
    }
}

.username-status {
    min-height: 14px;
    font-size: 11px;
    line-height: 14px;
    color: var(--color-gray-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.available {
        color: #1a7f1a;
    }

    &.taken,
    &.invalid {
        color: #b00000;
    }
}

.banner-buttons {
    position: absolute;
    right: 4px;
    bottom: 4px;
    padding: 2px 2px;

    display: flex;
    flex-direction: row;
    gap: 5px;

    font-size: 12px;
    cursor: pointer;
}
</style>
