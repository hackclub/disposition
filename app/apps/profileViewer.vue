<script setup lang="ts">
import { ref } from 'vue'
import badge from '../assets/icons/badge.jpg'
import avatar from '../assets/icons/avatar.png'
import projectImage from '../assets/icons/project.jpg'

const activeTab = ref<'about' | 'projects'>('projects')
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="header-bg">
                <img src="https://media.discordapp.net/attachments/1110811784190906430/1556240400707100702/image_24_1.png?backend=b2&ex=6ac37151&is=6ac21fd1&hm=81e443e13da94bad8bc253640f876cb517c8d8776d8e0265fb102fca85a9801d&=&format=webp&quality=lossless&width=512&height=144" alt="">

                <button class="back-btn">&lt;</button>

                <div class="profile-card">
                    <img class="avatar" :src="avatar" alt="">
                    <div class="profile-info">
                        <h2>Username <img class="badge" :src="badge" alt=""></h2>
                        <p>"This is a bio look at me"</p>
                        <button class="btn">Edit profile</button>
                    </div>
                </div>

                <div class="tabs">
                    <button :class="{ active: activeTab === 'about' }" @click="activeTab = 'about'">About</button>
                    <button :class="{ active: activeTab === 'projects' }" @click="activeTab = 'projects'">Projects</button>
                </div>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main" v-if="activeTab === 'projects'">
            <h2 class="section-title">User's Projects</h2>

            <div class="project-card">
                <img class="thumb" :src="projectImage" alt="">
                <div class="project-title">
                    <h3>Project title</h3>
                    <p>By Username</p>
                </div>
                <div class="project-footer">
                    <button class="btn open">Open</button>
                    <span class="logged">28h Logged <img class="badge" :src="badge" alt=""></span>
                </div>
            </div>
        </div>

        <div class="main" v-else>
            <h2 class="section-title">User's About</h2>
            <p>About content here.</p>
            <p> Shii i'm going INSANE with this fuhhh ahhh third space shii :Sob emoji:</p>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    font-family: 'Fira Sans', sans-serif;
    user-select: none;
}

.header {
    display: flex;
    flex-direction: column;
    font-family: 'Joan', serif;
}

.header-bg {
    position: relative;
    width: 100%;
    height: 150px;
    overflow: hidden;

    > img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        display: block;
    }
}

.back-btn {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 30px;
    height: 30px;
    background: #fff;
    border: 1px solid #888;
    font-weight: bold;
    cursor: pointer;
}

.profile-card {
    position: absolute;
    top: 8px;
    left: 40px;
    width: 330px;
    max-width: calc(100% - 48px);
    display: flex;
    gap: 12px;
    padding: 6px;
    background: #e3e3e3;
    border: 1px solid #9f9f9f;

    .avatar {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border: 1px solid #777;
        background: #9f9f9f;
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
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
}

.tabs {
    position: absolute;
    left: 10px;
    bottom: 0;
    display: flex;
    gap: 6px;

    button {
        width: 90px;
        height: 18px;
        font-size: 12px;
        background: #f4f4f4;
        border-bottom: none;
        cursor: pointer;
        border: none;
        border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        user-select: none;

        &.active {
            background: #fff;
        }
    }
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid #c6c6c4;
    background-color: #dedede;
    box-sizing: border-box;
}

.main {
    padding: 10px;
}

.section-title {
    text-align: center;
    margin: 0 0 10px;
}

.buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;

    flex-grow: 1;
}

.project-card {
    display: grid;
    grid-template-columns: 72px 1fr;
    grid-template-areas:
        "thumb title"
        "footer footer";
    gap: 6px 12px;
    padding: 10px;
    background: #e8e8e8;
    border: 1px solid #9f9f9f;

    .thumb {
        grid-area: thumb;
        width: 72px;
        height: 72px;
        object-fit: cover;
        background: #9f9f9f;
    }

    .project-title {
        grid-area: title;
        text-align: center;

        h3 {
            margin: 0;
            font-size: 18px;
        }

        p {
            margin: 0;
        }
    }

    .project-footer {
        grid-area: footer;
        display: flex;
        align-items: center;
        gap: 6px;

        .open {
            flex: 1;
        }

        .logged {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            white-space: nowrap;
        }
    }
}
</style>