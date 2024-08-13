import inspectorOptions from 'virtual:vue-inspector-options'

const base = inspectorOptions.base

const KEY_DATA = 'data-v-inspector'
const KEY_IGNORE = 'data-v-inspector-ignore'
const KEY_PROPS_DATA = '__v_inspector'

function createTemplate(containerVisible) {
  const template = document.createElement('template')
  template.innerHTML = `<style>
      *,::after,::before{
        box-sizing:border-box
      }

      :host{
        contain:content;
        display:inline-block;
      }


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

    <div>
      <div id="overlay-container" v-if="overlayVisible && linkParams">
        <div
          ref="floatsRef"
          class="vue-inspector-floats vue-inspector-card"
          id="floatsRef"
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
      </div>
    </div>
  `
  return template
}

class VueInspector extends HTMLElement {
  constructor() {
    super()
    this.enabled = false
    this.containerVisible = false
  }

  initContainerVisible() {
    const { toggleButtonVisibility } = inspectorOptions
    return toggleButtonVisibility === 'always' || (toggleButtonVisibility === 'active' && this.enabled)
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' })

    const template = createTemplate()
    shadowRoot.appendChild(template.content.cloneNode(true))

    const overlayContainer = shadowRoot.querySelector('#overlay-container')
    this.initContainerVisible()
    overlayContainer.style.display = this.containerVisible ? 'block' : 'none'

    console.log(overlayContainer, 111)

    // const { toggleButtonVisibility } = inspectorOptions

    // const root = shadowRoot.querySelector('.vue-inspector-container')
    // toggle.addEventListener('click', (e) => {
    //   toggle.classList.toggle('dark')

    //   if (toggle.classList.contains('dark'))
    //     turnOnLight(e)
    //   else
    //     turnOffLight()
    // })
  }
}

customElements.define('vue-inspector', VueInspector)
