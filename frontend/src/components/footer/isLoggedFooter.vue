<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  loggedUser: Object,
  logout: Function
})
</script>

<template>
  <footer class="mt-5 footer footer-center p-10 bg-base-200 text-base-content rounded">
    <nav class="flex flex-wrap justify-evenly">
      <button @click="logout()" class="block btn btn-error">Log Out</button>
      <router-link to="/road-map" class="btn btn-accent">Roadmap</router-link>
      <router-link to="/stack" class="btn btn-accent">Application Tech-Stack</router-link>
    </nav>
    <aside>
      <p>Copyright © 2024 - All right reserved by Jesse Gauthier</p>
      <p>Powered By Spoonacular</p>
    </aside>
  </footer>
</template>

<style scoped></style>
