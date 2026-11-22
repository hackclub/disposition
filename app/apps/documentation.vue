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
                <img src="~/assets/logos/notes.png" alt="DispoDocs Logo" class="logo" />
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

            <ContentRenderer v-if="home" :value="home" class="page" />
        </div>
    </div>
</template>

<style scoped>
.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.main {
    margin: 0;
    padding: 10px 12px 14px;

    display: flex;
    flex-direction: row;
    gap: 10px;

    width: 100%;
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
}

.sidebar {
    flex: 0 0 300px;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 10px 12px;

    background: var(--color-bg-light);
    border: 2px solid var(--color-border-dark);
    box-shadow: 4px 4px 0 var(--color-shadow-dark);

    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 14px;
    user-select: none;

    h3 {
        margin: 0 0 6px;
        padding: 3px 6px;
        font-size: 14px;
        background-color: var(--color-panel-bg);
        border-bottom: 1px solid var(--color-border-light);
    }

    ul {
        margin: 0 0 12px;
        padding: 0;
        list-style: none;
    }

    li + li {
        margin-top: 2px;
    }

    a {
        display: block;
        padding: 3px 6px;
        cursor: pointer;

        &:hover {
            background-color: var(--color-panel-bg);
            text-decoration: underline;
        }

        &.active {
            font-weight: bold;
            background-color: var(--color-panel-bg);
        }
    }
}

.page {
    flex: 1;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 14px 18px;

    background: var(--color-bg-light);
    border: 2px solid var(--color-border-dark);
    box-shadow: 4px 4px 0 var(--color-shadow-dark);

    font-family: 'Inter', 'Fira Sans', sans-serif;
    font-size: 15px;
    line-height: 1.45;
}

.page :deep(h1),
.page :deep(h2),
.page :deep(h3) {
    font-family: 'Joan', serif;
    line-height: 1.2;
    margin: 16px 0 8px;
}

.page :deep(h1:first-child),
.page :deep(h2:first-child),
.page :deep(h3:first-child) {
    margin-top: 0;
}

.page :deep(h1) {
    font-size: 24px;
}

.page :deep(h2) {
    font-size: 20px;
}

.page :deep(h3) {
    font-size: 17px;
}

.page :deep(p) {
    margin: 0 0 10px;
}

.page :deep(a) {
    color: inherit;
    text-decoration: underline;
}

.page :deep(ul),
.page :deep(ol) {
    margin: 0 0 10px;
    padding-left: 22px;
}

.page :deep(li) {
    margin-bottom: 4px;
}

.page :deep(img) {
    max-width: 100%;
    height: auto;
    border: 2px solid var(--color-border-dark);
    box-shadow: 4px 4px 0 var(--color-shadow-dark);
}

.page :deep(pre) {
    overflow-x: auto;
    padding: 10px;
    background: var(--color-panel-bg);
    border: 1px solid var(--color-border-dark);
}

.logo {
    width: 60px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem var(--color-black));
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
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }

        p {
            margin: 0;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }
    }

    width: 100%;

    background: repeating-linear-gradient(0deg,
        var(--color-gray-light) 0px,
        var(--color-gray-light) 6px,
        var(--color-gray-medium) 6px,
        var(--color-gray-medium) 7px);
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
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
    box-sizing: border-box;
}
</style>
