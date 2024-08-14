import inspectorOptions from 'virtual:dev-inspector-options'

import './overlay.js' // import Custom Element

const CONTAINER_ID = 'dev-inspector-container'

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
  document.body.innerHTML += '<dev-inspector></dev-inspector>'
}

if (inspectorOptions.lazyLoad)
  setTimeout(load, inspectorOptions.lazyLoad)
else
  load()
