<script setup lang="ts">
// props
const props = defineProps<{
  title: string
  onPress: () => void
}>()
</script>
<template>
  <button @click="props.onPress" type="button" id="start-button" class="container-button">
    <span class="start-button-text">
      {{ props.title }}
    </span>
  </button>
</template>
<style scoped>
.container-button {
  background-color: orange; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 8px;
  cursor: pointer;
  border-radius: 12px;
}
</style>
