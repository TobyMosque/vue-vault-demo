import {
  App,
  h,
  reactive,
  createApp,
  defineComponent,
  ComponentOptionsWithoutProps,
  ComponentPublicInstance
} from 'vue'

import { preFetch as $preFetch } from 'quasar/wrappers'
import { PreFetchOptions } from '@quasar/app'

type Modules = Record<string, ComponentOptionsWithoutProps>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class VaultApps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-undef
  [key: string]: unknown | ComponentPublicInstance
}

export interface VaultState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-undef
  [key: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-undef
export default class Vault extends VaultApps {
  state: VaultState
  private roots: Record<string, Element>
  private builders: Record<string, App<Element>>
  public constructor ({ modules } : { modules: Modules } = { modules: {} }) {
    super()
    this.state = {} as VaultState
    this.roots = {}
    this.builders = {}
    const keys = Object.keys(modules)
    for (const key of keys) {
      this.registerModule(key, modules[key])
    }
  }

  install (app: App) {
    app.config.globalProperties.$vault = this
  }

  private getType (instance: unknown) : string {
    const type = Object.prototype.toString.call(instance).split(' ')[1]
    return type.substr(0, type.length - 1).toLowerCase()
  }

  /* eslint-disable @typescript-eslint/ban-types */
  private getData (data: unknown) : object {
    const dataType = this.getType(data)
    const dataFn : () => object = dataType === 'function' ? data as () => object : () => data as object
    return dataFn()
  }
  /* eslint-enable @typescript-eslint/ban-types */

  registerState (namespace: string, { data }: { data: unknown }) {
    if (!this.state[namespace]) {
      const dataObj = this.getData(data)
      const state = reactive(dataObj)
      const stateObj = this.getData(state)
      this.state[namespace] = stateObj
    }
  }

  registerModule (namespace: string, { data, ...props } : ComponentOptionsWithoutProps) {
    this.registerState(namespace, { data })
    if (!this[namespace]) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      this.roots[namespace] = document.createElement('div')
      this.builders[namespace] = createApp({
        name: `module-${namespace}`,
        data () {
          return self.state[namespace]
        },
        render () {
          return h('div')
        },
        ...props
      })
      const app = this.builders[namespace].mount(this.roots[namespace])
      this[namespace] = app
    }
  }

  unregisterModule (namespace: string) {
    if (!this.state[namespace]) {
      this.builders[namespace].unmount(this.roots[namespace])
      delete this[namespace]
      delete this.roots[namespace]
      delete this.builders[namespace]
      delete this.state[namespace]
    }
  }

  replaceState (data: Record<string, unknown>) {
    if (process.env.CLIENT) {
      const keys = Object.keys(data)
      for (const key of keys) {
        this.registerState(key, { data: data[key] })
      }
    }
  }
}

export interface VaultPreFetchOptions extends PreFetchOptions<unknown> {
  vault : Vault
}

export type VaultPrefetchCallback = (
  options: VaultPreFetchOptions
// eslint-disable-next-line @typescript-eslint/ban-types
) => void | Promise<void> | Promise<{}>

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    vaultPreFetch?: VaultPrefetchCallback;
  }
}

export function defineVaultComponent (namespace: string, options: ComponentOptionsWithoutProps) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { preFetch, vaultPreFetch, computed, methods, data, unmounted, ...otherOptions } = options
  const $options : ComponentOptionsWithoutProps = {
    preFetch: $preFetch(async (options) => {
      const { store } = options
      const vault = store.$vault
      if (!vault.state[namespace]) {
        vault.registerModule(namespace, { data, computed, methods })
      }
      if (preFetch) {
        await preFetch(options)
      }
      if (vaultPreFetch) {
        await vaultPreFetch({ vault, ...options })
      }
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data () : any {
      return this.$vault.state[namespace]
    },
    unmounted () {
      this.$vault.unregisterModule(namespace)
      if (unmounted && preFetch) {
        unmounted.bind(this)()
      }
    },
    computed,
    methods,
    ...otherOptions
  }

  const component = defineComponent($options)
  return component
}
