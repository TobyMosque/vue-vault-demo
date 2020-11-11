<template>
  <q-page class="flex flex-center">
    <div class="row">
      <div class="col col-12">
        page: {{uid}}
      </div>
      <div class="col col-12">
        app: {{appId}}
      </div>
      <div class="col col-12">
        app direct: {{$vault.app.uid}}
      </div>
      <div class="col col-12">
        app reversed: {{$vault.app.reversed}}
      </div>
      <div class="col col-12">
        store state: {{storeUid}}
      </div>
      <div class="col col-12">
        store getters: {{reversed}}
      </div>
    </div>
  </q-page>
</template>

<script>
import Vault from 'src/services/vault'
import { uid } from 'quasar'

export default Vault.page('page-index', {
  name: 'PageIndex',
  async preFetch ({ data, axios, store, currentRoute, redirect }) {
    // const { data } = await this.$axios.get('...' + this.$route.params.id)
    // this.uid = data
    // the promise with setTimeout tries to mimic a http request, like the above one.
    await new Promise(resolve => setTimeout(resolve, 1000))
    data.uid = uid()
  },
  data () {
    return {
      uid: ''
    }
  },
  mounted () {
    setInterval(() => {
      this.uid = uid()
      this.$vault.app.newId()
      this.newId()
    }, 1000)
  },
  computed: {
    storeUid () {
      return this.$store.state.global.uid
    },
    appId () {
      return this.$vault.state.app.uid
    },
    reversed () {
      return this.$store.getters['global/reversed']
    }
  },
  methods: {
    newId () {
      this.$store.dispatch('global/newId')
    }
  }
})
</script>
