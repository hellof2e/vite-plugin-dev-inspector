
## Introduction

A vite plugin which provides the ability that to jump to the local IDE when you click the element of browser automatically. It supports Vue2 & 3 & SSR.

## Installation

```bash

# vite-plugin-dev-inspector

npm install vite-plugin-dev-inspector -D


```

## Usage

### Configuration Vite

```ts
// for Vue2

import { defineConfig, } from 'vite'
import { createVuePlugin, } from 'vite-plugin-vue2'
import Inspector from 'vite-plugin-dev-inspector'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    Inspector({
      vue: 2
    }),
  ],
})
```

```ts
// for Vue3

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Inspector from 'vite-plugin-dev-inspector'

export default defineConfig({
  plugins: [Vue(), Inspector()],
})
```

```ts
// for react

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspector from 'vite-plugin-dev-inspector'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspector(),
  ],
})
```

```ts
// for preact

import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import Inspector from 'vite-plugin-dev-inspector'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    Inspector(),
  ],
})
```


```ts
// for svelte

import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Inspector from 'vite-plugin-dev-inspector'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    Inspector(),
  ],
})
```


```ts
// for solid

import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import Inspector from 'vite-plugin-dev-inspector'

export default defineConfig({
  plugins: [
    svelte(),
    Inspector(),
  ],
})
```

### Options


```ts
interface VitePluginInspectorOptions {
  /**
   * Vue version
   * @default 3
   */
  vue?: 2 | 3

  /**
   * Default enable state
   * @default false
   */
  enabled?: boolean

  /**
   * Define a combo key to toggle inspector
   * @default 'control-shift' on windows, 'meta-shift' on other os
   *
   * any number of modifiers `control` `shift` `alt` `meta` followed by zero or one regular key, separated by -
   * examples: control-shift, control-o, control-alt-s  meta-x control-meta
   * Some keys have native behavior (e.g. alt-s opens history menu on firefox).
   * To avoid conflicts or accidentally typing into inputs, modifier only combinations are recommended.
   * You can also disable it by setting `false`.
   */
  toggleComboKey?: string | false

  /**
   * Toggle button visibility
   * @default 'active'
   */
  toggleButtonVisibility?: 'always' | 'active' | 'never'

  /**
   * Toggle button display position
   * @default top-right
   */
  toggleButtonPos?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

  /**
   * append an import to the module id ending with `appendTo` instead of adding a script into body
   * useful for frameworks that do not support trannsformIndexHtml hook (e.g. Nuxt3)
   *
   * WARNING: only set this if you know exactly what it does.
   */
  appendTo?: string | RegExp

  /**
   * Customize openInEditor host (e.g. http://localhost:3000)
   * @default false
   * @deprecated This option is deprecated and removed in 5.0. The plugin now automatically detects the correct host.
   */
  openInEditorHost?: string | false

  /**
   * lazy load inspector times (ms)
   * @default false
   */
  lazyLoad?: number | false

  /**
   * disable inspector on editor open
   * @default false
   */
  disableInspectorOnEditorOpen?: boolean

  /**
   * Hide information in VNode and produce clean html in DevTools
   *
   * Currently, it only works for Vue 3
   *
   * @default true
   */
  cleanHtml?: boolean

  /**
   * Target editor when open in editor
   *
   * @default code (Visual Studio Code)
   */
  launchEditor?: 'appcode' | 'atom' | 'atom-beta' | 'brackets' | 'clion' | 'code' | 'code-insiders' | 'codium' | 'emacs' | 'idea' | 'notepad++' | 'pycharm' | 'phpstorm' | 'rubymine' | 'sublime' | 'vim' | 'visualstudio' | 'webstorm'
}
```


## Notes
Vite-plugin-dev-inspector is fork from [vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector) and I rewrote it in order to better serve my working scenarios.

## License

[MIT LICENSE](./LICENSE)
