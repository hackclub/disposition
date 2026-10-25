<script setup lang="ts">
import { ref } from 'vue'
import heart from '~/assets/icons/heart.png'
import comment from '~/assets/icons/comment.png'
import badge from '~/assets/icons/badge.png'
import devlogPhoto from '~/assets/misc/devlog-photo.png'
import avatar from '~/assets/misc/avatar.png'

interface Comment {
    id: number
    author: string
    posted: string
    text: string
    avatar?: string
}

const devlog = {
    project: 'Restoring Rigby\u2019s faith from the evil',
    number: 12,
    author: 'Username',
    posted: 'posted 5h ago',
    paragraphs: [
        'I HAVE FINALLY FOUND THE CURE TO THE EVIL THAT CORRUPTS RIGBY I CAN FINALLY FREE HIM!',
        'Here\u2019s a photo of it.',
        'It\u2019s another cat. He\u2019s able to pulverize all the evil within Rigby.',
        'i paid him 2 dollars and 1 peggle',
    ],
    likes: -2003,
    comments: 103,
    hoursLogged: '28h Logged',
    photo: devlogPhoto,
}

const comments: Comment[] = [
    {
        id: 1,
        author: 'xXLickerXx_01',
        posted: 'posted 1h ago',
        text: 'Bro shut up you corny ahh dude. You\u2019re just clickbaiting for golden badge yo cat ain\u2019t possesed bruh',
        avatar: avatar,
    },
    {
        id: 2,
        author: 'Le_Carlo_yurrr',
        posted: 'posted 1h ago',
        text: 'Bruuuuuhh this is so AI slop bruhhhh take this down!!!!!',
        avatar: avatar,
    },  
]

const newComment = ref('')

const emit = defineEmits<{
    (e: 'open'): void
    (e: 'post', text: string): void
}>()

function post() {
    emit('post', newComment.value)
}
</script>

<template>
    <div class="devlog-view">
        <div class="card">
            <span class="project">{{ devlog.project }}</span>

            <div class="title-row">
                <h2 class="devlog-title">Devlog {{ devlog.number }}</h2>
                <span class="author">By {{ devlog.author }}</span>
                <span class="posted">&bull; {{ devlog.posted }}</span>
            </div>

            <div class="devlog-content">
                <p v-for="(text, i) in devlog.paragraphs" :key="i">{{ text }}</p>
                <button class="see-more">See more...</button>
                <img v-if="devlog.photo" class="photo" :src="devlog.photo" alt="">
            </div>

            <div class="footer">
                <button class="btn" @click="emit('open')">Open</button>

                <span class="stat">
                    <img class="icon" :src="heart" alt="">
                    {{ devlog.likes }}
                </span>

                <span class="stat">
                    <img class="icon" :src="comment" alt="">
                    {{ devlog.comments }}
                </span>

                <span class="logged">
                    {{ devlog.hoursLogged }}
                    <img class="icon" :src="badge" alt="">
                </span>
            </div>
        </div>

        <div class="write">
            <textarea v-model="newComment" class="field" placeholder="Write a comment for this devlog"></textarea>
            <button class="btn post" @click="post">Post</button>
        </div>

        <div class="comments">
            <div v-for="c in comments" :key="c.id" class="comment">
                <div class="comment-head">
                    <img v-if="c.avatar" class="comment-avatar" :src="c.avatar" alt="">
                    <div v-else class="comment-avatar"></div>
                    <span class="comment-author">{{ c.author }}</span>
                    <span class="comment-posted">&bull; {{ c.posted }}</span>
                </div>
                <div class="comment-body">{{ c.text }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.devlog-view {
    background: var(--color-bg-dark);
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

.card {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.project {
    margin-left: 2px;
    font-size: 14px;
    color: var(--color-gray-medium);
}

.title-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 0 2px 4px;
}

.devlog-title {
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

.devlog-content {
    box-sizing: border-box;
    padding: 6px 7px 10px;
    background: var(--color-white);
    border: 1px solid var(--color-border-dark);

        p {
            margin: 0 0 12px;
            font-size: 13px;
            line-height: 1.3;
        }

        .see-more {
            display: block;
            margin: 0 0 4px;
            padding: 0;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            text-align: left;
            color: inherit;
            background: none;
            border: none;
            cursor: pointer;
        }

        .photo {
            display: block;
            width: 115px;
            height: 101px;
            object-fit: cover;
            background: var(--color-panel-bg)
        }
}

.footer {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 8px;
    padding: 0 2px;
}

.btn {
    width: 98px;
}

.stat {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 14px;
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

</style>