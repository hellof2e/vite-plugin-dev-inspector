import * as Vue from 'vue'

export function loadVue(CONTAINER_ID, App) {
  Vue.createApp({
    render: () => Vue.h(App),
    devtools: {
      hide: true,
    },
  }).mount(`#${CONTAINER_ID}`)
}
