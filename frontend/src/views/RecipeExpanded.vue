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
  <div v-if="saveDelete" role="alert" class="alert alert-success w-[20%] b-0 relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-info shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <span>Recipe Saved</span>
    <div>
      <button class="btn btn-sm btn-primary">Close</button>
    </div>
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

onMounted(() => {
  fullRecipeStore.fetchFullRecipes(recipeId.value)
})
let isSaved = ref(route.params.saved)

isSaved.value = isSaved.value !== 'false'

onMounted(() => {
  fullRecipeStore.fetchFullRecipes(recipeId.value)
})

function initiateRecipeSave(recipe) {
  if (isSaved.value) {
    savedRecipesStore.deleteRecipe(recipe.id, userId.value)
    isSaved.value = false
    // Function for tooltip alert
  } else {
    savedRecipesStore.saveRecipe(recipe, userId.value)
    isSaved.value = true
    // Function for tooltip alert
  }
}

const saveDelete = ref(true)
</script>
