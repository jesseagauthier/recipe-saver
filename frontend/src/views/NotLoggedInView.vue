<script setup>
import NotLoggedFooter from '@/components/footer/NotLoggedFooter.vue'

defineProps(['isKindeReady', 'login', 'register'])
</script>

<template>
  <div
    class="flex flex-col items-center justify-between h-screen bg-gray-100 py-6"
    id="logged_out_view"
  >
    <h2 class="text-4xl mb-5 font-bold">Recipe Saver</h2>
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
