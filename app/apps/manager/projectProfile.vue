<script setup lang="ts">
import rigby from '~/assets/icons/rigby.png'
import badge from '~/assets/icons/badge.png'

const aboutText = 'My cat Rigby has been corrupted by the cruel evil and now he wants to destroy me so i am currently developing a very genius machine to suck out the evil within him'
const photoCaption = 'This is a photo of Rigby'

const devlogs = [1, 2, 3, 4, 5]

</script>

<template>
<div class="content">
    <div class="header">

        <div class="header-bg">
                <img src="" alt="">

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
        <div v-for="n in devlogs" :key="n" class="panel devlog"></div>
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

.devlog {
    height: 84px;
}




</style>