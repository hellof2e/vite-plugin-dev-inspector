import inspectorOptions from 'virtual:vue-inspector-options'
import App from 'virtual:vue-inspector-path:Overlay.vue'

const CONTAINER_ID = 'vue-inspector-container'

function createInspectorContainer() {
  if (document.getElementById(CONTAINER_ID) != null)
    throw new Error('vueInspectorContainer element already exists')

  const el = document.createElement('div')
  el.setAttribute('id', CONTAINER_ID)
  document.getElementsByTagName('body')[0].appendChild(el)
  return el
}

async function load() {
  const isClient = typeof window !== 'undefined'
  if (!isClient)
    return
  createInspectorContainer()
  const { vue } = inspectorOptions
  // console.log('load inspectorOptions', vue, `loadVue${vue}`)

  let res = {}
  if (vue === 3)
    res = await import('./loadVue3.js')
  else
    res = await import('./loadVue2.js')

  res.loadVue(CONTAINER_ID, App)
}

if (inspectorOptions.lazyLoad)
  setTimeout(load, inspectorOptions.lazyLoad)
else
  load()
