import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import Inspector from 'vite-plugin-click-to-vue-component'

export default defineConfig({
  plugins: [
    createVuePlugin({
      jsx: true,
      jsxOptions: {
        compositionAPI: true,
      },
    }),

    // viteExternalsPlugin({
    //   'vue': 'Vue',
    // }),

    Inspector({
      toggleButtonVisibility: 'always',
      // enabled: true,
      // disableInspectorOnEditorOpen: true,
    }),
  ],

  // optimizeDeps: {
  //   include: optimizedInclude(),
  //   exclude: [],
  // },
})

// function optimizedInclude() {
//   return [
//     'qs',
//     'vue-clipboard2',
//     'mockjs',
//     'nprogress',
//     '@hb/vue-bd-header-nav',
//     'resize-observer-polyfill',
//     'throttle-debounce',
//   ]
// }
