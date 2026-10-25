<script setup lang="ts">
import rigby from '~/assets/icons/rigby.png'
import badge from '~/assets/icons/badge.png'
import heart from '~/assets/icons/heart.png'
import comment from '~/assets/icons/comment.png'
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

const aboutText = 'My cat Rigby has been corrupted by the cruel evil and now he wants to destroy me so i am currently developing a very genius machine to suck out the evil within him'
const photoCaption = 'This is a photo of Rigby'

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

        <div class="header-bg">
                <button class="back-btn">&lt;</button>

                <div class="profile-card">
                    <img class="avatar" :src="rigby" alt="">
                    <div class="profile-info">
                        <h2>Restoring Rigby's faith from the evil <img class="badge" :src="badge" alt=""></h2>
                        <p>"This is a description look at me"</p>
                    </div>
                </div>
            </div>

    </div>
    <div class="spacer"></div>

<div class="about-page">
    <h2 class="heading">About</h2>

    <div class="panel about">
        <p class="about-text">{{ aboutText }}</p>
        <div class="photo-row">
            <img class="photo" :src="rigby" alt="">
            <span class="caption">{{ photoCaption }}</span>
        </div>
    </div>

    <h2 class="heading">Devlogs</h2>

    <div class="devlogs">
        <div v-for="devlog in devlogs" :key="devlog.id" class="devlog-card">
            <span class="project">{{ devlog.project }}</span>

            <div class="title-row">
                <h2 class="devlog-title">Devlog {{ devlog.number }}</h2>
                <span class="author">By {{ devlog.author }}</span>
                <span class="posted">&bull; {{ devlog.posted }}</span>
            </div>

            <div class="devlog-content">
                <p v-for="(text, i) in devlog.paragraphs" :key="i">{{ text }}</p>
                <button class="see-more">See more...</button>
                <img v-if="devlog.photo" class="devlog-photo" :src="devlog.photo" alt="">
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

.header {
    display: flex;
    flex-direction: column;
    font-family: 'Joan', serif;
}

.header-bg {
    position: relative;
    width: 100%;
    height: 110px;
    overflow: hidden;
}

.back-btn {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 30px;
    height: 30px;
    background: var(--color-white);
    border: 1px solid var(--color-gray-dark);
    font-weight: bold;
    cursor: pointer;
}

.profile-card {
    height: 90px;
    position: absolute;
    top: 8px;
    left: 40px;
    width: 330px;
    max-width: calc(100% - 48px);
    display: flex;
    gap: 12px;
    padding: 6px;
    background: var(--color-panel-bg);
    border: 1px solid var(--color-gray-medium);

    .avatar {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border: 1px solid var(--color-gray-dark);
        background: var(--color-gray-medium);
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;

        h2 {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 0;
            font-weight: 500;
            font-family: 'Joan', serif;
        }

        p {
            margin: 0 0 6px;
            font-size: 12px;
        }
    }
}

.badge {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}

.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.about-page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 4px 13px 14px;
    overflow-y: auto;
    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 15px;
    user-select: none;
}

.heading {
    flex-shrink: 0;
    margin: 0 0 6px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    font-family: 'Inter', 'Fira Sans', sans-serif;
}

.panel {
    box-sizing: border-box;
    flex-shrink: 0;
    background: var(--color-bg-light);
    border: 1px solid var(--color-border-dark);
}

.about {
    margin-bottom: 8px;
    padding: 8px;
}

.about-text {
    margin-top: 2px;
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.25;
}

.photo-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.photo {
    flex-shrink: 0;
    width: 86px;
    height: 86px;
    object-fit: cover;
    background: var(--color-bg-dark);
}

.caption {
    font-size: 14px;
}

.devlogs {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.devlog-card {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 6px 6px 8px;
    background: var(--color-bg-light);
    border: 1px solid var(--color-gray-light);
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

    .devlog-photo {
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