<script setup lang="ts">
import type { WindowInstance } from '~/types/window';
import type { ServerShip } from "~/types/database";
const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance, projectId: number, id: number }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

const ship = ref<ServerShip>();
async function load() {
    ship.value = await $fetch<ServerShip>(`/api/projects/${props.projectId}/ships/${props.id}`);
}
if (admin) await load();

const withdrawing = ref(false);

function withdraw() {
    manager.dialogBox("Withdraw ship?", `Do you want to withdraw ship ${props.id}? This pulls it out of Ari's review queue and the user will have to ship again.`, async (result: boolean) => {
        if (!result) return;
        withdrawing.value = true;
        try {
            await $fetch(`/api/projects/${props.projectId}/ships/${props.id}`, { method: "DELETE" });
            await manager.messageBox("Ship withdrawn", `Ship ${props.id} was withdrawn.`, { info: true });
            await load();
        } catch (err: any) {
            await manager.messageBox("Couldn't withdraw ship", err?.data?.message ?? err?.message ?? "Unknown error", { error: true });
        } finally {
            withdrawing.value = false;
        }
    }, { question: true });
}
</script>

<template>
    <div class="content" v-if="admin && ship">
        <div class="vertical fields">
            <label>Project:</label>
            <p><a @click="manager.open('admin_project', { id: ship.project.id })">{{ ship.project.title }}</a> ({{ ship.project.id }}){{ ship.project.deletedAt ? " (deleted)" : "" }}</p>

            <label>User:</label>
            <p><a @click="manager.open('profile', { id: ship.user.hcaId })">@{{ ship.user.username }}</a> ({{ ship.user.hcaId }})</p>

            <label>Status:</label>
            <p>{{ ship.status }}</p>

            <label>Shipped:</label>
            <p>{{ formatTimestamp(ship.timestamp) }}</p>

            <label v-if="ship.withdrawnAt">Withdrawn:</label>
            <p v-if="ship.withdrawnAt">{{ formatTimestamp(ship.withdrawnAt) }}</p>

            <label>Hackatime:</label>
            <p>{{ formatDuration(ship.hackatimeSeconds) || "0:00" }} ({{ ship.hackatimeProjects?.join(", ") || "no projects" }})</p>

            <label v-if="ship.overrideSeconds != null">Override:</label>
            <p v-if="ship.overrideSeconds != null">{{ formatDuration(ship.overrideSeconds) }} ({{ ship.overrideReason || "no reason given" }})</p>
        </div>

        <div class="vertical">
            <label>Description</label>
            <p>{{ ship.description }}</p>

            <label>Attachments</label>
            <Attachments :attachments="ship.attachments" />
            <p v-if="!ship.attachments.length">none</p>

            <label>Note to reviewers</label>
            <p>{{ ship.reviewerNote || "none" }}</p>

            <label>Message from reviewer</label>
            <p>{{ ship.statusMessage || "none" }}</p>

            <label>Internal message</label>
            <p>{{ ship.internalMessage || "none" }}</p>

            <label>AI</label>
            <p>{{ ship.ai ? `yes: ${ship.aiDeclaration}` : "no" }}</p>

            <label>Update</label>
            <p>{{ ship.update ? `yes: ${ship.updateDeclaration}` : "no" }}</p>

            <label>Devlogs</label>
            <template v-for="devlog in ship.devlogs" :key="devlog.id">
                <a @click="manager.open('devlog', { projectId: ship.project.id, id: devlog.id })">{{ devlog.title }} ({{ formatTimestamp(devlog.timestamp) }})</a>
            </template>
            <p v-if="!ship.devlogs.length">none</p>

            <div class="upload-div">
                <!-- ari only lets you withdraw ships that haven't been decided yet -->
                <button v-if="!ship.withdrawnAt && (ship.status === 'idle' || ship.status === 'claimed')" :disabled="withdrawing" @click="withdraw">Withdraw from Ari</button>
            </div>
        </div>
    </div>
    <div v-else style="text-align: center;">
        <p>sorry, not admin :(</p>
    </div>
</template>

<style scoped>
a {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}

.image {
    width: 200px;
    height: 200px;
}

.upload-div {
    display: flex;
    justify-content: end;
    align-items: end;
    width: 100%;
}

.description {
    min-height: 100px;
    max-height: 100px;

    width: 100%;
    min-width: 100%;
    max-width: 100%;
}

.fields {
    width: 100%;
    gap: 6px !important;
    /* best css oat */
}

.horizontal {
    display: flex;
    flex-direction: row;
    gap: 3px;
}

.vertical {
    display: flex;
    flex-direction: column;

    gap: 3px;

    label {
        margin: 0;
        font-weight: bold;
    }

    p {
        margin: 0;
    }
}

.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;
}
</style>