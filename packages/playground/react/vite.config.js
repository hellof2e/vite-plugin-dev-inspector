import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspector from 'vite-plugin-component-inspector'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspector(),
  ],
})
