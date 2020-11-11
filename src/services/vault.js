import Vue from 'vue'

export default class Vault {
  constructor ({ state = {} } = {}) {
    this.state = state
  }

  registerState (namespace, { data }) {
    if (!this.state[namespace]) {
      const state = Vue.observable(typeof data === 'function' ? data() : data)
      this.state[namespace] = typeof state === 'function' ? state() : state
    }
  }

  registerModule (namespace, { data }) {
    if (!this.state[namespace]) {
      this.registerState(namespace, { data })
    }
  }

  unregisterModule (namespace) {
    if (!this.state[namespace]) {
      delete this.state[namespace]
    }
  }

  static page (namespace, { data, destroyed, preFetch, ...options }) {
    return {
      async preFetch (context) {
        const { store } = context
        const vault = store.$vault
        if (!vault.state[namespace]) {
          vault.registerModule(namespace, { data })
          context.vault = store.$vault
          context.data = store.$vault.state[namespace]
          context.axios = store.$axios
          if (preFetch) {
            await preFetch(context)
          }
        }
      },
      data () {
        return this.$vault.state[namespace]
      },
      destroyed () {
        delete this.$vault.unregisterModule(namespace)
        if (preFetch) {
          destroyed.bind(this)()
        }
      },
      ...options
    }
  }
}
