<template>
  <q-page class="row items-center justify-evenly">
    <div style="min-width: 400px" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="col-12">
            <q-input v-model="msg" outlined label="Model From Page"></q-input>
          </div>
          <div class="col-12">
            Data: {{msg}}
          </div>
          <div class="col-12">
            Computed: {{reverseMsg}}
          </div>
          <div class="col-12">
            Composed: {{composedMsg}}
          </div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <div class="col-12">
            <q-input v-model="$d.msg" outlined label="Model From Vault"></q-input>
          </div>
          <div class="col-12">
            Data: {{$d.msg}}
          </div>
          <div class="col-12">
            Computed: {{$d.reverseMsg}}
          </div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <div class="col-12">
            <q-input v-model="$vault.test1.msg" outlined label="Model From Test 1 Module"></q-input>
          </div>
          <div class="col-12">
            Data: {{$vault.test1.msg}}
          </div>
          <div class="col-12">
            State: {{$vault.state.test1.msg}}
          </div>
          <div class="col-12">
            Computed: {{$vault.test1.reverseMsg}}
          </div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <div class="col-12">
            <q-input v-model="$vault.test2.msg" outlined label="Model From Test 2 Module"></q-input>
          </div>
          <div class="col-12">
            Data: {{$vault.test2.msg}}
          </div>
          <div class="col-12">
            State: {{$vault.state.test2.msg}}
          </div>
          <div class="col-12">
            Computed: {{$vault.test2.reverseMsg}}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineVaultComponent } from 'src/vault/Vault'
import { computed, defineComponent, getCurrentInstance } from 'vue'

interface PageIndexState {
  msg: string
}

interface PageIndexApp extends PageIndexState {
  readonly reverseMsg : string
  reverse: (text: string) => string
}

const component = defineComponent({
  name: 'PageIndex',
  vaultPreFetch ({ vault }) {
    const $d = vault['page-index'] as PageIndexApp
    $d.msg = 'Olá Mundo!'
    console.log('prefetch:', $d, $d.msg, $d.reverseMsg, $d.reverse($d.msg))
  },
  setup () {
    const vm = getCurrentInstance()
    const app = vm?.proxy as unknown as PageIndexApp
    // vm.proxy will be ready only after the setup is finished,
    // so app.msg, app.reverseMsg and app.reverse will not be accessible right now,
    // but u can use them in composables, like methods and computed
    return {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      composedMsg: computed(() => app.reverse(app.msg))
    }
  },
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  mounted () {
    console.log('data:', this.msg, this.reverseMsg, this.reverse(this.msg))
    console.log('state:', this.$d.msg, this.$d.reverseMsg, this.$d.reverse(this.$d.msg))
  },
  computed: {
    $d () {
      return this.$vault['page-index'] as PageIndexApp
    },
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

export default defineVaultComponent('page-index', component)
</script>
