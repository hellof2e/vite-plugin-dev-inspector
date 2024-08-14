import inspectorOptions from 'virtual:vue-inspector-options'

const base = inspectorOptions.base

const KEY_DATA = 'data-v-inspector'
const KEY_PROPS_DATA = '__v_inspector'

function getData(el) {
  return el?.__vnode?.props?.[KEY_PROPS_DATA] ?? el?.getAttribute?.(KEY_DATA)
}

const template = document.createElement('template')
template.innerHTML = `<style>
  *,::after,::before{
    box-sizing: border-box;
  }

  .vue-inspector-container {
    cursor: pointer;
    position: fixed;
    text-align: center;
    z-index: 9999;
    font-family: Arial, Helvetica, sans-serif;
    top: 15px;
    right: 15px;
  }

  .vue-inspector-card {
    font-family: Arial, Helvetica, sans-serif;
    padding: 5px 8px;
    border-radius: 4px;
    text-align: left;
    color:#e9e9e9;
    font-size: 14px;
    background-color:#42b883;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  }

  .vue-inspector-floats {
    z-index: 9999;
    position: fixed;
    transform: translateX(-50%);
    transition: all 0.1s ease-in;
    pointer-events: none;
  }

  .vue-inspector-size-indicator {
    z-index: 9999;
    position: fixed;
    background-color:#42b88325;
    border: 1px solid #42b88350;
    border-radius: 5px;
    transition: all 0.1s ease-in;
    pointer-events: none;
  }

  .vue-inspector-button {
    color: #e4c9c9;
  }

  .vue-inspector-button--active {
    color: #42b883;
  }
  </style>

  <div data-v-inspector-ignore="true">
      <div
        class="vue-inspector-container"
        id="toggle-inspector-container"
      >
        <div class="vue-inspector-button" id="inspector-btn">
          Code Inspector
        </div>
      </div>

    <div id="overlay-container">
      <div
        ref="floatsRef"
        class="vue-inspector-floats vue-inspector-card"
        id="floatsRef"
      >
        <div id="overlay-content"></div>
        <div class="tip">
          Click to go to the file
        </div>
      </div>
      <div
        class="vue-inspector-size-indicator"
        :style="sizeIndicatorStyle"
      />
    </div>
  </div>
`

class VueInspector extends HTMLElement {
  constructor() {
    super()
    this.enabled = false
    this.containerVisible = false

    this.toggleCombo = inspectorOptions.toggleComboKey?.toLowerCase?.()?.split?.('-') ?? false
    this.disableInspectorOnEditorOpen = inspectorOptions.disableInspectorOnEditorOpen ?? true

    this.overlayVisible = false
    this.linkParams = {
      file: '',
      line: 0,
      column: 0,
    }
    this.position = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    this.root = null
  }

  switchBtnVisible = () => {
    const toggleInspectorContainer = this.root.querySelector('#toggle-inspector-container')
    !this.enabled && toggleInspectorContainer.classList.add('vue-inspector-container--disabled')
  }

  toggleEventListener = () => {
    const listener = this.enabled ? document.body.addEventListener : document.body.removeEventListener

    listener?.call(document.body, 'mousemove', this.updateLinkParams)
    listener?.call(document.body, 'resize', this.closeOverlay, true)
    listener?.call(document.body, 'click', this.handleClick, true)
  }

  // toggle overlay visibility
  toggleOverlayVisibility = () => {
    const overlayContainer = this.root.querySelector('#overlay-container')
    if (this.enabled)
      overlayContainer.style.display = (this.overlayVisible && this.linkParams) ? 'block' : 'none'
    else
      overlayContainer.style.display = 'none'
  }

  // toggle button style
  toggleBtnVisible = () => {
    const btn = this.root.querySelector('#inspector-btn')
    if (this.enabled)
      btn.classList.add('vue-inspector-button--active')
    else
      btn.classList.remove('vue-inspector-button--active')
  }

  toggleEnabled = () => {
    this.enabled = !this.enabled
    this.overlayVisible = false
    this.toggleEventListener()

    this.toggleBtnVisible()
    this.toggleOverlayVisibility()
  }

  onKeydown = (event) => {
    if (event.repeat || event.key === undefined)
      return

    const isCombo = this.toggleCombo?.every(key => this.isKeyActive(key, event))
    if (isCombo)
      this.toggleEnabled()
  }

  isKeyActive = (key, event) => {
    switch (key) {
      case 'shift':
      case 'control':
      case 'alt':
      case 'meta':
        return event.getModifierState(key.charAt(0).toUpperCase() + key.slice(1))
      default:
        return key === event.key.toLowerCase()
    }
  }

