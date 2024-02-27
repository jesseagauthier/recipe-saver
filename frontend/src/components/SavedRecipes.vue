<template>
  <div class="shadow-md p-1 md:p-4 bg-base-200 rounded-lg mb-1 bordered">
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold mb-5">Your Saved Recipes</h2>
    </div>
    <div class="grid grid-cols-1 gap-3">
      <RecipeCard
        class="col-span-1"
        v-for="recipe in props.savedRecipes"
        :key="recipe.id"
        :recipe="recipe"
        :loggedUser="props.loggedUser"
        :isExpanded="false"
        :isSaved="true"
      />
    </div>
  </div>
</template>

<script setup>
import RecipeCard from './RecipeCard.vue'

const props = defineProps({
  loggedUser: {
    type: Object,
    required: true
  },
  savedRecipes: {
    type: Array,
    required: true
  }
})
</script>
