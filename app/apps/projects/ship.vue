<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import type { ServerProject } from '~/types/database'
import type { WindowInstance } from '~/types/window'
import onb1 from '~/assets/misc/onboard1.png'
import onb2 from '~/assets/misc/onboard2.png'
import onb3 from '~/assets/misc/onboard3.png'
import onb4 from '~/assets/misc/onboard4.png'
import logo from '~/assets/icons/manager.png'

const manager = useWindowManager()
const props = defineProps<{ instance: WindowInstance, id: number }>()

const { data: project } = await useFetch<ServerProject>(`/api/projects/${props.id}`, { key: `project-${props.id}` })
const page = ref<number>(1)

// rules
const rulesRead = ref(false)

// checklist
const autoChecks = computed(() => {
    const p = project.value
    const pending = p?.ships.some(ship => ship.status === 'idle') ?? false
    return [
        { label: "Your project has a banner", ok: !!p?.banner },
        { label: "Your project has an icon", ok: !!p?.icon },
        { label: "Your project has a description", ok: !!p?.description.trim() },
        { label: "Your project has a repository URL", ok: !!p?.repository },
        { label: "Your project has a demo URL", ok: !!p?.demo },
        { label: "Your project has linked Hackatime projects", ok: (p?.hackatimeProjects?.length ?? 0) > 0 },
        { label: "You don't already have a ship waiting for review", ok: !pending },
    ]
})
const autoChecksPass = computed(() => autoChecks.value.every(c => c.ok))

const manualChecks = [
    "My project's README is not AI generated and covers all of the README requirements in the shipping rules",
    "My project's code is less than 30% AI generated",
    "My project is complete and presentable to the public",
    "The demo URL is up and works for someone who isn't me",
    "The repository URL is correct and the repository is public",
    "My devlogs and ship description are written by me, not by AI",
]
const ticked = ref<boolean[]>(manualChecks.map(() => false))
const manualChecksPass = computed(() => ticked.value.every(Boolean))

// details page
const description = ref('')
const reviewerNote = ref('')
const usedAi = ref(false)
const aiDeclaration = ref('')
// a project that already has a ship is an update by default
const isUpdate = ref((project.value?.ships.length ?? 0) > 0)
const updateDeclaration = ref('')

