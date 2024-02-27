import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Replace '/my-vue-app/' with your GitHub repository name
// Use './' for local filesystem testing
const baseConfig = process.env.NODE_ENV === 'production' ? '/' : './'

export default defineConfig({
  base: baseConfig,

  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    sourcemap: true
  }
})
