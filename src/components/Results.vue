<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import '../assets/main.css'

const store = useStore()
const results = computed(() => store.state.results)
const round = computed(() => store.state.round)
const showResults = computed(() => store.state.showResults)
</script>

<template>
  <div v-if="showResults" class="modal-overlay" @click.self="store.commit('setShowResults', false)">
    <div class="results-container">
      <div v-for="(horses, key) in results" :key="key" class="result-board">
        <div class="result">
          <h3>Leaderboard</h3>
          <h3>Round: {{ Number(key) + 1 }} - {{ 1200 + Number(key) * 200 }} meters</h3>
          <ul>
            <li v-for="(horse, horseIndex) in horses" :key="horse.id">
              <span
                class="color-dot"
                :style="{ backgroundColor: horse.color, display: 'inline-block' }"
              ></span>
              {{ horseIndex + 1 }}. Horse #{{ horse.id }}
            </li>
          </ul>
        </div>
      </div>
      <button class="close-btn" @click="store.commit('setShowResults', false)">Close</button>
    </div>
  </div>
</template>

<style scoped>
.results-container {
  background: white;
  width: 90%;
  height: 90%;
  overflow-y: auto;
  padding: 20px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.result-board {
  margin-bottom: 20px;
}

.result {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>
