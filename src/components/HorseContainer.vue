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
    const finishLine = window.innerWidth * 0.85

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

    <div class="leaderboard">
      <h3>Leaderboard</h3>
      <h3>Round: {{ round + 1 }} - {{ 1200 + round * 200 }} meters</h3>
      <ul>
        <li v-for="(horse, i) in finishedHorses" :key="horse.id">
          <span class="color-dot" :style="{ backgroundColor: horse.color }"> </span>
          {{ i + 1 }}. {{ horse.name }}
        </li>
      </ul>

      <div v-if="!isStarted">
        <ContainerButton :onPress="startRace" title="Start Race" />
        <ContainerButton
          :onPress="() => store.commit('setShowResults', true)"
          title="Show Results"
        />
        <ContainerButton
          :onPress="() => store.commit('setShowHorseList', true)"
          title="Show Horse List"
        />
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
</style>
