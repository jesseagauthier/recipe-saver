<template>
  <header>
    <!-- Mobile Navigation -->
    <nav class="lg:hidden flex justify-between items-center fixed z-[9999] top-0 right-0 left-0">
      <div
        :class="{
          'w-screen': isDropdownOpen,
          'w-[65px]': !isDropdownOpen,
          'h-screen': isDropdownOpen,
          'bg-[#f7f4e7]': isDropdownOpen,
          'bg-[#e6e4bf]': !isDropdownOpen
        }"
        class="absolute top-0 right-0 flex p-2 flex-col gap-3 max-w-[400px] z-[99999]"
        ref="dropdownContent"
      >
        <svg
          @click="isDropdownOpen = !isDropdownOpen"
          :class="{ 'scale-150': !isDropdownOpen, 'scale-100': isDropdownOpen }"
          class="w-[60px] h-[60px] cursor-pointer"
          viewBox="0 0 24 24"
          fill="none"
          style="transform: translateX(-10%)"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="#000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
        <div v-if="isDropdownOpen" class="flex flex-col justify-start gap-3 mb-auto">
          <RouterLink to="/" v-if="loggedUser" class="btn active justify-start"
            >New Recipes</RouterLink
          >
          <RouterLink to="/saved-recipes" v-if="loggedUser" class="btn justify-start"
            >Saved Recipes</RouterLink
          >
          <RouterLink to="/meal-planner" v-if="loggedUser" class="btn justify-start"
            >Meal Planner</RouterLink
          >
        </div>
      </div>
    </nav>
    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex p-5 justify-between items-center z-[999] w-[80vw] mx-auto">
      <!-- Navbar for larger screens -->
      <div class="flex items-center justify-around w-[100%]">
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

const isDropdownOpen = ref(false)
const route = useRoute()
const dropdownContent = ref(null)

// Watch for route changes and close the dropdown if it's open
watch(route, () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
})

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
  document.addEventListener('click', handleClickOutside, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
.active {
  background-color: #e6e4c0;
}
</style>
