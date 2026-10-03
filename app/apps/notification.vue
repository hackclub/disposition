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
            filter: drop-shadow(1px 1px 5px #000000);
        }

        h2 {
            margin-left: 5px;
            font-weight: normal;
            filter: drop-shadow(1px 1px 5px #000000);
        }
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

.spacer {
    width: 100%;
    height: 12px;
    border: 1px solid #c6c6c4;
    background-color: #dedede;
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
        background-color: #F2F2F2;
        border: none;
        border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        user-select: none;
    }
}
 
.tab.active {
  background: #d0d0d0;
}
 
.notification {
  margin-bottom: 16px;
}
 
.notification-date {
  margin: 0 0 6px;
  font-weight: 700;
  font-size: 16px;
  color: #3c4f5c;
}
 
.notification-card {
  border: 1px solid #b7b7b5;
}
 
.notification-title {
  background: #c9c9c9;
  font-weight: 700;
  font-size: 17px;
  padding: 5px 6px;
}
 
.notification-body {
  background: #fff;
  padding: 12px;
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