<script setup>
import { computed } from 'vue'

const { recipe } = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  isSaved: {
    type: Boolean,
    required: false
  }
})

const summary = computed(() => {
  if (recipe.summary) {
    return removeHTMLTags(recipe.summary)
  }
  return ''
})

function removeHTMLTags(str) {
  return str ? str.replace(/<[^>]*>/g, '') : ''
}
</script>

<template>
  <div class="hero py-10 bg-base-200 w-70">
    <div class="md:hero-content flex-col lg:flex-row">
      <img :src="recipe.image" :alt="recipe.title" class="rounded-2xl shadow-2xl" />
      <div class="py-3 px-1 md:px-4">
        <h1 class="px-3 text-4xl font-bold">
          {{ recipe.title }}
        </h1>
        <p class="my-6 px-4">
          {{ summary }}
        </p>
        <div class="flex gap-4 mb-3 flex-wrap px-4">
          <p class="btn btn-accent cursor-default" v-if="recipe.servings">
            {{ recipe.servings }} Servings
          </p>
          <p class="btn btn-accent cursor-default" v-if="recipe.readyInMinutes">
            {{ recipe.readyInMinutes }} Minutes
          </p>
          <p class="btn btn-accent cursor-default" v-if="recipe.glutenFree">Gluten Free</p>
          <p class="btn btn-accent cursor-default" v-if="recipe.dairyFree">Dairy Free</p>
          <p class="btn btn-accent cursor-default" v-if="recipe.vegetarian">Vegetarian</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 80vw;
  margin: 0 auto;
}
</style>
