import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Inspector from 'vite-plugin-dev-inspector'

export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
    Inspector({
      toggleButtonVisibility: 'always',
      launchEditor: 'code',
    }),
  ],
})
