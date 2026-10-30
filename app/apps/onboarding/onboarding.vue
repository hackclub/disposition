<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WindowInstance } from '~/types/window'
import onboardingLogo from '~/assets/icons/onboarding-logo.png'
import headerbg from '~/assets/misc/header.png'
import avatar from '~/assets/misc/avatar.png'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import * as z from "zod";

const manager = useWindowManager();
const props = defineProps<{
    instance: WindowInstance
}>()

const config = useConfiguration("onboarding");
const step = computed(() => (config.has("step") ? config.read("step") : 1));

// first screen
function cancel() {
    config.remove("step");
    manager.close(props.instance.id);
}

function advance() {
    config.write("step", 2);
}

// hca screen
const sensitiveAuth = ref<boolean>(false);

function advance1() {
    config.write("step", 3);
    if (sensitiveAuth.value) {
        navigateTo("/oauth-sensitive", { external: true })
    } else {
        navigateTo("/oauth", { external: true })
    }
}

// hackatime screen
let info = ref<CachetInfo | undefined>(undefined);
async function advance2() {
    config.write("step", 4);
    navigateTo("/oauth-hackatime", { external: true })

    // resize window to fit the big ahh screen
    manager.resize(props.instance.id, { width: 500, height: 500 });

    // get cachet data (we should have user session by now)
    const session = useUserSession();
    info.value = session.loggedIn.value && session.user.value?.slackId ? await getUserInfo(session.user.value.slackId) : undefined;
}

// user profile screen
const userForm = useForm({
    validationSchema: toTypedSchema(z.object({
        banner: z.instanceof(File, { message: "Please choose an image" }),
        
    }))
});


const previewUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">` +
        `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ` +
        `font-family="sans-serif" font-size="16" fill="#888">Drag and drop your image in here</text></svg>`
    );

function setImage(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;

    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
    setFieldValue("image", file); // validates against the schema
}

onBeforeUnmount(() => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

onMounted(async () => {
    if (step.value === 4) {
        manager.resize(props.instance.id, { width: 500, height: 500 });

        const session = useUserSession();
        info.value = session.loggedIn.value && session.user.value?.slackId ? await getUserInfo(session.user.value.slackId) : undefined;
    }
})

function advance3() {

}
</script>

<template>
    <div class="onboarding" v-if="step === 1">
        <div class="body">
            <div class="side blue">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Welcome to Disposition!</h2>

                <p>
                    Welcome to the Disposition, a physical-media based YSWS!
                </p>

                <p>
                    lorem ipsum dolor sit amet sit sit sit sit sits its itsi sits istis isit
                    sit sit sit sit sit sit sit sit sit si sit sit sit sit stit sit sit sit sit
                    sit si sit sits its isit sit sit sit sit sit sit sit sit sit sit sit sit sit
                    sit sit sit sit sit sit sits it sit sit sit sit sit sits sit
                </p>

                <p class="hint">Click "Next" in order to start the onboarding</p>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel">Cancel</button>
            <button class="btn" @click="advance">Next</button>
        </div>
    </div>

    <div class="onboarding" v-if="step === 2">
        <div class="body">
            <div class="side red">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Link your Hack Club Auth account</h2>

                <p>
                    To participate in Disposition, you must link your Hack Club Auth account first.
                </p>

                <b>Sensitive Information</b>
                <p>
                    Do you want to authorize Disposition to access sensitive info (such as addresses, legal name and
                    birthdate) now? You can do this later.
                </p>

                <label>
                    <input type="checkbox" v-model="sensitiveAuth" />
                    Authorize Disposition to access sensitive information
                </label>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel">Cancel</button>
            <button class="btn" @click="advance1">Authorize</button>
        </div>
    </div>

    <div class="onboarding" v-if="step === 3">
        <div class="body">
            <div class="side red">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Link your Hackatime account</h2>

                <p>
                    To participate in Disposition, you must also link your Hackatime account.
                </p>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel">Cancel</button>
            <button class="btn" @click="advance2">Link account</button>
        </div>
    </div>

    <div class="onboarding" v-if="step === 4 && info">
        <div class="body">
            <div class="side red">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Customize your profile</h2>

                <!-- TODO image upload code -->
                <div class="header-bg">
                    <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" v-show="false"
                        @change="(e) => setImage((e.target as HTMLInputElement).files?.[0])" />

                    <img class="drag-and-drop" :class="{ dragging: isDragging }" :src="previewUrl ?? placeholder"
                        alt="Item image" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                        @drop.prevent="onDrop" />

                    <div class="profile-card">
                        <img class="avatar" :src="info.imageUrl" alt="">
                        <div class="profile-info">
                            <h2>Username</h2>
                            <p>"This is a bio look at me"</p>
                        </div>
                    </div>

                    <button type="button" @click="fileInput?.click()">Upload from files</button>
                </div>
                <span class="error" v-if="errors.image">{{ errors.image }}</span>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel">Cancel</button>
            <button class="btn" @click="advance2">Link account</button>
        </div>
    </div>
    <div v-else>
    </div>
</template>

<style scoped>
.header-bg {}

.profile-card {
    width: 330px;
    max-width: calc(100% - 48px);
    display: flex;
    gap: 12px;
    padding: 6px;
    background: var(--color-panel-bg);
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

.onboarding {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-family: 'Fira Sans', sans-serif;
    font-size: 14px;
    user-select: none;
}

.body {
    display: flex;
    flex: 1;
    min-height: 0;
}

.side {
    position: relative;
    flex: 0 0 39%;
}

.side.blue {
    background: linear-gradient(160deg, #1a0a8c 0%, #2a00ff 100%);
}

.side.red {
    background: linear-gradient(180deg, #b4306f 0%, #ff2d2d 100%);
}

.side-logo {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 27%;
    aspect-ratio: 1;
    object-fit: contain;
    display: block;
}

.page {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    padding: 20px 16px 14px;
    overflow-y: auto;
    background: var(--color-panel-bg);

    p {
        margin: 0 0 14px;
        font-size: 14px;
        line-height: 1.3;
    }
}

.page h2.title {
    display: block;
    margin: 0 0 16px;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    color: inherit;
}

.hint {
    margin: auto 0 0;
}

.link {
    color: #1a1aff;
    text-decoration: none;
    cursor: pointer;
}

.link-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 8px;
    background: var(--color-bg-light);
    border: 1px solid var(--color-gray-medium);
}

.status {
    font-weight: 600;
    color: #b00000;
}

.footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-shrink: 0;
    padding: 6px 10px;
    background: var(--color-bg-light);
    border-top: 1px solid var(--color-border-light);
}

.btn {
    width: 23%;
    min-width: 90px;
}
</style>