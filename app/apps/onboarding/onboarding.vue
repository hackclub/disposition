<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WindowInstance } from '~/types/window'
import onboardingLogo from '~/assets/icons/onboardingLogo.png'
import headerbg from '~/assets/misc/header.png'
import avatar from '~/assets/misc/avatar.png'
import onb1 from '~/assets/misc/onboard1.png'
import onb2 from '~/assets/misc/onboard2.png'
import onb3 from '~/assets/misc/onboard3.png'
import onb4 from '~/assets/misc/onboard4.png'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import * as z from "zod";
import { urlToFile } from '~/utils'
import ProfileEditor, { type UsernameStatus } from '~/components/profileEditor.vue'

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
const userForm = useForm({
    validationSchema: toTypedSchema(z.object({
        username: z.string().min(1, "Pick a username"),
        bio: z.string().optional(),
    })),
    initialValues: {
        username: useUserSession().user.value?.username,
    },
});

const [usernameModel] = userForm.defineField("username");
const [bioModel] = userForm.defineField("bio");
// not part of the vee-validate form, there's nothing to validate. null = the default banner
const bannerModel = shallowRef<File | null>(null);

// live username check, debounced so we don't hit the server on every keystroke
const usernameStatus = ref<UsernameStatus>("idle");
let checkTimer: ReturnType<typeof setTimeout> | undefined;
let checkId = 0;

watch(usernameModel, value => {
    clearTimeout(checkTimer);
    const id = ++checkId;

    if (!value) {
        usernameStatus.value = "idle";
        return;
    }

    usernameStatus.value = "checking";
    checkTimer = setTimeout(async () => {
        try {
            const result = await $fetch("/api/user/username-available", { query: { username: value } });
            if (id !== checkId) return; // a newer check started while this one was in flight
            usernameStatus.value = result.available ? "available" : ("reason" in result && result.reason === "invalid" ? "invalid" : "taken");
        } catch {
            if (id === checkId) usernameStatus.value = "idle"; // let the server decide on save
        }
    }, 400);
});
onBeforeUnmount(() => clearTimeout(checkTimer));

const canSave = computed(() =>
    userForm.meta.value.valid && (usernameStatus.value === "available" || usernameStatus.value === "idle")
);

// the banner the form started with, so we only upload it again if the user changed it
const loadedBanner = shallowRef<File | null>(null);

// prefill the form with whatever the server already has for this user
async function loadUser() {
    try {
        const user = await $fetch("/api/user");
        if (!user) return;

        let banner: File | null = null;
        if (user.banner) {
            try {
                const file = await urlToFile(`/images/${user.banner}`, user.banner.split("/").pop() ?? "banner.png");
                // urlToFile doesn't check the status, so a 404 page would come back as a "file"
                if (file.type.startsWith("image/")) banner = file;
            } catch {
                // couldn't fetch the stored banner, show the default one
            }
        }

        loadedBanner.value = banner;
        bannerModel.value = banner;
        userForm.resetForm({
            values: {
                username: user.username,
                bio: user.bio ?? undefined,
            },
        });
    } catch {
        // not fatal, the user can still fill the form in by hand
    }
}

const saving = ref(false);
const profileError = ref<string | null>(null);

// resolves true once the profile is saved
async function saveProfile(): Promise<boolean> {
    const { valid, values } = await userForm.validate();
    if (!valid || !values?.username || !canSave.value) return false;

    saving.value = true;
    profileError.value = null;
    try {
        const form = new FormData();
        form.append("username", values.username);
        form.append("bio", values.bio ?? "");
        // leaving banner out keeps whatever the server already has, "" clears it back to the default
        const banner = bannerModel.value;
        if (banner !== loadedBanner.value) form.append("banner", banner ?? "");

        await $fetch("/api/user", { method: "PATCH", body: form });
        loadedBanner.value = banner;
        return true;
    } catch (e: any) {
        if (e?.statusCode === 409) usernameStatus.value = "taken";
        profileError.value = e?.data?.message ?? "Couldn't save your profile. Try again.";
        return false;
    } finally {
        saving.value = false;
    }
}

onMounted(async () => {
    if (step.value === 4) {
        resizeAndCenter(PROFILE_SIZE);
        await Promise.all([loadInfo(), loadUser()]);
    } else if (step.value === 5) {
        resizeAndCenter(REGULAR_SIZE);
    }
});

// profile screen -> region screen
const saveError = ref<string | null>(null);

async function advance3() {
    if (!await saveProfile()) return;
    config.write("step", 5);
    resizeAndCenter(REGULAR_SIZE);
}

// region screen
async function advance4() {
    saveError.value = null;

    useConfiguration("shop").write("region", region.value);
    config.write("step", 6);
}

// project screen
const newProject = ref<boolean>(true);

async function advance5() {
    saveError.value = null;
    config.write("step", 7);

    if (newProject.value) {
        manager.open('new_project', { onboarding: true });
        manager.close(props.instance.id); // the project wizard is gonna reopen the onboarding
    }
}

// finish screen
const finishing = ref<boolean>(false);
async function advance6() {
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
                    Here's the deal: you build a project, log your hours with Hackatime and ship it. Once a
                    reviewer approves it, you get coins for every hour you put in, and you can spend them on real
                    CDs, cassettes and vinyl records or other items from the shop.
                </p>

                <p>
                    Before you start, you'll have to link your Hack Club Auth and Hackatime accounts, set up your profile
                    and region, and create your first project. It only takes a couple of minutes!
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

                <ProfileEditor :avatar="info.imageUrl" v-model:username="usernameModel" v-model:bio="bioModel"
                    v-model:banner="bannerModel" :username-status="usernameStatus"
                    :username-error="userForm.errors.value.username" />

                <p class="profile-note">
                    This is a preview of how your profile will look when viewed by someone else. You can
                    customize your username and your bio. Have fun with it!
                </p>

                <span class="error" v-if="profileError">{{ profileError }}</span>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="cancel">Cancel</button>
            <button class="btn" :disabled="saving || !canSave" @click="advance3">
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
            <button class="btn" @click="advance4">Next</button>
        </div>
    </div>

    <div class="onboarding" v-else-if="step === 6">
        <div class="body">
            <div class="side yellow">
                <img class="side-bg" :src="onb1" alt="">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page region-page">
                <h2 class="title">Create a new project</h2>

                <p>
                    Do you want to create a new project? It is highly recommended to do this now.
                </p>

                <label>
                    <input type="checkbox" v-model="newProject" />
                    Create a new project now
                </label>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="advance5">Next</button>
        </div>
    </div>
    <div class="onboarding" v-else-if="step === 7">
        <div class="body">
            <div class="side yellow">
                <img class="side-bg" :src="onb2" alt="">
                <img class="side-logo" :src="onboardingLogo" alt="">
            </div>

            <div class="page region-page">
                <h2 class="title">You're all set!</h2>

                <p class="hint">Press "Finish" to finish the onboarding wizard.</p>
            </div>
        </div>

        <div class="footer">
            <button class="btn" @click="advance6" :disabled="finishing">
                {{ finishing ? 'Finishing...' : 'Finish' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.side-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
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