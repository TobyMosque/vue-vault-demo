// import something here
import inject from './inject '
import Vault from 'src/services/vault'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default inject(async ({ ssrContext }) => {
  const vault = new Vault()
  if (!ssrContext) {
    vault.replaceState(window.__VAULT_STATE__)
  } else {
    ssrContext.rendered = () => {
      ssrContext.vaultState = JSON.stringify(vault.state)
    }
  }
  return {
    vault: vault
  }
})
