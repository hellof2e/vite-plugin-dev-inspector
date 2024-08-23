import inspectorOptions from 'virtual:dev-inspector-options'

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

  :host {
    --dev-inspector-primary: #42b883;
  }

  .dev-inspector-container {
    cursor: pointer;
    position: fixed;
    text-align: center;
    z-index: 9999;
    font-family: Arial, Helvetica, sans-serif;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
  }

  .dev-inspector-card {
    font-family: Arial, Helvetica, sans-serif;
    padding: 5px 8px;
    border-radius: 4px;
    text-align: left;
    color:#e9e9e9;
    font-size: 14px;
    background-color: var(--dev-inspector-primary);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  }

  .dev-inspector-floats {
    z-index: 9999;
    position: fixed;
    transform: translateX(-50%);
    transition: all 0.1s ease-in;
    pointer-events: none;
  }

  .dev-inspector-size-indicator {
    z-index: 9999;
    position: fixed;
    background-color:#42b88325;
    border: 1px solid #42b88350;
    border-radius: 5px;
    transition: all 0.1s ease-in;
    pointer-events: none;
  }

  .dev-inspector-button svg {
    width: 40px;
    height: 40px;
    fill: currentColor;
    color: #e4c9c9;
  }

  .dev-inspector-button--active svg {
    color: var(--dev-inspector-primary);
  }
  </style>

  <div data-v-inspector-ignore="true">
      <div
        class="dev-inspector-container"
        id="toggle-inspector-container"
      >
        <div class="dev-inspector-button" id="inspector-btn">
          <svg t="1723638626944" class="icon" viewBox="0 0 1190 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23581" width="200" height="200"><path d="M1175 155H994.8l-0.4-0.6c10-17.6 15.6-37.8 15.6-59 0-32.8-26.6-59.6-59.6-59.6H743.6c-128.6 0-233.2 102.8-237.2 230.4-66.4-17.2-117.4-64.6-151.6-142.4-7.4-17-24.2-28.2-42.8-28.4-19.6 0.4-35 10-43 26.8-20.8 43.8-31.2 90.6-31.2 138.8 0 140.2 105.2 267 247.2 301.2 8.2 2 16.4-3.6 18-12l5.6-29.2c1.4-7.8-3.6-15.2-11.4-17.2-114.8-28.2-199.8-130.2-199.8-242.8 0-30.4 5-59.8 15-88.2 54.6 105.2 141.4 160.4 252.8 160.4l0.2-59.6c0-98.6 80-178.6 178.6-178.6H950.8c0 24.8-15 45.8-36.6 54.8l38 46v174.6c0 12.8-8 24-20.2 28.2l-47.4 16.2c-17.4 6-30-5.2-34.4-11.6l-46.8-70.2-89.2-29.8V490c0 49.6-23.6 93.4-59.6 122v316.6h-119v-300l-194.2-43.2-59.8 166.4 44.8 176.8H219.2l-39.2-163.4c-2.4-10-2.2-20.2 0.6-30l51.4-173.8c-32.4-22.6-53.6-60-53.6-102.6 0-29.4 10.6-56.2 27.6-77.6-9.2-20.2-16.8-41-21.2-62.8-15 13-28.2 28-38.6 45-81 1.4-146.2 67.2-146.2 148.6v104.2c0 8.2 6.6 14.8 14.8 14.8h29.8c8.2 0 14.8-6.6 14.8-14.8V512c0-40 26.4-73.4 62.8-84.8-1.8 10.4-3.2 20.8-3.2 31.6 0 45 16.6 88 45.6 121.4l-40.8 138.2c-5.8 20-6.2 41-1.4 60.8l39.2 163.4c6.4 26.8 30.4 45.6 57.8 45.6h107c39 0 67.2-36.8 57.6-74.2l-40.4-159.2 35.8-100 96.4 21.4v252.2c0 32.8 26.6 59.6 59.6 59.6h119c32.8 0 59.6-26.6 59.6-59.6V638c38.2-40 59.6-92.6 59.6-148v-94l27 40.6c35.6 53.4 93 38.4 103.2 35l47.4-16.2c36.2-12.4 60.4-46.2 60.4-84.6v-120.6l172-68.2c12-8 6.2-27-8.6-27z m-312.4 59.4c0-16.4-13.4-29.8-29.8-29.8s-29.8 13.4-29.8 29.8 13.4 29.8 29.8 29.8 29.8-13.4 29.8-29.8z" p-id="23582"></path></svg>
        </div>
      </div>

    <div id="overlay-container">
      <div
        ref="floatsRef"
        class="dev-inspector-floats dev-inspector-card"
        id="floatsRef"
      >
        <div id="overlay-content"></div>
        <div class="tip">
          Click to go to the file
        </div>
      </div>
      <div
        class="dev-inspector-size-indicator"
        :style="sizeIndicatorStyle"
      />
    </div>
  </div>
`

class DevInspector extends HTMLElement {
  constructor() {
    super()
    this.enabled = false
    this.containerVisible = false
    this.isDragging = false
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
    !this.enabled && toggleInspectorContainer.classList.add('dev-inspector-container--disabled')
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
      btn.classList.add('dev-inspector-button--active')
    else
      btn.classList.remove('dev-inspector-button--active')
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
    const targetNode = this.root.querySelector('.dev-inspector-size-indicator')
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

  // button position
  containerPosition = () => {
    // draggable element 选中可拖动的元素
    const draggableElement = this.root.querySelector('#toggle-inspector-container')

    // toggle button visibility
    const { toggleButtonVisibility } = inspectorOptions
    if (toggleButtonVisibility === 'always' || (toggleButtonVisibility === 'active' && this.enabled)) {
      draggableElement.style.display = 'block'
      this.switchBtnVisible()
    }
    else {
      draggableElement.style.display = 'none'
    }

    // draggle element position
    if (window.localStorage.getItem('inspectorX') && window.localStorage.getItem('inspectorY')) {
      draggableElement.style.left = window.localStorage.getItem('inspectorX')
      draggableElement.style.top = window.localStorage.getItem('inspectorY')
    }

    let offsetX, offsetY

    draggableElement.addEventListener('mousedown', (e) => {
      this.isDragging = true
      offsetX = e.clientX - draggableElement.getBoundingClientRect().left
      offsetY = e.clientY - draggableElement.getBoundingClientRect().top
    })

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        draggableElement.style.left = `${e.clientX - offsetX}px`
        draggableElement.style.top = `${e.clientY - offsetY}px`
        window.localStorage.setItem('inspectorX', `${e.clientX - offsetX}px`)
        window.localStorage.setItem('inspectorY', `${e.clientY - offsetY}px`)
      }
    })

    document.addEventListener('mouseup', () => {
      if (this.isDragging)
        this.isDragging = false
    })
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

    // button position(draggable)
    this.containerPosition()

    // Expose control to global
    window.__DEV_INSPECTOR__ = this
  }
}

customElements.define('dev-inspector', DevInspector)
