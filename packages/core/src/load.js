import inspectorOptions from 'virtual:vue-inspector-options'

import './overlay.js' // import Custom Element

const CONTAINER_ID = 'vue-inspector-container22'

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

  document.body.innerHTML += '<wcs-inspector></wcs-inspector>'
}

if (inspectorOptions.lazyLoad)
  setTimeout(load, inspectorOptions.lazyLoad)
else
  load()
