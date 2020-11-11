// import something here
import inject from './inject '
import Vault from 'src/services/vault'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default inject(async ({ ssrContext }) => {
  const vault = new Vault()
  if (!ssrContext) {
    const data = window.__VAULT_STATE__
    const keys = Object.keys(data)
    for (const key of keys) {
      vault.registerState(key, { data: data[key] })
    }
  }
  if (ssrContext) {
    ssrContext.rendered = () => {
      ssrContext.vaultState = JSON.stringify(vault.state)
    }
  }
  return {
    vault: vault
  }
})
