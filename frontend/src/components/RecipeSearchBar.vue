<template>
  <div class="w-fit mx-auto">
    <label class="min-w-[400px] input input-bordered flex items-center gap-2">
      <input
        v-model="searchQuery"
        required
        type="text"
        placeholder="Recipe Search..."
        class="grow bg-transparent placeholder-black"
        @keyup.enter="triggerSearch"
      />
      <button @click="triggerSearch" class="p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 opacity-70 cursor-pointer"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </label>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['searchRecipeStore'])
const searchQuery = ref('')

function triggerSearch() {
  emit('searchRecipeStore', searchQuery.value)
}
</script>
