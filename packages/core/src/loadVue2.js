import Vue from 'vue'

export function loadVue(CONTAINER_ID, App) {
  new Vue({
    render: h => h(App),
    devtools: {
      hide: true,
    },
  }).$mount(`#${CONTAINER_ID}`)
}
