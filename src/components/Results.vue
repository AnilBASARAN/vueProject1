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
  <div>
    <div class="results-container">
      <div v-for="(horses, key) in results" :key="key" class="result-board">
        <div class="result">
          <!-- <h3>Leaderboard</h3> -->
          <h4>Round: {{ Number(key) + 1 }} - {{ 1200 + Number(key) * 200 }} meters</h4>
          <ul>
            <li v-for="(horse, horseIndex) in horses" :key="horse.id">
              {{ horseIndex + 1 }}.{{ horse.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-container {
  display: flex;
  width: 20%;
  position: absolute;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 1px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* two equal-width columns */
  grid-auto-rows: auto; /* as many rows as you need */
  gap: 1px;
}

.result-board {
  margin: 1px;
}

.result {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
}
ul,
li,
h4 {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
