// make sure that boot is registered after the vault
import { uid } from 'quasar'

export default async ({ app }) => {
  const vault = app.vault
  vault.registerModule('app', {
    data () {
      return {
        id: ''
      }
    }
  })

  await new Promise(resolve => setTimeout(resolve, 1000))
  vault.state.app.uid = uid()
}
