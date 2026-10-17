<script setup lang="ts">
import { ref } from 'vue'
import { string } from 'zod'
import megaphone from '~/assets/icons/megaphone.png'

const message = ref('')
const days = ref<number | null>(null)
const hours = ref<number | null>(null)
const minutes = ref<number | null>(null)
const schedule = ref('')

const emit = defineEmits<{
    (e: 'submit', payload: {
        message: string
        timer: { days: number; hours: number; minutes: number; }
        schedule: string
    }): void
}>()

function submit() {
    emit('submit', {
        message: message.value,
        timer: {
            days: days.value ?? 0,
            hours: hours.value ?? 0,
            minutes: minutes.value ?? 0,
        },
        schedule: schedule.value
    })
}

</script>

<template>
<div class="content">

    <div class="announce">
        <div class="top">
            <h1>Announcing Panel</h1>
            <img class="icon" :src="megaphone" alt="">

        </div>

        <label class="label" for="announce-message">Send a global announcement across the platform</label>
        <textarea id="announce-message" v-model="message" class="message"></textarea>

        <span class="label">Include a timer (optional)</span>
        <div class="timer">
            <div class="timer-field">
                <input v-model.number="days" type="number" min="0">
                <span>Days</span>
            </div>

            <div class="timer-field">
                <input v-model.number="hours" type="number" min="0">
                <span>Hours</span>
            </div>

            <div class="timer-field">
                <input v-model.number="minutes" type="number" min="0">
                <span>Minutes</span>
            </div>
        </div>

        <span class="label">Schedule this announcement (optional) </span>
        <textarea v-model="schedule" class="schedule"></textarea>

        <button class="submit" @click="submit">Submit</button>
    </div>
</div>
</template>

<style scoped>
.content {
    display: flex;
  flex-direction: column;
}


.announce {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 10px 14px;
    overflow-y: auto;
    font-family: 'Fira Sans' sans-serif;
    font-size: 13px;
    user-select: none;
}

.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 18px 20px 14px;

    h1 {
        margin: 0;
        font-size: 33px;
        font-weight: 700;
        white-space: nowrap;
    }

    .icon {
    width: 65px;
    height: 80px;
    object-fit: contain;
    flex-shrink: 0;
    }

}

.label {
    display: block;
    flex-shrink: 0;
    margin: 0 0 4px;
    font-weight: 700;
}

.message {
    box-sizing: border-box;
    flex: 1 1 158px;
    min-height: 80px;
    width: 100%;
    margin: 0 0 14px;
    padding: 6px 7px;
    font-family: inherit;
    font-size: 13px;
    color: black;
    background: white;
    border: 1px solid gray;
    border-radius: 0;
    outline: none;
    resize: none;
}

.timer {
    display: flex;
    flex-shrink: 0;
    gap: 7px;
    margin-bottom: 12px;
}

.timer-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 41px;
    font-size: 12px;

    input {
        box-sizing: border-box;
        width: 41px;
        height: 19px;
        padding: 0 3px;
        font-family: inherit;
        font-size: 12px;
        color: #111;
        background: white;
        border: 1px solid gray;
        border-radius: 0;
        outline: none;
        -moz-appearance: textfield;
        appearance: textfield;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    span {
        margin-top: 2px;
        white-space: nowrap;
    }
}

.schedule {
    overflow-y: hidden;
    box-sizing: border-box;
    flex-shrink: 0; 
    width: 191px;
    height: 25px;
    margin: 0 0 20px;
    padding: 6px 7px;
    font-family: inherit;
    font-size: 13px;
    color: #111; 
    background: white;
    border: 1px solid gray;
    border-radius: 0;
    outline: none;
    resize: none;
}

.message:focus,
.schedule:focus,
.time-field input:focus {
    border-color: #333;
}

.submit {
    width: 200px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 5px;

    button {
        width: 100px;
        text-align: center;
    }
}
</style>