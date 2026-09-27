<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import Window from "~/components/window.vue"
import { APPS } from "~/registry/apps";
import type { WindowInstance } from "~/types/window";

const manager = useWindowManager();
const props = withDefaults(defineProps<{
    instance: WindowInstance
}>(), {
})

function open(appId: string): boolean {
    if (!Object.keys(APPS).includes(appId)) return false;
    manager.open(appId);
    return true;
}

function submit() {
    if (!query.value.trim()) return;
    if (open(query.value.trim())) {
        manager.close(props.instance.id);
    } else {
        // whatever, it just closes for now
    }
}

const textbox = useTemplateRef<HTMLInputElement>('run-' + props.instance.id);
const query = ref("");
onMounted(async () => {
    await nextTick();
    textbox.value?.focus();
});
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/Run.png" alt="DispoVer Logo" class="logo" />
                <span>
                    <h2>DispoRun</h2>
                    <p>Type in the ID of any app and Disposition will open it for you.</p>
                </span>
            </div>

            <div class="spacer"></div>
        </div>

        <div class="main">
            <input type="text" :ref="'run-' + instance.id" placeholder="welcome" @keydown.enter="submit"
                v-model="query" />
            <div class="buttons">
                <button @click="submit">OK</button>
                <button @click="manager.close(instance.id)">Cancel</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.buttons {
    display: flex;
    flex-direction: row;
    gap: 5px;

    button {
        width: 100px;
    }
}

.logo {
    width: 83px;
    height: 46px;

    filter: drop-shadow(0 0 0.2rem black);
}

.header {
    display: flex;
    flex-direction: column;

    font-family: 'Joan', serif;
    user-select: none;
}

.striped-bg {
    span {
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: column;

        h2 {
            margin: 0;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px #000000);
        }

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px #000000);
        }
    }

    width: 100%;

    background: repeating-linear-gradient(0deg,
        #d7d7d7 0px,
        #d7d7d7 6px,
        #9f9f9f 6px,
        #9f9f9f 7px);
    height: 80px;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-left: 7px;
    gap: 2px;
}


.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid #c6c6c4;
    background-color: #dedede;
}

.content {
    display: flex;
    flex-direction: column;
}
</style>