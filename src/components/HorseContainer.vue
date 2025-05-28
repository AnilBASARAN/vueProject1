<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { horseColors, horseNames, horseImages } from '../constants/horseConstants'
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
const round = computed(() => store.state.round)
let intervalId: number | undefined

const horses = initializeHorses()
// Move horses each tick
function moveHorses() {
  let allFinished = true
  isStarted.value = true
  for (const horse of tenHorses.value) {
    if (horse.speed === 0) continue

    horse.position += horse.speed
    const finishLine = window.innerWidth * 0.85

    if (horse.position >= finishLine) {
      horse.position = finishLine + 20 // Move horse off-screen
      horse.speed = 0
      finishedHorses.value.push(horse)
    } else {
      allFinished = false
    }
  }

  if (allFinished) {
    clearInterval(intervalId)
    store.commit('setResults', finishedHorses.value)
    store.commit('setShowResults', true)
    setTimeout(() => {
      props.onFinish(tenHorses.value)
      isStarted.value = false
    }, 2000)
  }
}

// Start race
function startRace() {
  tenHorses.value = shuffleArray(horses).slice(0, 10)
  intervalId = window.setInterval(moveHorses, 100)
}

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="horse-container">
    <Results />
    <HorseList :horses="horses" />
    <!-- Horse animation -->
    <div
      v-for="horse in tenHorses"
      :key="horse.id"
      class="gif-wrapper"
      :style="{ transform: `translateX(${horse.position}px)` }"
    >
      <!-- Decreasing horse size to give long area effect -->
      <img :src="horse.image" :alt="horse.name" :width="70" :height="70" />
    </div>

    <!-- Leaderboard -->
    <div class="leaderboard">
      <h3>Leaderboard</h3>
      <h3>Round: {{ round + 1 }} - {{ 1200 + round * 200 }} meters</h3>
      <ul>
        <li v-for="(horse, index) in finishedHorses" :key="horse.id">
          <span class="color-dot" :style="{ backgroundColor: horse.color }"></span>
          {{ index + 1 }}. {{ horse.name }}
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
  background-image: url('/src/assets/background1.png');
  background-repeat: no-repeat; /* don’t tile */
  background-position: center center; /* center it */
  background-size: cover; /* scale to cover entire box */
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

.horse-circle {
  position: absolute;
  top: 30%;
  left: 40%;
  border-radius: 50%;
}
</style>
