<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WindowInstance } from '~/types/window'
import onboardingLogo from '~/assets/icons/onboarding-logo.png'
import headerbg from '~/assets/misc/header.png'
import avatar from '~/assets/misc/avatar.png'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import defaultBanner from '~/assets/misc/banner.png'
import { urlToFile } from '~/utils'
import * as z from "zod";
import onb1 from '~/assets/misc/onboard-1.png'
import onb2 from '~/assets/misc/onboard-2.png'
import onb3 from '~/assets/misc/onboard-3.png'
import onb4 from '~/assets/misc/onboard-4.png'

const manager = useWindowManager();
const props = defineProps<{
    instance: WindowInstance
}>()

const PROFILE_SIZE = { width: 768, height: 440 };
const REGULAR_SIZE = { width: 600, height: 470 };

const regions = ['Europe', 'North America', 'South America', 'Asia', 'Africa', 'Oceania'];
const region = ref<string>('Europe');

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
function resizeAndCenter(size: { width: number; height: number }) {
    manager.resize(props.instance.id, size);
    manager.move(props.instance.id, {
        posX: window.innerWidth / 2 - size.width / 2,
        posY: window.innerHeight / 2 - size.height / 2,
    });
}

let info = ref<CachetInfo | undefined>(undefined);

async function loadInfo() {
    try {
        const session = useUserSession();
        info.value = session.loggedIn.value && session.user.value?.slackId
            ? await getUserInfo(session.user.value.slackId)
            : undefined;
    } catch {
        info.value = undefined;
    }
}

async function advance2() {
    config.write("step", 4);
    navigateTo("/oauth-hackatime", { external: true })
}

// user profile screen
const defaultBannerFile = await urlToFile(defaultBanner, 'banner.png');
const userForm = useForm({
    validationSchema: toTypedSchema(z.object({
        banner: z.instanceof(File, { message: "Please choose an image" }),
        username: z.string().min(1),
        bio: z.string().optional(),
    })),
    initialValues: {
        username: useUserSession().user.value?.username,
        banner: defaultBannerFile
    },
});

const [usernameModel] = userForm.defineField("username");
const [bioModel] = userForm.defineField("bio");
const [bannerModel] = userForm.defineField("banner");

const previewUrl = ref<string>(defaultBanner);
let objectUrl: string | null = null;
const fileInput = ref<HTMLInputElement | null>(null);

watch(bannerModel, (file) => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = file instanceof Blob ? URL.createObjectURL(file) : null;
    previewUrl.value = objectUrl ?? defaultBanner;
});

onBeforeUnmount(() => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
});

function setImage(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    bannerModel.value = file;
}

function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    setImage(input.files?.[0]);
    input.value = ""; // allow re-selecting the same file
}

async function resetBanner() {
    bannerModel.value = defaultBannerFile;
}

onMounted(async () => {
    if (step.value === 4) {
        resizeAndCenter(PROFILE_SIZE);
        await loadInfo();
    } else if (step.value === 5) {
        resizeAndCenter(REGULAR_SIZE);
    }
});

// profile screen -> region screen
const saving = ref(false);
const saveError = ref<string | null>(null);

const advance3 = userForm.handleSubmit(async (values) => {
    saving.value = true;
    saveError.value = null;
    try {
        const form = new FormData();
        form.append("username", values.username);
        if (values.bio) form.append("bio", values.bio);
        form.append("banner", values.banner);

        await $fetch("/api/user", { method: "PATCH", body: form });

        config.write("step", 5);
        resizeAndCenter(REGULAR_SIZE);
    } catch (e: any) {
        saveError.value = e?.data?.message ?? "Couldn't save your profile. Try again.";
    } finally {
        saving.value = false;
    }
});
// region screen
const finishing = ref(false);

async function advance4() {
    finishing.value = true;
    saveError.value = null;
    try {
        const form = new FormData();
        form.append("onboardedAt", new Date().toISOString());

        await $fetch("/api/user", { method: "PATCH", body: form });

        config.remove("step");
        manager.close(props.instance.id);
    } catch (e: any) {
        saveError.value = e?.data?.message ?? "Couldn't finish onboarding. Try again.";
    } finally {
        finishing.value = false;
    }
}
</script>

