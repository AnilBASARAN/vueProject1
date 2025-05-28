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
  background-color: #085451; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
}
</style>
