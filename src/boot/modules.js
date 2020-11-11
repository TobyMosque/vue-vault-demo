// make sure that boot is registered after the vault
import { uid } from 'quasar'

export default async ({ app }) => {
  const vault = app.vault
  vault.registerModule('app', {
    data () {
      return {
        uid: ''
      }
    },
    computed: {
      reversed () {
        return this.uid.split('').reverse().join('')
      }
    },
    methods: {
      newId () {
        this.uid = uid()
      }
    }
  })

  await new Promise(resolve => setTimeout(resolve, 1000))
  vault.app.newId()
}
