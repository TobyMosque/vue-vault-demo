import Vue from 'vue'
import Vault from 'src/services/vault'
import global from './global'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

Vue.use(Vault)

export default async function ({ ssrContext }) {
  const Store = new Vault({
    modules: {
      global
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })
  return Store
}
