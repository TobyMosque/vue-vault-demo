import { defineComponent } from 'vue'

interface TestState {
  msg: string
}

interface TestApp extends TestState {
  readonly reverseMsg : string
  reverse: (text: string) => string
}

declare module 'src/vault/Vault' {
  interface VaultApps {
    test2: TestApp
  }
  interface VaultState {
    test2: TestState
  }
}

export default defineComponent({
  data () {
    return {
      msg: 'Hello World'
    }
  },
  computed: {
    reverseMsg () : string {
      return this.reverse(this.msg)
    }
  },
  methods: {
    reverse (text: string) : string {
      return text.split('').reverse().join('')
    }
  }
})