<template>
    <div class="onboarding" v-if="step === 1">
        <div class="body">
            <div class="side blue">
                <img class="side-bg" :src="onb1" alt="">
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

    <div class="onboarding" v-else-if="step === 2">
        <div class="body">
            <div class="side red">
                <img class="side-bg" :src="onb2" alt="">
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

    <div class="onboarding" v-else-if="step === 3">
        <div class="body">
            <div class="side red">
                <img class="side-bg" :src="onb2" alt="">
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

    <div class="onboarding" v-else-if="step === 4 && info">
        <div class="body">
            <div class="side-small green">
                <img class="side-bg" :src="onb3" alt="">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page profile-page">
                <h2 class="title">Customize your profile</h2>

                <div class="header-bg">
                    <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" hidden
                        @change="onFileChange" />
                    <img class="banner" :src="previewUrl" alt="Banner image" />

                    <div class="profile-card">
                        <img class="avatar" :src="info.imageUrl" alt="">
                        <div class="profile-info">
                            <input type="text" v-model="usernameModel" placeholder="Username" />
                            <textarea v-model="bioModel" class="bio"
                                placeholder="Change your bio... (you can use markdown!)"></textarea>
                        </div>
                    </div>

                    <span class="banner-buttons">
                        <button v-if="bannerModel != defaultBannerFile" @click="resetBanner">Reset banner</button>
                        <button @click="fileInput?.click()">Change banner</button>
                    </span>
                </div>
                <span class="error" v-if="userForm.errors.value.banner">{{ userForm.errors.value.banner }}</span>

                <p class="profile-note">
                    This is a preview of how your profile will look when viewed by someone else. You can
                    customize your username and your bio. Have fun with it!
                </p>

                <span class="error" v-if="saveError">{{ saveError }}</span>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel">Cancel</button>
            <button class="btn" :disabled="saving || !userForm.meta.value.valid" @click="advance3">
                {{ saving ? 'Saving…' : 'Next' }}
            </button>
        </div>
    </div>

    <div class="onboarding" v-else-if="step === 5">
        <div class="body">
            <div class="side yellow">
                <img class="side-bg" :src="onb4" alt="">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page region-page">
                <h2 class="title">Region preferences</h2>

                <label class="region-label" for="region">Shop region</label>
                <select id="region" class="region-select" v-model="region">
                    <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
                </select>

                <p class="region-text">
                    Shop region dictates what items are available to you. Please set this to your actual region.
                </p>

                <span class="error" v-if="saveError">{{ saveError }}</span>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel">Cancel</button>
            <button class="btn" :disabled="finishing" @click="advance4">
                {{ finishing ? 'Finishing…' : 'Next' }}
            </button>
        </div>
    </div>

    <div v-else>
    </div>
</template>

<style scoped>
.header-bg {
    position: relative;
    width: 100%;
    height: 175px;
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

.side-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
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

.drop-hint {
    margin: 3px 4px 0 0;
    text-align: right;
    font-size: 12px;
    color: var(--color-gray-dark);
}

.profile-note {
    margin: 16px 0 0 6px;
    font-size: 16px;
    line-height: 1.25;
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

.side-small {
    position: relative;
    flex: 0 0 14%;
}

.blue {
    background: linear-gradient(160deg, #1a0a8c 0%, #2a00ff 100%);
}

.red {
    background: linear-gradient(180deg, #b4306f 0%, #ff2d2d 100%);
}

.green {
    background: linear-gradient(180deg, #2fbf3a 0%, #2dff55 100%);
}

.yellow {
    background: linear-gradient(180deg, #b0902c 0%, #ffc42e 100%);
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

.side-small .side-logo {
    top: 8px;
    right: 8px;
    width: 52%;
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

.page.profile-page {
    padding: 8px 14px 14px 20px;
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

.page.profile-page h2.title {
    margin-bottom: 10px;
}

.page.region-page h2.title {
    margin-bottom: 6px;
}

.region-label {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
}

.region-select {
    box-sizing: border-box;
    width: 100%;
    height: 22px;
    margin: 2px 0 0;
    font-size: 12px;
    cursor: pointer;
}

.page .region-text {
    margin: 14px 0 0;
    font-size: 16px;
    line-height: 1.25;
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