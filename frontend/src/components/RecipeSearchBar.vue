<template>
  <!--  Eventually move this feature to the header bar-->
  <div class="flex justify-center flex-wrap gap-2">
    <input
      v-model="searchQuery"
      required
      type="text"
      id="searchBar"
      placeholder="Recipe Search..."
      class="input input-bordered"
      @keyup.enter="triggerSearch"
    />

    <button class="btn" @click="triggerSearch">Search</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emits = defineEmits(['searchForRecipe'])
const searchQuery = ref('')

function triggerSearch() {
  // Emit the search event, optionally passing the search query
  emits('searchForRecipe', searchQuery.value)
}
</script>

<style>
#searchBar {
  border: 1px solid black;
}
</style>
