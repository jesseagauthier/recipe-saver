<script setup>
import { defineProps, ref, computed } from 'vue'
import { startOfWeek, addDays, format } from 'date-fns'
import { useSavedRecipesStore } from '@/stores/savedRecipes.js'
import { useMealPlanStore } from '@/stores/mealPlan.js'

const savedRecipesStore = useSavedRecipesStore()
const MealPlanStore = useMealPlanStore()

const props = defineProps({
  recipe: {
    type: Object,
    default: () => ({
      image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
      title: 'No Recipe Found',
      empty: true
    })
  },
  savedRecipes: {
    type: Array,
    required: true
  },
  mealPlan: {
    type: Object,
    required: true
  },
  dayPlan: {
    type: Object,
    required: true
  },
  loggedUser: {
    type: Object,
    required: true
  }
})

const selectedDate = ref(new Date())
const recipe = computed(() => props.recipe)

function getStartOfWeek(date) {
  return startOfWeek(date, { weekStartsOn: 1 })
}

function formatDateAsMMDDYYYY(date) {
  return format(date, 'MM/dd/yyyy')
}

function updateMealPlansForWeek() {
  const userId = props.loggedUser.id
  const start = getStartOfWeek(selectedDate.value)
  const end = addDays(start, 6)
  const formattedStart = formatDateAsMMDDYYYY(start)
  const formattedEnd = formatDateAsMMDDYYYY(end)
  MealPlanStore.fetchMealPlansForWeek(formattedStart, formattedEnd, userId)
}

async function saveSelectedMealPlan(recipe, meal, customDate) {
  recipe.recipeId = recipe.id
  recipe.meal = meal.type
  recipe.date = customDate

  try {
    await MealPlanStore.saveMealPlan(recipe)
    updateMealPlansForWeek()
  } catch (error) {
    console.error('Failed to save or update meal plan:', error)
  }
}
</script>

<template>
  <div class="outside grid h-100">
    <div class="h-98 card w-100 bg-base-100 shadow-xl">
      <figure class="index-1">
        <img class="" :src="recipe.image" :alt="recipe.title" />
      </figure>
      <div class="flex flex-col card-body mt-auto">
        <h2 class="card-title mt-auto mx-auto mb-auto">{{ recipe.title }}</h2>
        <div class="flex justify-evenly">
          <details
            v-if="recipe.empty"
            class="noanimation p-0 dropdown btn rounded-l-md rounded-r-none w-1/2 hover:bg-blue-400 bg-accent border-0"
          >
            <summary class="p-4">Add</summary>
            <ul class="z-50 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
              <li class="z-50" v-for="savedRecipe in props.savedRecipes" :key="savedRecipe.id">
                <button
                  @click="saveSelectedMealPlan(savedRecipe, mealPlan, dayPlan.fullDate)"
                  class="capitalize z-50"
                >
                  {{ savedRecipe.title }}
                </button>
              </li>
            </ul>
          </details>

          <RouterLink
            v-else
            to=""
            class="btn rounded-l-md rounded-r-none w-1/2 z-[1] hover:bg-blue-400 bg-accent border-0 py-4"
            >Remove
          </RouterLink>
          <span class="bg-accent border-l-2"></span>
          <RouterLink
            to=""
            class="z-[1] btn rounded-r-md rounded-l-none w-1/2 hover:bg-blue-400 bg-accent border-0"
            >Manage
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outside {
  height: 100%;
}

.dropdown-content {
  z-index: 99999 !important;
}

.noanimation {
  animation: none !important;
  transform: none !important;
}
</style>
