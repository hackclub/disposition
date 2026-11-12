<script setup lang="ts">
import { ref } from 'vue'
import avatar from '~/assets/misc/avatar.png'
import type { WindowInstance } from '~/types/window'
import Devlog from '~/components/cards/devlog.vue'
import type { DevlogComment, ServerDevlog } from '~/types/database'

const props = defineProps<{ instance: WindowInstance, projectId: number, id: number }>();
const manager = useWindowManager();
const session = useUserSession();
const admin = await isAdmin();

const base = `/api/projects/${props.projectId}/devlogs/${props.id}`;
const { data: devlog, error } = await useFetch<ServerDevlog>(base);
const { data: comments, refresh: refreshComments } = await useFetch<DevlogComment[]>(`${base}/comments`, { default: () => [] });

if (devlog.value) {
    const win = manager.get(props.instance.id);
    if (win) win.title = `${devlog.value.project.title} | ${devlog.value.title}`;
}

const avatars = ref<Record<string, string>>({});
watch(comments, async list => {
    const missing = [...new Set(list.map(c => c.user.slackId))].filter(id => !(id in avatars.value));
    await Promise.all(missing.map(async slackId => {
        avatars.value[slackId] = await getUserInfo(slackId).then(info => info.imageUrl || avatar).catch(() => avatar);
    }));
}, { immediate: true });

const newComment = ref('')
const posting = ref(false)

async function post() {
    if (!newComment.value.trim()) return;
    posting.value = true;
    try {
        const data = new FormData();
        data.append("content", newComment.value);
        await $fetch(`${base}/comments`, { method: "POST", body: data });
        newComment.value = '';
        await refreshComments();
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Couldn't post your comment", { error: true });
    } finally {
        posting.value = false;
    }
}

function deleteComment(comment: DevlogComment) {
    manager.dialogBox("Delete comment?", "Do you want to delete this comment? This cannot be undone.", async (result: boolean) => {
        if (!result) return;
        try {
            await $fetch(`${base}/comments/${comment.id}`, { method: "DELETE" });
            await refreshComments();
        } catch (e: any) {
            manager.messageBox("Error!", e.data?.message ?? "Couldn't delete the comment", { error: true });
        }
    }, { question: true });
}
</script>

<template>
    <div class="devlog-view">
        <p v-if="error || !devlog" class="empty">Couldn't load this devlog :(</p>

        <template v-else>
            <Devlog :devlog="{ ...devlog, author: devlog.user }"
                :trim-description="false" :show-open="false" />

            <div class="write">
                <textarea v-model="newComment" class="field" placeholder="Write a comment for this devlog" maxlength="2000"></textarea>
                <button class="btn post" :disabled="posting || !newComment.trim()" @click="post">Post</button>
            </div>

            <div class="comments">
                <p v-if="comments.length === 0" class="empty">No comments yet. Be the first!</p>
                <div v-for="c in comments" :key="c.id" class="comment">
                    <div class="comment-head">
                        <img class="comment-avatar" :src="avatars[c.user.slackId] ?? avatar" alt="">
                        <a class="comment-author" @click="manager.open('profile', { id: c.user.hcaId })">{{ c.user.username }}</a>
                        <span class="comment-posted">&bull; posted {{ timeAgo(c.timestamp) }}</span>
                        <button v-if="admin || session.user.value?.id === c.user.hcaId" class="delete" @click="deleteComment(c)">Delete</button>
                    </div>
                    <div class="comment-body">{{ c.content }}</div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.devlog-view {
    background: var(--color-bg-light);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 6px 7px 12px;
    overflow-y: auto;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 14px;
    user-select: none;
}


.write {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    flex-shrink: 0;
    margin-top: 8px;

    .field {
        box-sizing: border-box;
        display: block;
        width: 100%;
        height: 29px;
        margin: 0;
        padding: 4px 6px;
        font-family: inherit;
        font-size: 12px;
        color: var(--color-gray-900);
        background: var(--color-bg-light);
        border: 1px solid var(--color-gray-dark);
        border-radius: 0;
        outline: none;
        resize: none;
    }

    .field::placeholder {
        color: var(--color-gray-muted);
    }

    .field:focus {
        border-color: var(--color-gray-800);
    }

    .post{
        width: 97px;
    }
}

.comments {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
    margin-top: 8px;
}

.comment-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.comment-avatar {
    width: 25px;
    height: 25px;
    flex-shrink: 0;
    object-fit: cover;
    background: var(--color-gray-medium);
}

.comment-author {
    font-size: 15px;
}

.comment-posted {
    font-size: 12px;
}

.comment-body {
    box-sizing: border-box;
    min-height: 49px;
    padding: 6px 7px;
    font-size: 13px;
    line-height: 1.3;
    background: var(--color-white);
    border: 1px solid var(--color-border-dark);
}

.empty {
    margin: 8px 0;
    text-align: center;
}

.comment-author {
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

.delete {
    margin-left: auto;
    font-size: 12px;
}

.comment-body {
    white-space: pre-line;
}
</style>
