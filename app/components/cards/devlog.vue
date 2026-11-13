<script setup lang="ts">
import { ref, watch } from 'vue'
import { Markdown } from '@comark/vue'
import type { FeedDevlog } from '~/types/database'

const props = withDefaults(defineProps<{
    devlog: Omit<FeedDevlog, 'type'>,

    trimDescription?: number | false,
    showProject?: boolean, // hide the project name a tag
    showOpen?: boolean,
    showAuthor?: boolean,
    seeMore?: 'project' | 'expand',
}>(), {
    trimDescription: 150,
    showProject: true,
    showOpen: true,
    seeMore: 'project',
    showAuthor: true
});

const manager = useWindowManager();

const expanded = ref(false);
const description = ref(props.devlog.description);
const truncated = ref(false);
watch(() => [props.devlog.description, props.trimDescription, expanded.value] as const, async ([source, max, isExpanded]) => {
    if (max === false || isExpanded) {
        description.value = source;
        truncated.value = false;
        return;
    }
    ({ text: description.value, truncated: truncated.value } = await limitMarkdown(source.trim(), max));
}, { immediate: true });

function open() {
    manager.open('devlog', { projectId: props.devlog.project.id, id: props.devlog.id });
}

// TODO: scroll the project viewer to this devlog when it exists
function more() {
    if (props.seeMore === 'expand') expanded.value = true;
    else manager.open('project', { id: props.devlog.project.id });
}
</script>

<template>
    <div class="feed-card">
        <a v-if="showProject" class="project" @click="manager.open('project', { id: devlog.project.id })">{{ devlog.project.title }}</a>

        <div class="title-row">
            <h2 class="feed-title">{{ devlog.title }}</h2>
            <span v-if="props.showAuthor" class="author">By {{ devlog.author.username }}</span>
            <span class="posted">&bull; posted {{ timeAgo(devlog.timestamp) }}</span>
        </div>

        <div class="feed-content">
            <div class="description">
                <Markdown>{{ description }}</Markdown>
            </div>
            <button v-if="truncated" class="see-more" @click="more">See more...</button>
            <Attachments :attachments="devlog.attachments" />
        </div>

        <div v-if="showOpen" class="footer">
            <button class="btn" @click="open">Open</button>
        </div>
    </div>
</template>

<style scoped>
.feed-card {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 6px 6px 8px;
    background: var(--color-bg-light);
    border: 1px solid var(--color-gray-light);
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 14px;

    .project {
        margin-left: 2px;
        font-size: 14px;
        color: var(--color-gray-medium);
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .title-row {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 6px;
        margin: 0 2px 4px;
    }

    .feed-title {
        overflow-wrap: anywhere;
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        font-family: inherit;
    }

    .author {
        font-size: 16px;
    }

    .posted {
        font-size: 14px;
    }

    .feed-content {
        overflow-wrap: anywhere;
        box-sizing: border-box;
        padding: 6px 7px 10px;
        background: var(--color-white);
        border: 1px solid var(--color-border-dark);

        p, .description :deep(p) {
            margin: 0 0 12px;
            font-size: 13px;
            line-height: 1.3;
            white-space: pre-line;
        }

        .see-more {
            display: block;
            margin: 0 0 4px;
            padding: 0;
            font-family: inherit;
            font-size: 15px;
            font-weight: 700;
            text-align: left;
            color: inherit;
            background: none;
            border: none;
            cursor: pointer;
        }

    }

    .footer {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 10px;
        padding: 0 2px;

        .btn {
            width: 98px;
        }

        &:empty {
            display: none;
        }
    }

    .logged {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
        font-size: 13px;
        white-space: nowrap;
    }

    .icon {
        width: 26px;
        height: 26px;
        object-fit: contain;
        flex-shrink: 0;
    }
}
</style>
