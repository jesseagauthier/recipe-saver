import { defineStore } from 'pinia'

export const useSearchRecipeStore = defineStore('searchedRecipes', {
  state: () => ({
    recipes: [],
    errorMessage: '' // New state property for storing error messages
  }),
  actions: {
    async searchForRecipes(searchTerm) {
      this.errorMessage = ''
      try {
        const response = await fetch(`https://www.thewebmasters.ca:4000/api/recipes/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ searchTerm: searchTerm })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log(result)
        this.recipes = result.results || []
      } catch (error) {
        console.error('Error searching recipes:', error)
        this.errorMessage = 'Failed to search for recipes. Please try again.'
        this.recipes = []
      }
    }
  }
})
