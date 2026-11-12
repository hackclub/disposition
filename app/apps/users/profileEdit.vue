<script setup lang="ts">
import type { WindowInstance } from '~/types/window'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import * as z from "zod";
import { urlToFile } from '~/utils'
import ProfileEditor, { type UsernameStatus } from '~/components/profileEditor.vue'
import defaultAvatar from '~/assets/misc/avatar.png'

const props = defineProps<{ instance: WindowInstance }>();
const manager = useWindowManager();
const session = useUserSession();

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

const avatar = ref<string>(defaultAvatar);

onMounted(async () => {
    const slackId = session.user.value?.slackId;
    await Promise.all([
        loadUser(),
        slackId
            ? getUserInfo(slackId).then(info => { avatar.value = info.imageUrl }).catch(() => {})
            : undefined,
    ]);
});

async function save() {
    if (!await saveProfile()) return;

    // pick up the new username in the session, and refetch open windows (profile viewer etc.)
    await session.fetch();
    await refreshNuxtData();
    manager.close(props.instance.id);
}
</script>

<template>
    <div class="content">
        <div class="page">
            <ProfileEditor :avatar="avatar" v-model:username="usernameModel" v-model:bio="bioModel"
                    v-model:banner="bannerModel" :username-status="usernameStatus"
                    :username-error="userForm.errors.value.username" />

            <p class="note">
                This is a preview of how your profile looks to everyone else. You can change your username,
                bio and banner.
            </p>

            <span class="error" v-if="profileError">{{ profileError }}</span>
        </div>

        <div class="footer">
            <button class="btn" @click="manager.close(props.instance.id)">Cancel</button>
            <button class="btn" :disabled="saving || !canSave" @click="save">
                {{ saving ? 'Saving…' : 'Save' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    user-select: none;
}

.page {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    background: var(--color-panel-bg);
}

.note {
    margin: 12px 12px 0;
    font-size: 15px;
    line-height: 1.25;
}

.error {
    margin: 8px 12px 0;
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
