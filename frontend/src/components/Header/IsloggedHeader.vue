<template>
  <header class="bg-base-100 p-5">
    <nav class="flex justify-between items-center">
      <!-- Mobile Nav -->
      <div class="lg:hidden flex w-[100%] justify-between items-center">
        <RouterLink to="/" class="text-xl ml-3 font-semibold">Recipe Saver</RouterLink>
        <svg
          v-if="!isDropdownOpen"
          @click="toggleDropdown"
          width="100"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 cursor-pointer"
        >
          <path
            opacity="0.5"
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="#1C274C"
          ></path>
          <path
            d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z"
            fill="#1C274C"
          ></path>
          <path
            d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
            fill="#1C274C"
          ></path>
          <path
            d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z"
            fill="#1C274C"
          ></path>
        </svg>
        <!-- Dropdown Content -->
        <div
          v-if="isDropdownOpen"
          ref="dropdownMenu"
          class="top-0 z-[99] right-10 dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box absolute"
        >
          <div
            @click="toggleDropdown"
            class="w-100 cursor-pointer border-bottom divide-dashed border-b-2 pb-3"
          >
            <svg
              class="ml-auto"
              viewBox="0 0 24 24"
              width="30px"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z"
                  fill="#1C274C"
                ></path>
                <path
                  d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
                  fill="#1C274C"
                ></path>
                <path
                  d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z"
                  fill="#1C274C"
                ></path>
                <circle
                  opacity="0.5"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#1C274C"
                  stroke-width="1.5"
                ></circle>
              </g>
            </svg>
          </div>
          <div class="flex flex-col gap-3 mt-4">
            <RouterLink to="/" class="btn">New Recipes</RouterLink>
            <RouterLink to="/saved-recipes" v-if="loggedUser" class="btn">Saved Recipes</RouterLink>
            <RouterLink to="/meal-planner" v-if="loggedUser" class="btn">Meal Planner</RouterLink>
          </div>
        </div>
      </div>
      <!-- Navbar for larger screens -->
      <div class="hidden lg:flex items-center justify-around w-[100%]">
        <RouterLink to="/" class="text-xl me-auto font-semibold">Recipe Saver</RouterLink>
        <div class="flex items-center space-x-4">
          <RouterLink to="/" class="btn">New Recipes</RouterLink>
          <RouterLink to="/saved-recipes" v-if="props.loggedUser" class="btn"
            >Saved Recipes
          </RouterLink>
          <RouterLink to="/meal-planner" v-if="props.loggedUser" class="btn"
            >Meal Planner</RouterLink
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  loggedUser: Object
})

const isDropdownOpen = ref(false) // State to track if the dropdown is open
const route = useRoute() // Access the current route

// Function to toggle the dropdown open/close state
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Watch for route changes. Whenever the route changes, close the dropdown if it's open.
watch(route, () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
})

// Optional: If you need to handle clicks outside the dropdown to close it
// This can complement the route change watch for closing the dropdown.
const dropdownContent = ref(null)

function handleClickOutside(event) {
  if (
    dropdownContent.value &&
    !dropdownContent.value.contains(event.target) &&
    isDropdownOpen.value
  ) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true) // Use capture mode
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped></style>
