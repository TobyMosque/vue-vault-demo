<template>
  <q-page class="flex flex-center">
    <div class="row">
      <div class="col col-12">
        page: {{uid}}
      </div>
      <div class="col col-12">
        app: {{appId}}
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
    console.log(this.uid, this.$vault)
    setInterval(() => {
      this.uid = uid()
    }, 1000)
  },
  computed: {
    appId () {
      return this.$vault.state.app.uid
    }
  }
})
</script>
