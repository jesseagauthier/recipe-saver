<script setup>
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'
import isLoggedHeader from '../src/components/Header/IsloggedHeader.vue'
import NotLoggedInView from '@/views/NotLoggedInView.vue'
import isLoggedFooter from '../src/components/footer/isLoggedFooter.vue'
import { useUserStore } from './stores/NewUser.js'

const userStore = useUserStore()

const kinde = ref(null)
const isKindeReady = ref(false)
let isLoggedIn = ref(false)
let loggedUser = ref(null)

// Function to handle user data after login
const handleLogin = (user) => {
  isLoggedIn.value = user != null
  loggedUser.value = user
  if (isLoggedIn.value) {
    localStorage.setItem('user', JSON.stringify(user)) // Store user information
    userStore.createUser(user)
  }
}

onMounted(async () => {
  try {
    kinde.value = await createKindeClient({
      client_id: '5df7118754c445a39366d2b375cd294f',
      domain: 'https://recipesaver.kinde.com',
      redirect_uri: window.location.origin,
      on_redirect_callback: handleLogin
    })
    isKindeReady.value = true

    // Check for user data in localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      handleLogin(JSON.parse(storedUser))
    }
  } catch (error) {
    console.error('Error initializing Kinde:', error)
  }
})

const login = () => {
  if (isKindeReady.value) {
    kinde.value.login()
  }
}

const register = () => {
  if (isKindeReady.value) {
    kinde.value.register()
  }
}

const logout = () => {
  if (isKindeReady.value) {
    kinde.value.logout()
    window.location.href = 'https://app.jessegauthier.dev'
    localStorage.removeItem('user') // Clear stored user information
    isLoggedIn.value = false
    loggedUser.value = null
  }
}
</script>

<template>
  <div>
    <main v-if="!isLoggedIn" class="p-3">
      <NotLoggedInView :isKindeReady="isKindeReady" :login="login" :register="register" />
    </main>
    <main v-if="isLoggedIn" id="logged_in_view" class="">
      <isLoggedHeader :loggedUser="loggedUser" />
      <main class="px-3 md:px-6">
        <RouterView :loggedUser="loggedUser" :logout="logout" :isLoggedIn="isLoggedIn" />
      </main>
      <isLoggedFooter :loggedUser="loggedUser" :logout="logout" />
    </main>
  </div>
</template>

<style scoped></style>
