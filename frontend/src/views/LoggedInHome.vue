<!-- eslint-disable vue/require-default-prop -->
<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import { onMounted, ref, watch } from 'vue'
import NewRecipes from '../components/NewRecipes.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import { useNewRecipesStore } from '@/stores/newRecipes'
import { useSavedRecipesStore } from '@/stores/savedRecipes'
import { useSearchRecipeStore } from '@/stores/searchRecipes'
import { defineProps } from 'vue'

const props = defineProps({
  loggedUser: Object,
  logout: Function,
  isLoggedIn: Boolean
})

const newRecipesStore = useNewRecipesStore()
const savedRecipesStore = useSavedRecipesStore()
const searchRecipeStore = useSearchRecipeStore()

// Create a local ref that will sync with searchRecipeStore's recipes
const localRecipes = ref([])
// Fetch recipes when the component is created or the user changes
onMounted(() => {
  if (props.loggedUser.id) {
    newRecipesStore.fetchNewRecipes(props.loggedUser.id)
    savedRecipesStore.fetchSavedRecipes(props.loggedUser.id)
  }
})

// Watch the store's recipes and update the local ref accordingly
watch(
  () => searchRecipeStore.recipes,
  (newRecipes) => {
    localRecipes.value = newRecipes
  },
  { deep: true }
)

const fullyFetched = ref(true)
</script>

<template>
  <main v-if="isLoggedIn" id="logged_in_view">
    <div
      class="grid grid-cols-12 gap-4 mt-5 grid-rows-1 shadow-md p-4 bg-base-200 rounded-lg mb-1 bordered"
      v-if="localRecipes.length > 0"
    >
      <h2 class="col-span-12 text-2xl font-bold mb-3">Search Results</h2>
      <RecipeCard
        v-for="recipe in localRecipes"
        class="col-span-12 md:col-span-4"
        :key="recipe.id"
        :recipe="recipe"
        :logged-user="loggedUser"
        :is-saved="false"
        :fully-fetched="fullyFetched"
      />
    </div>
    <div class="grid grid-cols-12 gap-4 mt-5 grid-rows-1">
      <h2 class="col-span-12 text-2xl font-bold mb-3">Try Something New</h2>
      <NewRecipes
        :fully-fetched="fullyFetched"
        :new-recipes="newRecipesStore.recipes"
        class="col-span-12"
        :logged-user="loggedUser"
        @on-recipe-save="savedRecipesStore.saveRecipe"
      />
    </div>
  </main>
</template>
