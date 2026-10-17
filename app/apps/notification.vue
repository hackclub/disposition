<script setup lang="ts">
import { ref } from 'vue'
 
interface AppNotification {
  date: string
  title: string
  body: string
  seeMore?: boolean
}
 
const activeTab = ref<'global' | 'private'>('global')
const expanded = ref<Record<number, boolean>>({})
 
function toggleExpanded(i: number) {
  expanded.value[i] = !expanded.value[i]
}
 
const notifications: AppNotification[] = [
  {
    date: 'Date',
    title: 'Title1',
    body: 'Description 1 2 3 4 5 ',
  },
  {
    date: 'Date2',
    title: 'Title2',
    body: 'description',
    },
]
</script>
 
<template>
  <div class="header">
            <div class="striped-bg">
                <span>
                    <h2>Notifications</h2>
                </span>
            </div>
             <div class="tabs">
                <button>Global</button>
                <button>Private</button>
            </div>
            <div class="spacer"></div>
            </div>
           
  <div class="notifications" >
    <div class="notification" v-for="(notification, i) in notifications" :key="i">
      <p class="notification-date">{{ notification.date }}</p>
      <div class="notification-card">
        <div class="notification-title">{{ notification.title }}</div>
        <div class="notification-body">
          <div class="notification-text" :class="{ clamped: notification.seeMore && !expanded[i] }">
            <p v-for="(line, j) in notification.body.split('\n\n')" :key="j">{{ line }}</p>
          </div>
          <a v-if="notification.seeMore" href="#" class="see-more" @click.prevent="toggleExpanded(i)">
            {{ expanded[i] ? 'See less' : 'See more...' }}
          </a>
        </div>
      </div>
    </div>
    </div>
</template>
 
<style scoped>

.striped-bg {
    width: 100%;
    height: 60px;

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
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }

        h2 {
            margin-left: 5px;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px var(--color-black));
        }
    }
}


.logo {
    width: 25px;
    height: 60px;

    filter: drop-shadow(0 0 0.2rem var(--color-black));
}


.header {
    background: repeating-linear-gradient(0deg,
            var(--color-gray-light) 0px,
            var(--color-gray-light) 6px,
            var(--color-gray-medium) 6px,
            var(--color-gray-medium) 7px);

    display: flex;
    flex-direction: column;

    h2 {
        font-weight: normal;
    }

    font-family: 'Joan',
    serif;
    user-select: none;
    
}

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-panel-bg);
}


.notifications {
  max-width: 400px;
  margin: 0 auto;
  background-color: 0, 0, 0, 0;
  padding: 10px;
}
 
.tabs {
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding-left: 5px;

    button {
        background-color: var(--color-bg-light);
        border: none;
        border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        user-select: none;
    }
}
 
.tab.active {
  background: var(--color-tab-active);
}
 
.notification {
  margin-bottom: 10px;
}
 
.notification-date {
  margin: 0 0 2px;
  font-weight: 700;
<<<<<<< HEAD
  font-size: 15px;
  color: #525252;
}
 
.notification-card {
  border: 1px solid #8E8F90;
}
 
.notification-title {
  background: #E6E6E6;
  color: #333333;
  font-weight: 600;
  font-size: 15px;
=======
  font-size: 16px;
  color: var(--color-notif-date);
}
 
.notification-card {
  border: 1px solid var(--color-notif-border);
}
 
.notification-title {
  background: var(--color-notif-title-bg);
  font-weight: 700;
  font-size: 17px;
>>>>>>> 83d94802d37b32497a2b0f364d5a4b4af6afc057
  padding: 5px 6px;
}
 
.notification-body {
<<<<<<< HEAD
  background: #fff;
  padding-bottom: 5px;
  padding-left: 2px;
  padding-top: 2px;
=======
  background: var(--color-white);
  padding: 12px;
>>>>>>> 83d94802d37b32497a2b0f364d5a4b4af6afc057
}
 
.notification-body p {
  margin: 0 0 12px;
  font-size: 16px;
  line-height: 1.3;
}
 
.notification-body p:last-of-type {
  margin-bottom: 0;
}

 
</style>