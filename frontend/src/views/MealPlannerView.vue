<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import MealPlanCard from '../components/MealPlanCard.vue'
import { useSavedRecipesStore } from '@/stores/savedRecipes.js'
import { useMealPlanStore } from '@/stores/mealPlan.js'

const selectedDate = ref(new Date()) // Initialize with the current date
const weekDates = ref([]) // Array to store the formatted dates for the week
const savedRecipesStore = useSavedRecipesStore()
const MealPlanStore = useMealPlanStore()
const savedRecipes = computed(() => savedRecipesStore.recipes)

const props = defineProps({
  loggedUser: {
    type: Object,
    required: true
  }
})

const meals = ['breakfast', 'lunch', 'dinner', 'snack']
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

function getStartOfWeek(date) {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 0)
  result.setDate(diff)
  return new Date(result.setHours(0, 0, 0, 0))
}

function formatDayWithDate(date) {
  const month = months[date.getMonth()]
  const dayOfMonth = date.getDate()
  const ordinal = getOrdinalIndicator(dayOfMonth)
  return `${month} ${ordinal} `
}

function getOrdinalIndicator(day) {
  const j = day % 10,
    k = day % 100
  if (j === 1 && k !== 11) return day + 'st'
  if (j === 2 && k !== 12) return day + 'nd'
  if (j === 3 && k !== 13) return day + 'rd'
  return day + 'th'
}

function updateWeekDates(date) {
  const startOfWeek = getStartOfWeek(date)
  weekDates.value = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(day.getDate() + i)
    const formatted = formatDayWithDate(day)
    weekDates.value.push(formatted)
  }
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

onMounted(async () => {
  await savedRecipesStore.fetchSavedRecipes(props.loggedUser.id)
  updateWeekDates(selectedDate.value)
  updateMealPlansForWeek()
})

watch(
  selectedDate,
  () => {
    updateWeekDates(selectedDate.value)
    updateMealPlansForWeek()
  },
  { immediate: true }
)

const mealPlansForWeek = computed(() => {
  return weekDates.value.map((date) => ({
    date,
    meals: meals.map((meal) => {
      const formattedDate = formatDateAsMMDDYYYY(parseCustomDateToDateObject(date))
      const plan = MealPlanStore.mealPlans.find(
        (plan) => plan.date === formattedDate && plan.meal === meal
      )

      return {
        type: meal,
        plan: plan
      }
    })
  }))
})

function navigateWeeks(direction) {
  const currentDate = new Date(selectedDate.value)
  currentDate.setDate(currentDate.getDate() + direction * 7)
  selectedDate.value = new Date(currentDate) // Ensure Vue reacts to this change
}
</script>

<template>
  <div class="py-3 md:px-6">
    <header class="mb-3 py-5">
      <div class="flex flex-col gap-5 justify-center text-center">
        <h2 class="text-5xl font-bold">Meal Planner</h2>
        <div class="flex justify-center gap-48 flex-col md:flex-row mt-4">
          <svg
            class="w-[70px] p-3 bg-success rounded-full"
            @click="navigateWeeks(-1)"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            transform="rotate(180)"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M5.5 5L11.7929 11.2929C12.1834 11.6834 12.1834 12.3166 11.7929 12.7071L5.5 19"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M13.5 5L19.7929 11.2929C20.1834 11.6834 20.1834 12.3166 19.7929 12.7071L13.5 19"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>

          <svg
            class="w-[70px] p-3 bg-success rounded-full"
            @click="navigateWeeks(1)"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            transform="rotate(0)"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M5.5 5L11.7929 11.2929C12.1834 11.6834 12.1834 12.3166 11.7929 12.7071L5.5 19"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M13.5 5L19.7929 11.2929C20.1834 11.6834 20.1834 12.3166 19.7929 12.7071L13.5 19"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </header>
    <main class="flex flex-col gap-10">
      <div
        v-for="(dayPlan, index) in mealPlansForWeek"
        :key="index"
        class="bg-blue-100 p-4 rounded-2xl shadow"
      >
        <div class="day md:p-3">
          <h3 class="font-bold text-3xl">{{ dayPlan.date }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-8 gap-4 gap-y-5 mt-5">
            <div
              v-for="mealPlan in dayPlan.meals"
              :key="mealPlan.type"
              class="col-span-2 bg-white p-3 rounded-xl"
            >
              <MealPlanCard
                v-if="!savedRecipesStore.isLoading"
                :loggedUser="loggedUser"
                :savedRecipes="savedRecipes"
                :mealPlan="mealPlan"
                :dayPlan="dayPlan"
                :recipe="mealPlan.plan"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
