<template>
  <div class="">
    <div v-if="!fullyFetched" class="flex flex-col gap-4 w-52">
      <div class="skeleton h-32 w-full"></div>
      <div class="skeleton h-4 w-28"></div>
      <div class="skeleton h-4 w-full"></div>
      <div class="skeleton h-4 w-full"></div>
    </div>
    <div v-if="fullyFetched" class="card bg-base-100 shadow-2xl image-full">
      <figure>
        <img lazyload :alt="recipe.title" :src="recipe.image" class="cover" />
      </figure>
      <div
        class="mt-auto card-body flex flex-row justify-between bg-green-50 rounded-xl mx-2 mb-3 align-middle glass"
      >
        <h2 class="card-title text-sm text-black w-3/4">{{ recipe.title }}</h2>
        <div :class="{ flex: isSaved }" class="gap-3 grow-1">
          <router-link
            :to="{ name: 'recipe', params: { id: recipe.id, user: loggedUser.id, saved: isSaved } }"
            class="btn btn-success my-auto button w-100"
            >View
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { recipe } = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  isSaved: {
    type: Boolean,
    required: false
  },
  loggedUser: {
    type: Object,
    required: true
  },
  fullyFetched: {
    type: Boolean
  }
})

const loading = ref(true)

// Simulate fetch
setTimeout(() => {
  loading.value = false
}, 500)
</script>

<style>
.card.image-full:before {
  opacity: 0;
}

.card-body {
  padding: 10px;
}

.button:hover {
  background-color: green;
  color: white;
}
</style>
