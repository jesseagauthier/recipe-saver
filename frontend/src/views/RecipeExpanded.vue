<template>
  <div class="min-h-screen max-w-screen" v-if="fullRecipeStore.ExpandedRecipe.data">
    <div class="text-sm breadcrumbs my-3 mx-3">
      <ul>
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>{{ fullRecipeStore.ExpandedRecipe.data.title }}</li>
      </ul>
    </div>
    <div class="container-full mx-auto bg-white rounded-lg shadow">
      <div class="bg-base-200">
        <recipe-hero :recipe="fullRecipeStore.ExpandedRecipe.data" />
        <button
          class="btn btn-success mx-auto block"
          @click="initiateRecipeSave(fullRecipeStore.ExpandedRecipe.data, userId)"
        >
          <span v-if="isSaved">Delete</span>
          <span v-else>Save</span>
        </button>
        <div class="hero mx-auto md:my-4 p-5">
          <div class="md:hero-content mx-auto">
            <div id="ingredients" class="mb-3 md:mb-auto md:w-1/4">
              <h3 class="text-2xl font-semibold mb-4">Ingredients</h3>
              <ol class="list-disc">
                <li
                  v-for="ingredient in fullRecipeStore.ExpandedRecipe.data.extendedIngredients"
                  :key="ingredient.id"
                >
                  {{ ingredient.original }}
                </li>
              </ol>
            </div>
            <div
              class="mb-auto md:w-1/2"
              id="steps"
              v-for="(instruction, index) in fullRecipeStore.ExpandedRecipe.data
                .analyzedInstructions"
              :key="index"
            >
              <h3 class="text-2xl font-semibold mb-4">Steps</h3>
              <h4>{{ instruction.name }}</h4>
              <ol class="">
                <li class="my-3" v-for="step in instruction.steps" :key="step.number">
                  <p>
                    <span class="font-bold mr-2">Step {{ step.number }}:</span> {{ step.step }}
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div class="p-5">
          <p>
            <strong class="mr-2">Source:</strong>
            <a
              :href="fullRecipeStore.ExpandedRecipe.data.sourceUrl"
              class="text-blue-500 hover:text-blue-700"
              >{{ fullRecipeStore.ExpandedRecipe.data.sourceName }}</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center">
    <p>Loading recipe...</p>
  </div>
  <div
    v-if="saveDelete"
    role="alert"
    class="flex alert alert-success fixed bottom-0 right-0 mb-5 md:mr-5 z-50 w-[50%] md:w-[40%] lg:w-[10%]"
  >
    <p class="text-center w-[100%] text-xl whitespace-nowrap">{{ alertMessage }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import { useExpandedRecipesStore } from '@/stores/expandedRecipe.js'
import RecipeHero from '../components/heros/RecipeHero.vue'
import { useSavedRecipesStore } from '@/stores/savedRecipes'

const savedRecipesStore = useSavedRecipesStore()
const route = useRoute()
const fullRecipeStore = useExpandedRecipesStore()
const recipeId = ref(route.params.id)
const userId = ref(route.params.user)
const alertMessage = ref('') // Initialize an empty message

onMounted(() => {
  fullRecipeStore.fetchFullRecipes(recipeId.value)
})
let isSaved = ref(route.params.saved)
isSaved.value = isSaved.value !== 'false'
const saveDelete = ref(false)

function initiateRecipeSave(recipe) {
  if (isSaved.value) {
    savedRecipesStore.deleteRecipe(recipe.id, userId.value)
    isSaved.value = false
    alertMessage.value = 'Recipe Deleted'
  } else {
    savedRecipesStore.saveRecipe(recipe, userId.value)
    isSaved.value = true
    alertMessage.value = 'Recipe Saved'
  }
  saveDelete.value = true

  setTimeout(() => {
    saveDelete.value = false
  }, 3000)
}
</script>
