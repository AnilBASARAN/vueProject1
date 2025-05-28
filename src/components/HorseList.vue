<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse } from '../models/horse'
import '../assets/main.css'

// Props
const props = defineProps<{
  horses: Horse[]
}>()

const store = useStore()
const showHorses = computed(() => store.state.showHorseList)
</script>

<template>
  <div
    v-if="showHorses"
    class="modal-overlay"
    @click.self="store.commit('setShowHorseList', false)"
  >
    <div class="leaderboard">
      <div class="list-header">
        <h3>Horses</h3>
        <h3>Conditions</h3>
      </div>
      <ul>
        <li v-for="(horse, index) in horses" :key="horse.id" class="horse-row">
          <span class="color-dot" :style="{ backgroundColor: horse.color }"></span>
          <span class="horse-rank">{{ index + 1 }}.</span>
          <span class="horse-id">Horse #{{ horse.id }}</span>
          <span class="horse-condition"> {{ horse.condition }}</span>
        </li>
      </ul>
    </div>

    <button class="close-btn" @click="store.commit('setShowHorseList', false)">Close</button>
  </div>
</template>

<style scoped>
.leaderboard {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  width: 280px;
  color: #222;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.leaderboard h3 {
  margin-bottom: 12px;
  font-size: 1.5rem;
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
  margin-bottom: 8px;
  font-size: 1rem;
}

.horse-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
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
}

.horse-condition {
  margin-left: auto; /* pushes it to the end of the row */
  font-size: 14px;
  font-style: italic;
  color: #666;
}

.list-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
