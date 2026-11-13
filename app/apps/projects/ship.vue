<script setup lang="ts">
import onb1 from '~/assets/misc/onboard1.png'
import onb2 from '~/assets/misc/onboard2.png'
import logo from '~/assets/icons/manager.png'
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from "zod";

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, id: number }>()

const page = ref<number>(1);
const shipForm = useForm({
    validationSchema: toTypedSchema(z.object({
        description: z.string().min(1, "A description is required"),
        attachments: z.instanceof(File).array().min(1, "At least 1 attachment is required"),

        ai: z.boolean(),
        aiDeclaration: z.string(),

        update: z.boolean(),
        updateDeclaration: z.string(),
    })),
    initialValues: {
        ai: false,
        update: false
    },
});

const [descriptionModel] = shipForm.defineField("description");
const [attachmentsModel] = shipForm.defineField("attachments");
const [aiModel] = shipForm.defineField("ai");
const [aiDeclarationModel] = shipForm.defineField("aiDeclaration");
const [updateModel] = shipForm.defineField("update");
const [updateDeclarationModel] = shipForm.defineField("updateDeclaration") 

const submitting = ref(false);
const createdId = ref<number | null>(null);
const openAfterFinish = ref(true);

function finish() {
    if (!props.onboarding && openAfterFinish.value && createdId.value !== null) {
        manager.open("project", { id: createdId.value });
    }
    manager.close(props.instance.id);
    if (props.onboarding) manager.open('onboarding');
}

const submit = projectForm.handleSubmit(async values => {
    submitting.value = true;

    const body = new FormData();
    body.append("title", values.title);
    body.append("description", values.description);
    if (values.repository) body.append("repository", values.repository);
    for (const project of values.hackatimeProjects ?? []) body.append("hackatimeProjects", project);

    try {
        const [created] = await $fetch<{ id: number }[]>("/api/projects", { method: "POST", body });
        if (!created) throw new Error("No project returned");

        await refreshNuxtData("projects");
        createdId.value = created.id;
        page.value = 4;
    } catch (error: any) {
        console.error(error);
        await manager.messageBox(
            "Error!",
            `There was an error creating your project:\n${error?.data?.message ?? error?.message ?? "unknown error"}`,
            { error: true }
        );
    } finally {
        submitting.value = false;
    }
});

function advance(p: number) {
    switch (p) {
        case 1:
            page.value++;
            break;
        case 2:
            refreshHackatimeProjects();
            page.value++;
            break;
        case 3:
            submit();
            break;
        default:
            break;
    }
}
</script>

<template>
    <div class="wizard" v-if="page === 1">
        <div class="body">
            <div class="side">
                <img class="side-bg" :src="onb1" alt="">
                <img class="side-logo" :src="logo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Welcome to the project creation wizard!</h2>

                <p>
                    john project is creating a project
                </p>

                <p>
                    lorem ipsum dolor sit amet
                </p>
            </div>
        </div>

        <div class="footer">
            <button v-if="!props.onboarding" class="btn" @click="manager.close(props.instance.id)">Cancel</button>
            <button class="btn" @click="advance(page)">Next</button>
        </div>
    </div>
    <div class="wizard" v-else-if="page === 2">
        <div class="body">
            <div class="side">
                <img class="side-bg" :src="onb2" alt="">
                <img class="side-logo" :src="logo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Basic details</h2>

                <div class="form">
                    <span>
                        <label for="title">What do you want your project to be called?</label>
                        <input type="text" name="title" placeholder="My awesome project..." v-model="titleModel" />
                    </span>

                    <span>
                        <label for="description">What are you building (get into the nitty gritty!)</label>
                        <textarea class="basic-details-textarea" name="description" v-model="descriptionModel"
                            placeholder="I'm building a really awesome..."></textarea>
                    </span>
                </div>
            </div>
        </div>

        <div class="footer">
            <button v-if="!props.onboarding" @click="manager.close(props.instance.id)">Cancel</button>
            <button @click="advance(page)" :disabled="!projectForm.meta.value.valid">Next</button>
        </div>
    </div>
    <div class="wizard" v-else-if="page === 3">
        <div class="body">
            <div class="side">
                <img class="side-bg" :src="onb1" alt="">
                <img class="side-logo" :src="logo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Other (important) details</h2>
                <p>Every field in here is optional, however they are mandatory when you ship your project. You can
                    add/edit these later!</p>

                <div class="form">
                    <span>
                        <label>Linked Hackatime projects</label>
                        <MultiSelect v-model="hackatimeProjectsModel" :options="hackatimeOptions"
                            :disabled="hackatimeStatus === 'pending'"
                            :placeholder="hackatimeStatus === 'pending' ? 'Loading projects...' : 'Select projects...'"
                            empty-text="No Hackatime projects found" />
                    </span>

                    <span>
                        <label>Git repository URL</label>
                        <input type="text" name="repository" v-model="repositoryModel" />
                    </span>
                </div>
            </div>
        </div>

        <div class="footer">
            <button v-if="!props.onboarding" @click="manager.close(props.instance.id)">Cancel</button>
            <button @click="advance(page)" :disabled="!projectForm.meta.value.valid || submitting">
                {{ submitting ? "Creating..." : "Create" }}
            </button>
        </div>
    </div>
    <div class="wizard" v-else-if="page === 4">
        <div class="body">
            <div class="side">
                <img class="side-bg" :src="onb2" alt="">
                <img class="side-logo" :src="logo" alt="">
            </div>

            <div class="page">
                <h2 class="title">Your project has been created!</h2>

                <p>
                    You can find your new project anytime in the Project Manager. From there you can edit its
                    details, post devlogs and ship it when it's ready.
                </p>

                <label v-if="!props.onboarding" class="hint">
                    <input type="checkbox" v-model="openAfterFinish" />
                    Open my project after closing the wizard
                </label>
                <p v-else class="hint">Press "Finish" to continue the onboarding.</p>
            </div>
        </div>

        <div class="footer">
            <button @click="finish">Finish</button>
        </div>
    </div>
</template>

<style scoped>
.basic-details-textarea {
    resize: none;
    height: 200px;
    width: 100%;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 10px;

    span {
        label {
            font-weight: bold;
        }

        display: flex;
        flex-direction: column;
        gap: 5px;
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

.wizard {
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

    button {
        width: 23%;
        min-width: 90px;
    }
}
</style>