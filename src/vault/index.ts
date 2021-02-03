import Vault from './Vault'
import Test1 from './modules/test1'
import Test2 from './modules/test2'
import { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $vault: Vault
  }
}

export default function ({ app } : { app: App }) : Vault {
  const vault = new Vault({
    modules: {
      test2: Test2
    }
  })
  vault.registerModule('test1', Test1)
  app.use(vault)
  return vault
}
