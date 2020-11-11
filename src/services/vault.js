import Vue from 'vue'

export default class Vault {
  constructor ({ state = {}, modules = {} } = {}) {
    this.state = state
    this.gettersMap = new Map()
    this.getters = {}
    this.modules = modules
  }

  registerState (namespace, { data }) {
    if (!this.state[namespace]) {
      const state = Vue.observable(typeof data === 'function' ? data() : data)
      this.state[namespace] = typeof state === 'function' ? state() : state
    }
  }

  registerModule (namespace, { data, methods, computed, state, mutations, actions, getters, ...props }) {
    data = data || state
    this.registerState(namespace, { data })
    if (!this[namespace]) {
      methods = methods || {}
      computed = computed || {}
      mutations = mutations || {}
      actions = actions || {}
      getters = getters || {}

      const self = this
      const mutationKeys = Object.keys(mutations)
      const actionKeys = Object.keys(actions)
      const getterKeys = Object.keys(getters)

      for (const mutation of mutationKeys) {
        methods[`mutation/${mutation}`] = function (payload) {
          return mutations[mutation](self.state[namespace], payload)
        }
      }
      for (const action of actionKeys) {
        methods[`action/${action}`] = function (payload) {
          return actions[action](this.__context, payload)
        }
      }
      const __getters = {}
      for (const getter of getterKeys) {
        methods[`getter/${getter}`] = function () {
          const { state, getters: __getters, rootState, rootGetters } = this.__context
          return getters[getter](state, __getters, rootState, rootGetters)
        }
        computed[getter] = function () {
          return this[`getter/${getter}`]()
        }
        const property = {
          get () {
            return self[namespace][getter]
          }
        }
        Object.defineProperty(self.getters, `${namespace}/${getter}`, property)
        Object.defineProperty(__getters, getter, property)
      }
      this.gettersMap.set(namespace, __getters)

      const options = {
        name: `module-${namespace}`,
        data () {
          return self.state[namespace]
        },
        render: h => h('div'),
        computed: {
          ...computed,
          __context () {
            return {
              state: self.state[namespace],
              rootState: self.state,
              dispatch: this.dispatch,
              commit: this.commit,
              getters: self.gettersMap.get(namespace),
              rootGetters: self.getters
            }
          }
        },
        methods: {
          ...methods,
          dispatch (name, payload, { root = false } = {}) {
            return self.dispatch(root ? name : `${namespace}/${name}`, payload)
          },
          commit (name, payload, { root = false } = {}) {
            return self.commit(root ? name : `${namespace}/${name}`, payload)
          }
        },
        ...props
      }
      this[namespace] = new Vue(options)
      this[namespace].$mount()
    }
  }

  unregisterModule (namespace) {
    const isRegistered = !!this[namespace]
    if (isRegistered) {
      const keys = Object.keys(this.getters)
      for (const key of keys) {
        if (key.startsWith(`${namespace}/`)) {
          delete this.getters[key]
        }
      }
      this.gettersMap.delete(namespace)
      this[namespace].$destroy()
      delete this[namespace]
      delete this.state[namespace]
    }
  }

  replaceState (data) {
    if (process.env.CLIENT) {
      const keys = Object.keys(data)
      for (const key of keys) {
        this.registerState(key, { data: data[key] })
      }
    }
  }

  configure () {
    const keys = Object.keys(this.modules)
    for (const key of keys) {
      this.registerModule(key, this.modules[key])
    }
  }

  dispatch (name, payload) {
    let [type, method] = name.split('/')
    const instance = this[type]
    instance.$emit(`action:${name}`, payload)
    return new Promise(resolve => {
      if (instance[`action/${method}`]) {
        method = `action/${method}`
      }
      const response = instance[method](payload)
      if (response && response.then) {
        return response.then(resolve)
      } else {
        return resolve(response)
      }
    })
  }

  commit (name, payload) {
    let [type, method] = name.split('/')
    const instance = this[type]
    instance.$emit(`mutation:${name}`, payload)
    if (instance[`mutation/${method}`]) {
      method = `mutation/${method}`
    }
    return instance[method](payload)
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

  static install (Vue, options) {
    Vue.mixin({
      beforeCreate () {
        const options = this.$options
        if (options.store) {
          this.$store = options.store
        } else if (options.parent) {
          this.$store = options.parent.$store
        }
      }
    })
  }
}
