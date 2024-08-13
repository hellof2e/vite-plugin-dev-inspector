<script>
import inspectorOptions from 'virtual:vue-inspector-options'

const base = inspectorOptions.base

const KEY_DATA = 'data-v-inspector'
const KEY_IGNORE = 'data-v-inspector-ignore'
const KEY_PROPS_DATA = '__v_inspector'

function getData(el) {
  return el?.__vnode?.props?.[KEY_PROPS_DATA] ?? el?.getAttribute?.(KEY_DATA)
}

export default {
  name: 'VueInspectorOverlay',
  data() {
    return {
      floatsRef: null,
      enabled: inspectorOptions.enabled,
      toggleCombo: inspectorOptions.toggleComboKey?.toLowerCase?.()?.split?.('-') ?? false,
      disableInspectorOnEditorOpen: inspectorOptions.disableInspectorOnEditorOpen ?? true,
      overlayVisible: false,
      position: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      linkParams: {
        file: '',
        line: 0,
        column: 0,
      },
      KEY_IGNORE,
    }
  },
  computed: {
    containerVisible() {
      const { toggleButtonVisibility } = inspectorOptions
      return toggleButtonVisibility === 'always' || (toggleButtonVisibility === 'active' && this.enabled)
    },
    containerPosition() {
      return inspectorOptions.toggleButtonPos
        .split('-')
        .map(p => `${p}: 15px;`)
        .join('')
    },
    floatsStyle() {
      let margin = 10
      let x = this.position.x + (this.position.width / 2)
      let y = this.position.y + this.position.height + 5
      const floatsRef = this.$refs.floatsRef
      let floatsWidth = floatsRef?.clientWidth ?? 0
      let floatsHeight = floatsRef?.clientHeight ?? 0

      x = Math.max(margin, x)
      x = Math.min(x, window.innerWidth - floatsWidth - margin)

      y = Math.max(margin, y)
      y = Math.min(y, window.innerHeight - floatsHeight - margin)

      return {
        left: `${x}px`,
        top: `${y}px`,
      }
    },
    sizeIndicatorStyle() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`,
        width: `${this.position.width}px`,
        height: `${this.position.height}px`,
      }
    },
  },
  watch: {
    enabled: {
      handler(val, oldVal) {
        if (val === oldVal)
          return
        if (val)
          this.onEnabled()
        else
          this.onDisabled()
      },
    },
  },
  mounted() {
    this.toggleCombo && document.body.addEventListener('keydown', this.onKeydown)
    this.toggleEventListener()

    // Expose control to global
    window.__VUE_INSPECTOR__ = this
  },
  methods: {
    toggleEventListener() {
      const listener = this.enabled ? document.body.addEventListener : document.body.removeEventListener

      listener?.call(document.body, 'mousemove', this.updateLinkParams)
      listener?.call(document.body, 'resize', this.closeOverlay, true)
      listener?.call(document.body, 'click', this.handleClick, true)
    },
    toggleEnabled() {
      this.enabled = !this.enabled
      this.overlayVisible = false
      this.toggleEventListener()
    },
    onKeydown(event) {
      if (event.repeat || event.key === undefined)
        return

      const isCombo = this.toggleCombo?.every(key => this.isKeyActive(key, event))
      if (isCombo)
        this.toggleEnabled()
    },
    isKeyActive(key, event) {
      switch (key) {
        case 'shift':
        case 'control':
        case 'alt':
        case 'meta':
          return event.getModifierState(key.charAt(0).toUpperCase() + key.slice(1))
        default:
          return key === event.key.toLowerCase()
      }
    },
    isChildOf(ele, target) {
      if (!ele || ele === document)
        return false
      return ele === target ? true : this.isChildOf(ele.parentNode, target)
    },
    getTargetNode(e) {
      const splitRE = /(.+):([\d]+):([\d]+)$/
      const path = e.path ?? e.composedPath()
      if (!path) {
        return {
          targetNode: null,
          params: null,
        }
      }
      const ignoreIndex = path.findIndex(node => node?.hasAttribute?.(KEY_IGNORE))
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
    },
    handleClick(e) {
      const { targetNode, params } = this.getTargetNode(e)
      if (!targetNode)
        return
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      const { file, line, column } = params
      this.overlayVisible = false

      // open in editor
      const url = new URL(
        `${base}__open-in-editor?file=${encodeURIComponent(`${file}:${line}:${column}`)}`,
        import.meta.url,
      )

      this.openInEditor(url)
    },
    updateLinkParams(e) {
      const { targetNode, params } = this.getTargetNode(e)
      if (targetNode) {
        const rect = targetNode.getBoundingClientRect()
        this.overlayVisible = true
        this.position.x = rect.x
        this.position.y = rect.y
        this.position.width = rect.width
        this.position.height = rect.height
        this.linkParams = params
      }
      else {
        this.closeOverlay()
      }
      this.onUpdated()
    },
    closeOverlay() {
      this.overlayVisible = false
      this.linkParams = {
        file: '',
        line: 0,
        column: 0,
      }
    },

    // Public methods
    enable() {
      if (this.enabled)
        return
      this.toggleEnabled()
    },
    disable() {
      if (!this.enabled)
        return
      this.toggleEnabled()
    },
    openInEditor(baseUrl, file, line, column) {
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
    },
    onUpdated() {
      // to be replaced programmatically
    },
    onEnabled() {
      // to be replaced programmatically
    },
    onDisabled() {
      // to be replaced programmatically
    },
  },
}
</script>

<template>
  <div v-bind="{ [KEY_IGNORE]: 'true' }">
    <div
      v-if="containerVisible"
      class="vue-inspector-container"
      :style="containerPosition"
      :class="{ 'vue-inspector-container--disabled': !enabled }"
    >
      <div :class="`vue-inspector-button ${enabled ? 'vue-inspector-button--active' : ''}`" @click.prevent.stop="toggleEnabled">
        Code Inspector
      </div>
    </div>

    <!-- Overlay -->
    <template v-if="overlayVisible && linkParams">
      <div
        ref="floatsRef"
        class="vue-inspector-floats vue-inspector-card"
        :style="floatsStyle"
      >
        <div>{{ linkParams.title }}:{{ linkParams.line }}:{{ linkParams.column }}</div>
        <div class="tip">
          Click to go to the file {{ overlayVisible }}
        </div>
      </div>
      <div
        class="vue-inspector-size-indicator"
        :style="sizeIndicatorStyle"
      />
    </template>
  </div>
</template>

<style scoped>
.vue-inspector-container {
  cursor: pointer;
  position: fixed;
  text-align: center;
  z-index: 2147483647;
  font-family: Arial, Helvetica, sans-serif;
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
  z-index: 2147483647;
  position: fixed;
  transform: translateX(-50%);
  transition: all 0.1s ease-in;
  pointer-events: none;
}

.vue-inspector-size-indicator {
  z-index: 2147483646;
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
