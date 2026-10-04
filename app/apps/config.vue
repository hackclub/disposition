<script setup lang="ts">
const currentTab = ref('general');

const { read, write } = useConfiguration("settings");

function save(key: string, value: any) {
    write(key, value);
}

const showBuddy = ref(read("showBuddy"));

// wallpaper stuff //
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

function pickFile() {
    fileInput.value?.click();
}

function onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) handleImageFile(file);
}

function onDrop(e: DragEvent) {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) handleImageFile(file);
}

function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
        alert("Not an image file :(");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        save("wallpaperSource", reader.result as string); // this IS the base64 data URL
    };
    reader.readAsDataURL(file);
}
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/Config.png" alt="DispoConfig Logo" class="logo" />
                <span>
                    <h2>DispoConfig</h2>
                    <p>Push all the buttons you want!</p>
                </span>
            </div>

            <div class="tabs">
                <button @click="currentTab = 'general'">General</button>
                <button @click="currentTab = 'appearance'">Appearance</button>
            </div>
            <div class="spacer"></div>
        </div>

        <div class="main">
            <div v-if="currentTab == 'general'">
                <label>
                    <input type="checkbox" v-model="showBuddy" @change="save('showBuddy', showBuddy)" />
                    Show desktop buddy
                </label>
            </div>

            <div v-if="currentTab == 'appearance'">
                <!-- here i somehow give the user the ability to change the wallpaper :sob: -->

                <span class="wallpaper">
                    <h2>Wallpaper</h2>
                    <p>Add a little spark to your desktop when browsing through Disposition :)</p>

                    <button v-if="read('wallpaperSource') != '/wallpaper/default.png'" @click="write('wallpaperSource', '/wallpaper/default.png')">Restore default wallpaper</button>

                    <button @click="pickFile">Upload from files</button>
                    <input ref="fileInput" type="file" accept="image/*" style="display: none"
                        @change="onFileSelected" />

                    <div class="drag-and-drop" :class="{ dragging: isDragging }" @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false" @drop.prevent="onDrop">
                        <p>Or drag and drop your image in here</p>
                    </div>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    padding: 10px;
}

.wallpaper {
    display: flex;
    flex-direction: column;
    gap: 7px;

    h2 {
        margin: 0;
    }

    p {
        margin: 0;
    }
}

.drag-and-drop {
    background-color: #F2F2F2;
    border: 1px solid #7B7B7B;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 100px;

    p {
        color: #AEAEAE;
    }

    user-select: none;
}

.tabs {
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding-left: 5px;

    button {
        background-color: #F2F2F2;
        border: none;
        border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        user-select: none;
    }
}

.logo {
    width: 25px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem black);
}

.header {
    background: repeating-linear-gradient(0deg,
            #d7d7d7 0px,
            #d7d7d7 6px,
            #9f9f9f 6px,
            #9f9f9f 7px);

    display: flex;
    flex-direction: column;

    h2 {
        font-weight: normal;
    }

    font-family: 'Joan',
    serif;
    user-select: none;
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

    span {
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: column;

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px #000000);
        }

        h2 {
            margin: 0;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px #000000);
        }
    }
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