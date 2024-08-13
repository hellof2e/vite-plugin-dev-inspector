import type { VNode } from 'vue'
import type { ComponentRenderProxy } from '@vue/composition-api'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends ComponentRenderProxy {}
    interface ElementAttributesProperty {
      $props: any // specify the property name to use
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
