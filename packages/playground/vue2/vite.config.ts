import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import inspector from 'vite-plugin-dev-inspector'

export default defineConfig({
  plugins: [
    createVuePlugin({
      jsx: true,
      jsxOptions: {
        compositionAPI: true,
      },
    }),
    inspector({
      toggleButtonVisibility: 'always', // always：一直展示, never：隐藏, active
    }) as any,
  ],
})
