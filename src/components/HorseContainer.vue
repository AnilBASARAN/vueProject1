<script setup lang="ts">
import { onBeforeUnmount, ref, computed } from 'vue'
import { backgroundImagesForRounds } from '../constants/backgroundConstants'
import { initializeHorses, shuffleArray } from '../helpers/utils'
import type { Horse } from '../models/horse'
import { useStore } from 'vuex'
import Results from './Results.vue'
import HorseList from './HorseList.vue'
import ContainerButton from './ContainerButton.vue'
import '../assets/main.css'

// props
const props = defineProps<{ onFinish: (horses: Horse[]) => void }>()

// local state
const finishedHorses = ref<Horse[]>([])
const tenHorses = ref<Horse[]>([])
const isStarted = ref(false)

const store = useStore()
const round = computed(() => store.state.round as number)

let intervalId: number

// full pool
const allHorses = initializeHorses()
// only those still moving
const activeHorses = computed(() => tenHorses.value.filter((h) => h.speed > 0))

function moveHorses() {
  isStarted.value = true
  for (const h of tenHorses.value) {
    if (h.speed === 0) continue
    h.position += h.speed
    const finishLine = window.innerWidth * 0.75
    if (h.position >= finishLine) {
      h.position = finishLine + 20
      h.speed = 0
      finishedHorses.value.push(h)
    }
  }
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
  // clear out last race
  finishedHorses.value = []
  // pick 10 new horses & reset their positions
  tenHorses.value = shuffleArray(allHorses)
    .slice(0, 10)
    .map((h) => {
      h.position = 0
      return h
    })
  // kick off the loop
  intervalId = window.setInterval(moveHorses, 100)
}

onBeforeUnmount(() => clearInterval(intervalId))
</script>

<template>
  <div
    class="horse-container"
    :style="{ backgroundImage: `url(${backgroundImagesForRounds[round]})` }"
  >
    <!-- 1) Horses flying across the background -->
    <div
      v-for="(horse, idx) in activeHorses"
      :key="horse.id"
      class="horse"
      :style="{ left: horse.position + 'px', bottom: idx * 60 + 'px' }"
    >
      <img :src="horse.image" :alt="horse.name" width="70" height="70" />
    </div>

    <!-- 2) LEFT sidebar: HorseList & Foto-Finish -->
    <div class="controls-left">
      <HorseList class="panel" :horses="tenHorses" />

      <div class="panel foto-finish">
        <h3>Foto Finish</h3>
        <ul>
          <li v-for="(h, i) in finishedHorses" :key="h.id">{{ i + 1 }}. {{ h.name }}</li>
        </ul>
        <ContainerButton v-if="!isStarted" :onPress="startRace" title="Start" />
      </div>
    </div>

    <!-- 3) RIGHT sidebar: live Results -->
    <div class="controls-right">
      <Results class="panel" />
    </div>
  </div>
</template>

<style scoped>
.horse-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.horse {
  position: absolute;
  transition: left 0.1s linear;
  will-change: left;
  z-index: 2; /* keep horses above your panels */
}

.controls-left {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: grid;
  gap: 1rem;
  max-width: 280px;
}

.controls-right {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  gap: 1rem;
  max-width: 280px;
}
li,
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