  getTargetNode = (e) => {
    const splitRE = /(.+):([\d]+):([\d]+)$/
    const path = e.path ?? e.composedPath()
    if (!path) {
      return {
        targetNode: null,
        params: null,
      }
    }
    const ignoreIndex = path.findIndex(node => node?.hasAttribute?.('data-v-inspector-ignore'))
    const targetNode = path.slice(ignoreIndex + 1).find(node => getData(node))
    if (!targetNode) {
      return {
        targetNode: null,
        params: null,
      }
    }
    const match = getData(targetNode)?.match(splitRE)
    const [_, file, line, column] = match || []
    return {
      targetNode,
      params: match
        ? {
            file,
            line,
            column,
            title: file,
          }
        : null,
    }
  }

  handleClick = (e) => {
    const { targetNode, params } = this.getTargetNode(e)
    if (!targetNode)
      return
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    const { file, line, column } = params
    this.overlayVisible = false

    // close inspector and init state
    this.toggleEnabled()

    // open in editor
    const url = new URL(
      `${base}__open-in-editor?file=${encodeURIComponent(`${file}:${line}:${column}`)}`,
      import.meta.url,
    )

    this.openInEditor(url)
  }

  floatsStyle = () => {
    let margin = 10
    let x = this.position.x + (this.position.width / 2)
    let y = this.position.y + this.position.height + 5

    const floatsRef = this.root.querySelector('#floatsRef')
    let floatsWidth = floatsRef?.clientWidth ?? 0
    let floatsHeight = floatsRef?.clientHeight ?? 0

    x = Math.max(margin, x)
    x = Math.min(x, window.innerWidth - floatsWidth - margin)

    y = Math.max(margin, y)
    y = Math.min(y, window.innerHeight - floatsHeight - margin)

    floatsRef.style.left = `${x}px`
    floatsRef.style.top = `${y}px`

    const overlayContent = this.root.querySelector('#overlay-content')
    overlayContent.innerHTML = `${this.linkParams.file}:${this.linkParams.line}:${this.linkParams.column}`
  }

  // update size indicator style
  sizeIndicatorStyle = () => {
    const targetNode = this.root.querySelector('.vue-inspector-size-indicator')
    targetNode.style.left = `${this.position.x}px`
    targetNode.style.top = `${this.position.y}px`
    targetNode.style.width = `${this.position.width}px`
    targetNode.style.height = `${this.position.height}px`
  }

  // update mouseover element info
  updateLinkParams = (e) => {
    const { targetNode, params } = this.getTargetNode(e)

    if (targetNode) {
      const rect = targetNode.getBoundingClientRect()
      this.overlayVisible = true
      this.position.x = rect.x
      this.position.y = rect.y
      this.position.width = rect.width
      this.position.height = rect.height
      this.linkParams = params

      // update style
      this.toggleOverlayVisibility()
      this.floatsStyle()
      this.sizeIndicatorStyle()
    }
    else {
      this.closeOverlay()
    }
  }

  closeOverlay = () => {
    this.overlayVisible = false
    this.linkParams = {
      file: '',
      line: 0,
      column: 0,
    }
  }

  openInEditor = (baseUrl, file, line, column) => {
    /**
     * Vite built-in support
     * https://github.com/vitejs/vite/blob/d59e1acc2efc0307488364e9f2fad528ec57f204/packages/vite/src/node/server/index.ts#L569-L570
     */
    // https://cloud.tencent.com/developer/article/1835877?areaSource=102001.15&traceId=F7-WEDPvu7nSiKRqwwIwl
    const _url = baseUrl instanceof URL ? baseUrl : `${baseUrl}/__open-in-editor?file=${encodeURIComponent(`${file}:${line}:${column}`)}`
    const promise = fetch(
      _url,
      {
        mode: 'no-cors',
      },
    )

    if (this.disableInspectorOnEditorOpen)
      promise.then(this.disable)

    return promise
  }

  connectedCallback() {
    this.root = this.attachShadow({ mode: 'closed' })
    this.root.appendChild(template.content.cloneNode(true))

    this.toggleCombo && document.body.addEventListener('keydown', this.onKeydown)
    // bind keydown event
    this.toggleEventListener()

    // bind button click event
    const btn = this.root.querySelector('#inspector-btn')
    btn.onclick = this.toggleEnabled

    // toggle overlay visibility
    this.toggleOverlayVisibility()

    // toggle button visibility
    const toggleInspectorContainer = this.root.querySelector('#toggle-inspector-container')
    const { toggleButtonVisibility } = inspectorOptions
    if (toggleButtonVisibility === 'always' || (toggleButtonVisibility === 'active' && this.enabled)) {
      toggleInspectorContainer.style.display = 'block'
      this.switchBtnVisible()
    }
    else {
      toggleInspectorContainer.style.display = 'none'
    }

    // Expose control to global
    window.__VUE_INSPECTOR__ = this
  }
}

customElements.define('vue-inspector', VueInspector)
