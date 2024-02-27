import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,
    status: '',
    errorMessage: ''
  }),
  actions: {
    async createUser(userInfo) {
      try {
        const response = await fetch('https://www.thewebmasters.ca:4000/api/users/new-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userInfo)
        })

        if (!response.ok) {
          throw new Error('Failed to create user')
        }

        const result = await response.json()
        this.user = result.user
        this.status = 'success'
      } catch (error) {
        console.error('Error creating user:', error)
        this.status = 'error'
        this.errorMessage = error.message || 'Unknown error occurred'
      }
    }
  }
})
