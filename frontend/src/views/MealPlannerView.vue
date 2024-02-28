<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import MealPlanCard from '../components/MealPlanCard.vue'
import { useSavedRecipesStore } from '@/stores/savedRecipes.js'
import { useMealPlanStore } from '@/stores/mealPlan.js'
import { startOfWeek, add, format, parse, subDays, addDays } from 'date-fns'

const selectedDate = ref(new Date())
const weekDates = ref([])
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

function getStartOfWeek(date) {
  return startOfWeek(date, { weekStartsOn: 1 })
}

function updateWeekDates(date) {
  const start = getStartOfWeek(date)
  weekDates.value = Array.from({ length: 7 }).map((_, i) => {
    const currentDate = add(start, { days: i })
    return {
      displayDate: format(currentDate, 'MMMM do'), // for display
      dataDate: format(currentDate, 'MM/dd/yyyy') // for data manipulation
    }
  })
}

function formatDateAsMMDDYYYY(date) {
  return format(date, 'MM/dd/yyyy')
}

function updateMealPlansForWeek() {
  const userId = props.loggedUser.id
  const startOfWeek = getStartOfWeek(selectedDate.value)
  const endOfWeek = add(startOfWeek, { days: 6 })
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
  return weekDates.value.map(({ displayDate, dataDate }) => {
    const dayOfWeek = format(parse(dataDate, 'MM/dd/yyyy', new Date()), 'EEEE')

    const fullDate = dataDate

    return {
      date: displayDate, // For display in the UI
      dayOfWeek, // Day of the week, e.g., "Monday"
      fullDate, // The full date in "MM/DD/YYYY" format for any data manipulation or logic
      meals: meals.map((meal) => {
        // Find the meal plan that matches the current date and meal type
        const plan = MealPlanStore.mealPlans.find(
          (plan) => plan.date === dataDate && plan.meal === meal
        )

        return {
          type: meal, // e.g., "breakfast", "lunch", etc.
          plan: plan // The meal plan object
        }
      })
    }
  })
})

function navigateWeeks(direction) {
  const currentDate = new Date(selectedDate.value)
  selectedDate.value = add(currentDate, { weeks: direction })
}

const formatDate = (date) => format(date, 'MMMM do')

const previousMonday = computed(() => formatDate(subDays(getStartOfWeek(selectedDate.value), 7)))

const nextMonday = computed(() =>
  formatDate(addDays(getStartOfWeek(addDays(selectedDate.value, 7)), 0))
)
</script>

<template>
  <div class="py-3 md:px-6">
    <header class="mb-3 py-5">
      <div class="flex flex-col gap-5 justify-center text-center">
        <h2 class="text-5xl font-bold">Meal Planner</h2>
        <div class="flex justify-center gap-24 md:gap-48 mt-4">
          <div class="flex flex-col justify-center">
            <svg
              class="mx-auto w-[70px] p-3 bg-success rounded-full cursor-pointer hover:bg-[#8da797]"
              @click="navigateWeeks(-1)"
              width="100%"
              height="75%"
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
            <div class="text-center">{{ previousMonday }}</div>
          </div>
          <div class="flex flex-col justify-center">
            <svg
              class="mx-auto w-[70px] p-3 bg-success rounded-full cursor-pointer hover:bg-[#8da797]"
              @click="navigateWeeks(1)"
              width="100%"
              height="75%"
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
            <div class="text-center">{{ nextMonday }}</div>
          </div>
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
          <h3 class="font-bold text-3xl">
            <span class="block text-md font-light my-2">{{ dayPlan.dayOfWeek }}</span>
            {{ dayPlan.date }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-8 gap-4 gap-y-5 mt-5">
            <MealPlanCard
              class="col-span-2 bg-white p-3 rounded-xl"
              v-for="(mealPlan, index) in dayPlan.meals"
              :key="index"
              :loggedUser="loggedUser"
              :savedRecipes="savedRecipes"
              :mealPlan="mealPlan"
              :dayPlan="dayPlan"
              :recipe="mealPlan.plan"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