type Attachment = { file: File, url: string }
const attachments = ref<Attachment[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

function addFiles(e: Event) {
    const input = e.target as HTMLInputElement
    for (const file of input.files ?? []) {
        attachments.value.push({ file, url: URL.createObjectURL(file) })
    }
    input.value = '' // so picking the same file again still fires change
}

function removeAttachment(index: number) {
    const [removed] = attachments.value.splice(index, 1)
    if (removed) URL.revokeObjectURL(removed.url)
}

onBeforeUnmount(() => attachments.value.forEach(a => URL.revokeObjectURL(a.url)))

const detailErrors = computed(() => ({
    description: description.value.trim() ? '' : 'Please write a ship description',
    attachments: attachments.value.length ? '' : 'Add at least 1 attachment',
    aiDeclaration: !usedAi.value || aiDeclaration.value.trim() ? '' : 'Tell us how you used AI',
    updateDeclaration: !isUpdate.value || updateDeclaration.value.trim() ? '' : 'Tell us what changed since your last ship',
}))
const detailsValid = computed(() => Object.values(detailErrors.value).every(e => !e))

// submit page
const submitting = ref(false)

async function submit() {
    if (submitting.value) return
    submitting.value = true

    const body = new FormData()
    body.append('project', String(props.id))
    body.append('description', description.value.trim())
    if (reviewerNote.value.trim()) body.append('reviewerNote', reviewerNote.value.trim())
    body.append('ai', String(usedAi.value))
    if (usedAi.value) body.append('aiDeclaration', aiDeclaration.value.trim())
    body.append('update', String(isUpdate.value))
    if (isUpdate.value) body.append('updateDeclaration', updateDeclaration.value.trim())
    for (const { file } of attachments.value) body.append('attachments', file)

    try {
        await $fetch(`/api/projects/${props.id}/ships`, { method: 'POST', body })
        await refreshNuxtData([`project-${props.id}`, 'projects', 'notifications'])
        page.value = 6
    } catch (error: any) {
        console.error(error)
        await manager.messageBox(
            'Error!',
            `There was an error shipping your project:\n${error?.data?.message ?? error?.message ?? 'unknown error'}`,
            { error: true }
        )
    } finally {
        submitting.value = false
    }
}

const canAdvance = computed(() => {
    switch (page.value) {
        case 2: return rulesRead.value
        case 3: return autoChecksPass.value && manualChecksPass.value
        case 4: return detailsValid.value
        case 5: return !submitting.value
        default: return true
    }
})

function next() {
    if (!canAdvance.value) return
    if (page.value === 5) submit()
    else page.value++
}

function back() {
    if (page.value > 1 && page.value < 6) page.value--
}
</script>

<template>
    <div class="wizard" v-if="project">
        <div class="body">
            <template v-if="page === 1">
                <div class="side">
                    <img class="side-bg" :src="onb1" alt="">
                    <img class="side-logo" :src="logo" alt="">
                </div>
                <div class="page">
                    <h2 class="title">Ship {{ project.title }}</h2>

                    <p>
                        Shipping sends your project to the Disposition reviewers. If it's accepted, the hours you logged
                        since your last ship count towards physical media from the shop.
                    </p>
                    <p>This wizard will walk you through:</p>
                    <ol class="steps">
                        <li>The shipping rules, including exactly how much AI is allowed</li>
                        <li>A checklist to make sure your project is ready</li>
                        <li>Writing your ship description and adding screenshots</li>
                    </ol>
                    <p>
                        Take your time. A ship that follows the rules gets reviewed faster than one that gets sent back.
                    </p>
                </div>
            </template>

            <template v-else-if="page === 2">
                <div class="side-small">
                    <img class="side-bg" :src="onb2" alt="">
                    <img class="side-logo" :src="logo" alt="">
                </div>
                <div class="page">
                    <h2 class="title">Shipping rules</h2>
                    <p>
                        Please read all of this!! These rules are not suggestions, and "I didn't know" won't get a ship
                        accepted!
                    </p>

                    <div class="rules">
                        <section>
                            <h3>AI code: under 30%</h3>
                            <ul>
                                <li>
                                    A maximum of 30% of your project's code can be written by AI. This includes
                                    code from chatbots (ChatGPT, Claude), AI agents and editors (Cursor, Copilot),
                                    and multi-line AI autocomplete.
                                </li>
                                <li>
                                    The code that ends up in your project is what actually matter, not how often you asked AI something!
                                    Using AI to explain an error or a concept is fine, directly pasting the code it writes counts
                                    towards the 30%.
                                </li>
                                <li>
                                    If you're not sure whether you're under 30%, you probably aren't...
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3>Your README.md must be written by you</h3>
                            <ul>
                                <li>No AI-generated readme's!!! No matter in what capacity. Any AI in your readme is BAD!!</li>
                                <li>It has to explain what your project is, how to use or run it, and link to the demo.</li>
                            </ul>
                        </section>

                        <section>
                            <h3>Your writing must be yours</h3>
                            <ul>
                                <li>Devlogs and your ship description must be written by you!</li>
                            </ul>
                        </section>

                        <section>
                            <h3>Declare any AI use</h3>
                            <ul>
                                <li>
                                    If you used AI for anything in your project, say what you used it for when you ship.
                                    Be honest! We care more about how you used it, not if you used it.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3>Your project must be finished</h3>
                            <ul>
                                <li>It has to be complete and presentable to the public, with a working demo and a public repository.</li>
                            </ul>
                        </section>

                        <p class="warning">
                            Ships that break these rules will be rejected.
                        </p>
                    </div>

                    <label class="tick">
                        <input type="checkbox" v-model="rulesRead">
                        I've read and understood the shipping rules
                    </label>
                </div>
            </template>

            <template v-else-if="page === 3">
                <div class="side-small">
                    <img class="side-bg" :src="onb3" alt="">
                    <img class="side-logo" :src="logo" alt="">
                </div>
                <div class="page">
                    <h2 class="title">Is your project ready?</h2>

                    <label v-for="check in autoChecks" :key="check.label" class="tick">
                        <input type="checkbox" :checked="check.ok" disabled>
                        {{ check.label }}
                    </label>
                    <label v-for="(check, i) in manualChecks" :key="check" class="tick">
                        <input type="checkbox" v-model="ticked[i]">
                        {{ check }}
                    </label>

                    <p v-if="!autoChecksPass" class="status">
                        Some of your project's details are missing! Close this wizard, edit your project to fill them
                        in, then come back.
                    </p>
                </div>
            </template>

            <template v-else-if="page === 4">
                <div class="side-small">
                    <img class="side-bg" :src="onb4" alt="">
                    <img class="side-logo" :src="logo" alt="">
                </div>
                <div class="page">
                    <h2 class="title">Ship details</h2>

                    <div class="form">
                        <span>
                            <label>Ship description</label>
                            <textarea v-model="description" class="ship-textarea"
                                placeholder="What did you build, and what are you proud of? (markdown works)"></textarea>
                            <small v-if="detailErrors.description" class="error">{{ detailErrors.description }}</small>
                        </span>

                        <span>
                            <label>Attachments (at least 1 screenshot)</label>
                            <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/webp" multiple hidden @change="addFiles">
                            <div class="attachments">
                                <div v-for="(a, i) in attachments" :key="a.url" class="attachment">
                                    <img :src="a.url" alt="">
                                    <button type="button" class="remove" title="Remove" @click="removeAttachment(i)">&times;</button>
                                </div>
                                <button type="button" class="add" @click="fileInput?.click()">+ Add</button>
                            </div>
                            <small v-if="detailErrors.attachments" class="error">{{ detailErrors.attachments }}</small>
                        </span>

                        <span>
                            <label class="tick">
                                <input type="checkbox" v-model="usedAi">
                                I used AI in this project
                            </label>
                            <textarea v-if="usedAi" v-model="aiDeclaration" class="small-textarea"
                                placeholder="What & how did you use AI?"></textarea>
                            <small v-if="detailErrors.aiDeclaration" class="error">{{ detailErrors.aiDeclaration }}</small>
                        </span>

                        <span>
                            <label class="tick">
                                <input type="checkbox" v-model="isUpdate">
                                This is an update to a project I've shipped before/that has existed since before December 1st
                            </label>
                            <textarea v-if="isUpdate" v-model="updateDeclaration" class="small-textarea"
                                placeholder="What changed since then?"></textarea>
                            <small v-if="detailErrors.updateDeclaration" class="error">{{ detailErrors.updateDeclaration }}</small>
                        </span>

                        <span>
                            <label>Note for reviewers (optional)</label>
                            <textarea v-model="reviewerNote" class="small-textarea"
                                placeholder="Anything extra reviewers should know?"></textarea>
                        </span>
                    </div>
                </div>
            </template>

            <template v-else-if="page === 5">
                <div class="side-small">
                    <img class="side-bg" :src="onb1" alt="">
                    <img class="side-logo" :src="logo" alt="">
                </div>
                <div class="page">
                    <h2 class="title">Are you sure?</h2>

                    <p>You're about to ship <b>{{ project.title }}</b> with:</p>
                    <ul class="summary">
                        <li>{{ attachments.length }} attachment{{ attachments.length === 1 ? '' : 's' }}</li>
                        <li>{{ usedAi ? 'AI use declared' : 'No AI use declared' }}</li>
                        <li>{{ isUpdate ? 'Marked as an update' : 'Marked as a new project' }}</li>
                    </ul>
                    <p>
                        Once shipped, it goes into the review queue and you can't edit it. You can withdraw it while it's
                        still waiting for review.
                    </p>
                    <p>
                        Double check that your demo works and that everything on the checklist is actually true.
                        Reviewers will look.
                    </p>
                </div>
            </template>

            <template v-else>
                <div class="side">
                    <img class="side-bg" :src="onb2" alt="">
                    <img class="side-logo" :src="logo" alt="">
                </div>
                <div class="page">
                    <h2 class="title">Your project has been shipped!</h2>
                    <p>
                        Congratulations! <b>{{ project.title }}</b> is now in the review queue. You'll get a notification
                        once a reviewer has looked at it.
                    </p>
                    <p>In the meantime, keep building and posting devlogs. They'll count towards your next ship.</p>
                </div>
            </template>
        </div>

        <div class="footer">
            <template v-if="page < 6">
                <button v-if="page > 1" :disabled="submitting" @click="back">Back</button>
                <button :disabled="submitting" @click="manager.close(props.instance.id)">Cancel</button>
                <button :disabled="!canAdvance" @click="next">
                    {{ page === 5 ? (submitting ? 'Shipping...' : 'Ship it!') : 'Next' }}
                </button>
            </template>
            <button v-else @click="manager.close(props.instance.id)">Finish</button>
        </div>
    </div>
</template>

<style scoped>
.steps, .summary {
    margin: 0 0 14px;
    padding-left: 22px;
    line-height: 1.4;
}

.rules {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;

    section {
        padding: 8px 10px;
        background: var(--color-bg-light);
        border: 1px solid var(--color-gray-medium);
    }

    h3 {
        margin: 0 0 4px;
        font-size: 16px;
    }

    ul {
        margin: 0;
        padding-left: 20px;
        line-height: 1.35;
    }

    li + li {
        margin-top: 4px;
    }

    .warning {
        margin: 0;
        font-weight: 700;
    }
}

.tick {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 6px;
    line-height: 1.3;
    cursor: pointer;

    input {
        flex-shrink: 0;
        margin: 2px 0 0;
    }
}

.form .tick {
    font-weight: normal !important;
    margin-bottom: 0;
}

.ship-textarea {
    resize: none;
    height: 110px;
    width: 100%;
    box-sizing: border-box;
}

.small-textarea {
    resize: none;
    height: 52px;
    width: 100%;
    box-sizing: border-box;
}

.error {
    color: #b00000;
}

.attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .attachment {
        position: relative;
        width: 72px;
        height: 72px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border: 1px solid var(--color-gray-dark);
            box-sizing: border-box;
        }

        .remove {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 18px;
            min-width: 0;
            height: 18px;
            padding: 0;
            line-height: 1;
        }
    }

    .add {
        width: 72px;
        height: 72px;
    }
}

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