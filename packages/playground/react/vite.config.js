import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspector from 'vite-plugin-click-to-vue-component'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspector(),
  ],
})
