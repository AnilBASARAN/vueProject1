<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse } from '../models/horse'
import '../assets/main.css'
import { initializeHorses, shuffleArray } from '../helpers/utils'
// Props
const props = defineProps<{
  horses: Horse[]
}>()
const allHorses = initializeHorses()
const store = useStore()
const showHorses = computed(() => store.state.showHorseList)
</script>

<template>
  <div class="conditions panel">
    <div class="conditions">
      <div class="leaderboard">
        <div class="list-header">
          <h4>Riders</h4>
          <h4>Conditions</h4>
        </div>
        <ul>
          <li v-for="(horse, index) in allHorses" :key="horse.id" class="horse-row">
            <span class="horse-rank">{{ index + 1 }}.</span>
            <span class="horse-id">{{ horse.name }} </span>
            <span class="horse-condition"> {{ horse.condition }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conditions {
  width: 100%;
  box-sizing: border-box;
}

.leaderboard h3 {
  margin-bottom: 12px;
  font-size: 2rem;
  text-align: flex-start;
}

.leaderboard ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.leaderboard li {
  display: flex;
  align-items: center;
  margin-bottom: 1px;
  font-size: 1rem;
}

.horse-row {
  display: flex;
  align-items: center;
  gap: 1px;
  margin-bottom: 1px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.horse-rank,
.horse-id {
  font-size: 14px;
  margin-right: 20px;
}

.horse-condition {
  margin-left: auto; /* pushes it to the end of the row */
  font-size: 14px;
  font-style: italic;
  color: #666;
}
li {
  margin: 0;
  padding: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1px;
}
</style>
