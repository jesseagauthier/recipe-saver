import { defineStore } from 'pinia'

export const useExpandedRecipesStore = defineStore('recipes', {
  state: () => ({
    ExpandedRecipe: {},
    currentRecipe: null
  }),
  actions: {
    async fetchFullRecipes(recipeId) {
      try {
        const response = await fetch('https://www.thewebmasters.ca:4000/api/recipes/getRecipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: recipeId })
        })
        const result = await response.json()

        // Extract the specific headers from the response
        const quotaHeaders = {
          'x-api-quota-request': response.headers.get('x-api-quota-request'),
          'x-api-quota-used': response.headers.get('x-api-quota-used'),
          'x-api-quota-left': response.headers.get('X-Api-Quota-Left')
        }
        // Attach the headers to the result object
        this.ExpandedRecipe = {
          data: result, // The actual recipe data
          headers: quotaHeaders // The extracted headers
        }
      } catch (error) {
        console.error('Error fetching new recipes:', error)
        this.ExpandedRecipe = {} // Reset in case of an error
      }
    }
  }
})
