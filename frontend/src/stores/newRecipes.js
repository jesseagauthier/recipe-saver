// stores/newRecipes.js
import { defineStore } from 'pinia'

export const useNewRecipesStore = defineStore('newRecipes', {
  // Define the store's state
  state: () => {
    const storedData = localStorage.getItem('newRecipesData')
    if (storedData) {
      const data = JSON.parse(storedData)
      return {
        recipes: data.recipes || [],
        lastFetched: data.lastFetched || null,
        fullFetched: false
      }
    }
    return {
      recipes: [],
      lastFetched: null,
      fullFetched: false
    }
  },
  actions: {
    // Define the asynchronous action to fetch new recipes
    async fetchNewRecipes(userId, forceRefresh = false) {
      this.fullFetched = false

      // Determine if a new fetch should occur based on various conditions
      const shouldFetch =
        forceRefresh ||
        !this.recipes.length ||
        !this.lastFetched ||
        Date.now() - this.lastFetched > 60 * 60 * 1000 // 1 hour expiry

      if (shouldFetch) {
        try {
          // Attempt to fetch new recipes from the API
          const response = await fetch('https://www.thewebmasters.ca:4000/api/recipes/trending', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              number: '30'
            },
            body: JSON.stringify({ userId })
          })
          if (!response.ok) throw new Error('Network response was not ok.')
          const result = await response.json()
          this.recipes = result.recipes || []

          this.recipes = this.recipes.filter((recipe) => recipe.image)

          this.lastFetched = Date.now()
          this.updateLocalStorage()
          this.fullFetched = true
        } catch (error) {
          console.error('Error fetching new recipes:', error)
          this.recipes = []
          this.fullFetched = false // Adjust based on whether you want this to be true or false in case of error
        }
      } else {
        this.fullFetched = true
      }
    },

    // Method to update local storage with the current state
    updateLocalStorage() {
      localStorage.setItem(
        'newRecipesData',
        JSON.stringify({
          recipes: this.recipes,
          lastFetched: this.lastFetched,
          fullFetched: this.fullFetched
        })
      )
    },

    // Load the state from local storage
    loadFromStorage() {
      const storedData = localStorage.getItem('newRecipesData')
      if (storedData) {
        const data = JSON.parse(storedData)
        this.recipes = data.recipes || []
        this.lastFetched = data.lastFetched || null
      }
    },

    // Action to remove a specific recipe from the state
    removeRecipe(recipeId) {
      this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId)
      this.updateLocalStorage()
    },

    // Initialize the store (e.g., on app/component initialization)
    initializeStore() {
      this.loadFromStorage()
    }
  }
})
