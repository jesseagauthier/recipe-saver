<script setup>
import RecipeCard from './RecipeCard.vue'
import { useNewRecipesStore } from '../stores/newRecipes.js'
import { ref } from 'vue'

const newRecipesStore = useNewRecipesStore()

const { loggedUser, newRecipes, fullyFetched } = defineProps({
  loggedUser: {
    type: Object,
    required: true
  },
  newRecipes: {
    type: Array,
    required: true
  },
  loadMoreButton: {
    type: Boolean,
    default: true
  },
  fullyFetched: {
    type: Boolean
  },
  onRecipeSave: Function
})
</script>

<template>
  <div class="flex flex-col">
    <div v-if="newRecipes.length > 0" class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <RecipeCard
        class="col-span-1 md:col-span-6 lg:col-span-4"
        v-for="recipe in newRecipes"
        :key="recipe.id"
        :recipe="recipe"
        :loggedUser="loggedUser"
        :isSaved="false"
        :isExpanded="true"
        :fullyFetched="fullyFetched"
      />
    </div>
  </div>
</template>
