import { defineStore } from 'pinia'

export const useMealPlanStore = defineStore('mealPlan', {
  state: () => ({
    allowedMeals: ['breakfast', 'lunch', 'dinner', 'snack'],
    mealPlans: [], // This could be used to store meal plans fetched from the server
    error: null,
    isLoading: false // Add this line
    // Adding an error state to track any errors
  }),
  actions: {
    async saveMealPlan(mealPlanData) {
      console.log(mealPlanData)
      this.error = null // Reset error state before trying to save a new meal plan
      try {
        const response = await fetch(
          'https://www.thewebmasters.ca:4000/api/mealPlanRoutes/savemeal',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: mealPlanData })
          }
        )

        if (!response.ok) {
          // Handle HTTP errors
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        // Assuming result contains the saved meal plan, update state accordingly
        this.mealPlans.push(result)
      } catch (error) {
        console.error('Error saving meal plan:', error.message)
        this.error = error.message // Update the error state with the error message

        // Optionally, handle specific error scenarios, e.g., network issues, API errors, etc.
        if (error.name === 'TypeError') {
          console.error('Network or fetch operation failed:', error)
        }
        // More specific error handling can be added here based on your application's needs
      }
    },
    async fetchMealPlansForWeek(startDate, endDate, userId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch(
          'https://www.thewebmasters.ca:4000/api/mealPlanRoutes/getmealplansforweek',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, startDate, endDate })
          }
        )

        if (!response.ok) {
          this.isLoading = false
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const hold = await response.json()
        this.mealPlans = hold.mealPlans
      } catch (error) {
        this.isLoading = false
        console.error('Error fetching meal plans:', error.message)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
