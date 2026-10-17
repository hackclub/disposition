<script setup lang="ts">
import badge from '../assets/icons/badge.jpg'

interface Project {
  image?: string
  title: string
  hoursLogged: string
}

const projects: Project[] = [
  {
    title: 'Project title 101',
    hoursLogged: '0h Logged',
  },
]
</script>

<template>
  <div class="content">
    <div class="header">
      <div class="striped-bg">
        <img
          src="https://i.pinimg.com/736x/69/41/5f/69415f56cbf7fdd899e48c1dd316be44.jpg"
          alt="DispoManager Logo"
          class="logo"
        />
        <span>
          <h2>DispoManager</h2>
          <p>a ysws project based manager and browser</p>
        </span>
      </div>

      <div class="spacer"></div>
    </div>
    <div class="main">
      <div class="projects-page" >
        <h1 class="page-title">Your Projects</h1>

        <div class="projects-panel">
          <div class="project-row" v-for="(project, i) in projects" :key="i">
            <div
              class="project-thumb"
              :style="project.image ? { backgroundImage: `url(${project.image})` } : {}"
            />
            <div class="project-main">
              <h2 class="project-title">{{ project.title }}</h2>
            </div>

            <div class="project-actions">
              <button class="button">Open</button>
              <button class="button">Edit</button>
              <span class="logged-time">{{ project.hoursLogged }}</span>
              <img class="logged-icon" :src="badge" alt=""/>
            </div>
          </div>
        </div>
        </div>
        <div class="user-bar">
          <div class="user-info">
            <div class="user-avatar" />
            <span>Logged in as Username</span>
          </div>
          <button class="button">Open Profile</button>
        </div>
      </div>
     
  </div>
</template>

<style scoped>
.projects-page {
  max-width: 1000px;
  margin: 0 0;
  height: 440px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: white;
  overflow-y: scroll;
}

.page-title {
  height: 50px;
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin: 5px;
  
}

.projects-panel {
  box-sizing: border-box;
  border: 1px solid var(--color-gray-medium);
  background: var(--color-white);
  padding: 15px 20px;
  width: 100%;
  min-width: 50px;
}

.project-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  grid-template-areas:
    "thumb title"
    "actions actions";
  gap: 10px 14px;
  align-items: start;
}

.project-thumb {
  grid-area: thumb;
  width: 90px;
  height: 90px;
  background-color: var(--color-gray-medium);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--color-gray-medium);
}

.project-main {
  grid-area: title;
}

.project-title {
  margin: 0;
  text-align: center;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.25;
}

.project-actions {
  grid-area: actions;
  display: flex;
  align-items: center;
  gap: 10px;
}

.project-actions .button {
  flex: 1;
}

.logged-time {
  font-size: 14px;
  white-space: nowrap;
}

.logged-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.user-bar {
  margin-top: auto;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background-color: var(--color-gray-medium);
}

.main {
  display: flex;
  flex-direction: column;
  gap: 10px;

}

.tabs {
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding-left: 5px;
}

.tabs button {
  background-color: var(--color-bg-light);
  border: none;
  border-radius: 0;
  user-select: none;
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.buttons button {
  width: 100px;
}

.logo {
  width: 83px;
  height: 46px;
  filter: drop-shadow(0 0 0.2rem var(--color-black));
  margin: 10px;
}

.header {
  display: flex;
  flex-direction: column;
  font-family: 'Joan', serif;
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

.content {
  display: flex;
  flex-direction: column;
}
</style>