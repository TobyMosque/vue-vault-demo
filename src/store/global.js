import { uid } from 'quasar'

export default {
  state () {
    return {
      uid: ''
    }
  },
  mutations: {
    uid (state, value) {
      state.uid = value
    }
  },
  getters: {
    reversed (state) {
      return state.uid.split('').reverse().join('')
    }
  },
  actions: {
    newId ({ commit }) {
      commit('uid', uid())
    }
  }
}
