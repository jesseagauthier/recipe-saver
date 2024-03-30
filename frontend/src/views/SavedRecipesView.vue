<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div class="flex justify-between">
    <h2 class="text-2xl font-bold mb-5">Your Saved Recipes</h2>
  </div>
  <div class="shadow-md rounded-lg mb-1 bordered">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3">
      <RecipeCard
        class="col-span-1 md:col-span-6 lg:col-span-4"
        v-for="recipe in savedRecipes"
        :key="recipe.id"
        :recipe="recipe"
        :loggedUser="loggedUser"
        :isExpanded="false"
        :isSaved="true"
        :fullyFetched="fullyFetched"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import RecipeCard from '../components/RecipeCard.vue'
import { useSavedRecipesStore } from '@/stores/savedRecipes.js'

// Define props
const { loggedUser } = defineProps({
  loggedUser: {
    type: Object,
    required: true
  }
})
const fullyFetched = ref(true)

// Use the store
const savedRecipesStore = useSavedRecipesStore()

// Ref to store the saved recipes locally for reactivity
const savedRecipes = ref([])

// Fetch saved recipes on component mount
onMounted(async () => {
  await savedRecipesStore.fetchSavedRecipes(loggedUser.id)
  savedRecipes.value = savedRecipesStore.recipes
})
</script>
