<script setup>
import NotLoggedFooter from '@/components/footer/NotLoggedFooter.vue'

defineProps(['isKindeReady', 'login', 'register'])
</script>

<template>
  <div
    class="flex flex-col items-center justify-between h-screen bg-gray-100 py-6"
    id="logged_out_view"
  >
    <h2 class="text-4xl mb-5 font-bold">Welcome to the Recipe Saver</h2>
    <div
      class="mt-10 p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4"
    >
      <p class="text-xl font-semibold">New Features:</p>
      <ul class="list-disc space-y-2 pl-5 text-gray-700">
        <li>Recipe Search</li>
        <li>Recipe Saver</li>
        <li>Meal Planner</li>
      </ul>
    </div>

    <div class="space-y-3">
      <button
        v-if="isKindeReady"
        class="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        id="login"
        type="button"
        @click="login"
      >
        Sign in
      </button>
      <button
        v-if="isKindeReady"
        class="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
        id="register"
        type="button"
        @click="register"
      >
        Register
      </button>
    </div>
    <NotLoggedFooter />
  </div>
</template>

<style scoped></style>
