<script setup>
import { computed, defineProps, ref } from 'vue'
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
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const selectedDate = ref(new Date()) // Initialize with the current date
const recipe = computed(() => props.recipe)

function getStartOfWeek(date) {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 0)
  result.setDate(diff)
  return new Date(result.setHours(0, 0, 0, 0))
}

function parseCustomDateToDateObject(customDate) {
  const parts = customDate.split(' ')
  const month = months.indexOf(parts[0])
  const day = parseInt(parts[1], 10)
  const year = new Date().getFullYear()
  return new Date(year, month, day)
}

function formatDateAsMMDDYYYY(date) {
  const d = new Date(date)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  const year = d.getFullYear()
  return `${month}/${day}/${year}`
}

function updateMealPlansForWeek() {
  const userId = props.loggedUser.id
  const startOfWeek = getStartOfWeek(selectedDate.value)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)
  const formattedStart = formatDateAsMMDDYYYY(startOfWeek)
  const formattedEnd = formatDateAsMMDDYYYY(endOfWeek)
  MealPlanStore.fetchMealPlansForWeek(formattedStart, formattedEnd, userId)
}

async function saveSelectedMealPlan(recipe, meal, customDate) {
  const dateObject = parseCustomDateToDateObject(customDate)
  const formattedDate = formatDateAsMMDDYYYY(dateObject)

  recipe.recipeId = recipe.id
  recipe.meal = props.mealPlan.type
  recipe.date = formattedDate

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
            class="p-0 dropdown btn rounded-l-md rounded-r-none w-1/2 hover:bg-blue-400 bg-accent border-0"
          >
            <summary class="p-4">Add</summary>
            <ul class="z-50 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
              <li class="z-50" v-for="savedRecipe in props.savedRecipes" :key="savedRecipe.id">
                <button
                  @click="saveSelectedMealPlan(savedRecipe, mealPlan, dayPlan.date)"
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
</style>
