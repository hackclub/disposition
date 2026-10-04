<script setup lang="ts">
import { ref } from 'vue'
import badge from '~app/assets/icons/badge.jpg'

const activeTab =ref<'about' | 'projects'>('projects')

const avatar = '~/apps/assets/icons/avatar'

</script>

<template>
    <div class="content">
        <div class="header">
            <div class="header-bg">
                <img src="https://media.discordapp.net/attachments/1110811784190906430/1556240400707100702/image_24_1.png?backend=b2&ex=6ac37151&is=6ac21fd1&hm=81e443e13da94bad8bc253640f876cb517c8d8776d8e0265fb102fca85a9801d&=&format=webp&quality=lossless&width=512&height=144">

                <button class="back-btn"> < </button>

                <div class="profile-card">
                    <img class="avatar" :src="avatar">
                </div>
            </div>
            <div class="spacer"></div>
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
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;

        h2 { margin: 0; font-weight: 500; font-family: 'Joan', serif; }
        p  { margin: 0 0 6px; font-size: 12px; }
    }
}

.sticker {
    width: 20px;
    height: 20px;
    vertical-align: middle;
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
        border: 1px solid #9f9f9f;
        border-bottom: none;
        cursor: pointer;

        &.active { background: #fff; }
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

.btn {
    background: linear-gradient(#fafafa, #dcdcdc);
    border: 1px solid #aaa;
    border-radius: 3px;
    padding: 2px 14px;
    cursor: pointer;
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

    .thumb { grid-area: thumb; width: 72px; height: 72px; object-fit: cover; }

    .project-title {
        grid-area: title;
        text-align: center;
        h3 { margin: 0; font-size: 18px; }
        p  { margin: 0; }
    }

    .project-footer {
        grid-area: footer;
        display: flex;
        align-items: center;
        gap: 6px;

        .open { flex: 1; }
        .logged { font-size: 13px; white-space: nowrap; }
    }
}
</style>