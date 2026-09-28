<script setup lang="ts">
const { data: navigation } = await useAsyncData('nav', () =>
    queryCollectionNavigation('content')
)

const currentPath = ref('/getting-started/index')

const { data: home } = await useAsyncData(
    () => queryCollection('content').path(currentPath.value).first(),
    { watch: [currentPath] }
)

function selectArticle(path: string) {
    currentPath.value = path
}
</script>

<template>
    <div class="content">
        <div class="header">
            <div class="striped-bg">
                <img src="~/assets/logos/Docs.png" alt="DispoDocs Logo" class="logo" />
                <span>
                    <h2>DispoDocs</h2>
                    <p>a pretty boring documentation viewer</p>
                </span>
            </div>

            <div class="spacer"></div>
        </div>

        <div class="main">
            <div class="sidebar">
                <div class="category" v-for="cat in navigation" :key="cat.path">
                    <h3>{{ cat.title }}</h3>
                    <ul v-if="cat.children?.length">
                        <li v-for="article in cat.children" :key="article.path">
                            <a @click="selectArticle(article.path)" :class="{ active: currentPath === article.path }">
                                {{ article.title }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="divider"></div>

            <ContentRenderer v-if="home" :value="home" class="page" />
        </div>
    </div>
</template>

<style scoped>
.page {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
}

.main {
    margin: 0;
    padding: 0 10px 5px;

    display: flex;
    flex-direction: row;
    gap: 4px;

    width: 100%;
    flex: 1;
    min-height: 0;
}

.sidebar {
    flex: 0 0 300px;
    overflow-y: auto;

    h3 {
        background-color: #D9D9D9;
        padding: 2px;
    }

    a:hover {
        cursor: pointer;
        text-decoration: underline;
    }
}

.divider {
    flex: 0 0 2px;
    background-color: #D9D9D9;
}

.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.logo {
    width: 60px;
    height: 60px;

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
</style>