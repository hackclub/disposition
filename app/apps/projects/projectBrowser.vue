<script setup lang="ts">
import { ref } from 'vue'
import browser from '~/assets/icons/browser.png'
import heart from '~/assets/icons/heart.png'
import comment from '~/assets/icons/comment.png'
import badge from '~/assets/icons/badge.png'
import devlogPhoto from '~/assets/misc/devlog-photo.png'

interface Devlog {
    id: number
    project: string
    number: number
    author: string
    posted: string
    paragraphs: string[]
    likes: number
    comments: number
    hoursLogged: string
    photo?: string
}

const sortLabel = ref('Latest > Oldest')

function toggleSort() {
    sortLabel.value = sortLabel.value === 'Latest > Oldest' ? 'Latest < Oldest' : 'Latest > Oldest'
}

const devlogs: Devlog[] = [
    {
        id: 1,
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
    },
    {
        id: 2,
        project: 'Restoring Rigby\u2019s faith from the evil',
        number: 11,
        author: 'Username',
        posted: 'posted 2d ago',
        paragraphs: [
            'The evil machine is half built.',
            'I still need more cables.',
        ],
        likes: 12,
        comments: 4,
        hoursLogged: '20h Logged',
    },
]

const emit = defineEmits<{
    (e: 'open', id: number): void
}>()
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img :src="browser" alt="" class="logo" />

                <span>
                    <h2>Browse other projects</h2>
                    <p>All of the projects shown on Disposition</p>
                </span>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main">
            <div class="devlog-page">
                <div class="sort">
                    <button class="sort-btn" @click="toggleSort">{{ sortLabel }}</button>
                </div>

                <div v-for="devlog in devlogs" :key="devlog.id" class="card">
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
                        <button class="btn" @click="emit('open', devlog.id)">Open</button>

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
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.main {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.header {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    user-select: none;
}

.logo {
    width: 38px;
    height: 46px;
    filter: drop-shadow(0 0 0.2rem var(--color-black));
    margin: 10px;
}

.striped-bg {
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-left: 7px;
    gap: 2px;
    background: repeating-linear-gradient(
        0deg,
        var(--color-gray-light) 0px,
        var(--color-gray-light) 6px,
        var(--color-gray-medium) 6px,
        var(--color-gray-medium) 7px
    );
}

.striped-bg span {
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
}

.striped-bg span h2 {
    margin: 0;
    font-weight: normal;
    filter: drop-shadow(1px 1px 5px var(--color-black));
}

.striped-bg span p {
    margin: 0;
    font-weight: normal;
    filter: drop-shadow(1px 1px 5px var(--color-black));
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}

.devlog-page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    font-size: 14px;
}

.sort {
    flex-shrink: 0;
    margin-left: 12px;
}

.sort-btn {
    display: block;
    width: 148px;
    height: 20px;
    padding: 0;
    font-family: inherit;
    font-size: 14px;
    text-align: center;
    color: var(--color-black);
    background: var(--color-bg-light);
    border-color: var(--color-border-light);
    border-radius: 0 0 4px 4px;
    cursor: pointer;
    outline: none;
}

.card {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    box-sizing: border-box;
    margin: 8px 12px 4px;
    padding: 6px 6px 8px;
    background: var(--color-bg-light);
    border: 1px solid var(--color-gray-light);
}

.card:last-child {
    margin-bottom: 12px;
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
        font-size: 15px;
        font-weight: 700;
        text-align: left;
        color: inherit;
        background: none;
        border: none;
        cursor: pointer;
    }

    .photo {
        display: block;
        width: 148px;
        height: 129px;
        object-fit: cover;
        background: var(--color-panel-bg);
    }
}

.footer {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 10px;
    padding: 0 2px;
}

.btn {
    width: 126px;
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
    font-size: 14px;
    white-space: nowrap;
}

.icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
    flex-shrink: 0;
}
</style>