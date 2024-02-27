import { defineStore } from 'pinia'

export const useSavedRecipesStore = defineStore('savedRecipes', {
  state: () => ({
    recipes: [],
    fullFetched: false,
    isLoading: false
  }),
  actions: {
    async fetchSavedRecipes(userId) {
      this.fullFetched = false
      this.isLoading = true
      try {
        const response = await fetch('https://www.thewebmasters.ca:4000/api/recipes/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        })
        const result = await response.json()
        this.recipes = result.recipes || []
        this.fullFetched = true
      } catch (error) {
        console.error('Error fetching saved recipes:', error)
        this.recipes = [] // Reset in case of an error
      } finally {
        this.isLoading = false // Indicate loading has ended
      }
    },
    async deleteRecipe(recipeId) {
      // Remove the recipe from the local state optimistically
      this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId)

      try {
        const response = await fetch(
          `https://www.thewebmasters.ca:4000/api/recipes/delete/${recipeId}`,
          {
            method: 'DELETE', // Correct method as per backend
            // Assuming authentication headers if necessary, e.g., a bearer token
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          // If the server responds with an error, throw to catch block
          throw new Error('Failed to delete recipe')
        }

        // Handle success response, logging or user feedback
        console.log('Recipe deleted successfully')
      } catch (error) {
        console.error('Error deleting recipe:', error)
      }
    },
    async saveRecipe(recipe, userId) {
      // const recipeData = {
      //   id: recipe.id,
      //   t  itle: recipe.title,
      //   image: recipe.image,
      //   imageType: recipe.imageType,
      //   userId: userId
      // }

      recipe.userId = userId
      try {
        const response = await fetch('https://www.thewebmasters.ca:4000/api/recipes/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(recipe)
        })

        if (!response.ok) {
          const errorData = await response.json() // Capture error data if available
          throw new Error(
            JSON.stringify({
              status: response.status,
              message: errorData.message || 'Failed to save recipe'
            })
          )
        }

        const data = await response.json()
        console.log('Recipe saved:', data)

        // Add to local state with additional server-side confirmation if needed
        this.recipes.push({ ...recipe, isSaved: true })
        await this.fetchSavedRecipes(userId)
      } catch (error) {
        const errorInfo = JSON.parse(error.message)
        console.error('Error in saving recipe:', errorInfo.message)
      }
    }
  }
})
