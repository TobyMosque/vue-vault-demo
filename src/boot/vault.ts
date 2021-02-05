import { boot } from 'quasar/wrappers'
import createVault from 'src/vault'
import Vault from 'src/vault/Vault'

declare module 'vuex' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface Store<S> {
    $vault: Vault
  }
}

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default boot(({ app, store }) => {
  const vault = createVault({ app })
  store.$vault = vault
  console.log('boot', {
    t1Computed: vault.test1.reverseMsg,
    t1Method: vault.test1.reverse(vault.state.test1.msg),
    t1State: vault.state.test1.msg,
    t2Computed: vault.test2.reverseMsg,
    t2Method: vault.test2.reverse(vault.state.test2.msg),
    t2State: vault.state.test2.msg
  })
})
