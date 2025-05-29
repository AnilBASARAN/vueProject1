<script setup lang="ts">
import { onBeforeUnmount, ref, computed } from 'vue'
import { horseColors, horseNames, horseImages } from '../constants/horseConstants'
import { backgroundImagesForRounds } from '../constants/backgroundConstants'
import { initializeHorses, shuffleArray } from '../helpers/utils'
import type { Horse } from '../models/horse'
import { useStore } from 'vuex'
import Results from './Results.vue'
import HorseList from './HorseList.vue'
import ContainerButton from './ContainerButton.vue'
import '../assets/main.css'

// Props
const props = defineProps<{
  onFinish: (horse: Horse[]) => void
}>()

// State
const finishedHorses = ref<Horse[]>([])
const tenHorses = ref<Horse[]>([])
const isStarted = ref(false)

const store = useStore()
// 0-based round index from Vuex
const round = computed(() => store.state.round)

let intervalId: number | undefined

// initialize full pool
const horses = initializeHorses()

// Only horses still moving show up
const activeHorses = computed(() => tenHorses.value.filter((h) => h.speed > 0))

function moveHorses() {
  isStarted.value = true

  for (const horse of tenHorses.value) {
    if (horse.speed === 0) continue

    horse.position += horse.speed
    const finishLine = window.innerWidth * 0.5

    if (horse.position >= finishLine) {
      horse.position = finishLine + 20
      horse.speed = 0
      finishedHorses.value.push(horse)
    }
  }

  // when none remain active, finish up
  if (activeHorses.value.length === 0) {
    clearInterval(intervalId)
    store.commit('setResults', finishedHorses.value)
    store.commit('setShowResults', true)
    setTimeout(() => {
      props.onFinish(finishedHorses.value)
      isStarted.value = false
    }, 2000)
  }
}

function startRace() {
  finishedHorses.value = []
  tenHorses.value = shuffleArray(horses).slice(0, 10)
  intervalId = window.setInterval(moveHorses, 100)
}

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div
    class="horse-container"
    :style="{ backgroundImage: `url(${backgroundImagesForRounds[round]})` }"
  >
    <Results />
    <HorseList :horses="horses" />

    <!-- only active horses animate -->
    <div
      v-for="horse in activeHorses"
      :key="horse.id"
      class="gif-wrapper"
      :style="{ transform: `translateX(${horse.position}px)` }"
    >
      <img :src="horse.image" :alt="horse.name" width="70" height="70" />
    </div>

    <div class="fotofinish">
      <div class="header-foto">
        <h5>Round: {{ round + 1 }}</h5>
        <h5>{{ 1200 + round * 200 }} meters</h5>
      </div>

      <h3 :style="{ margin: '15px' }">Foto Finish</h3>
      <ul>
        <li v-for="(horse, i) in finishedHorses" :key="horse.id">{{ i + 1 }}. {{ horse.name }}</li>
      </ul>

      <div v-if="!isStarted">
        <ContainerButton :onPress="startRace" title="Start" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.horse-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100vw;
  height: 100vh;
  background-color: blue;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.gif-wrapper {
  position: relative;
  display: flex;
  transition: transform 0.1s linear;
  margin-bottom: 5px;
  will-change: transform;
  z-index: 1;
}
.header-foto {
  padding: 20px;
  margin: 20px;
  display: inline-block;
  color: #222;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.fotofinish {
  position: absolute;
  top: 10px;
  right: 200px;

  padding: 10px;
  border-radius: 5px;
  width: 250px;
  color: black;
  font-family: Arial, sans-serif;
}

.leaderboard {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  width: 250px;
  color: black;
  font-family: Arial, sans-serif;
}

.leaderboard h3 {
  margin-bottom: 10px;
  font-weight: bold;
}

.leaderboard ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.leaderboard li {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

li {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
