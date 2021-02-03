<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <div class="row">
      <div class="col-12">
        <q-input v-model="$vault.test1.msg" outlined label="Model"></q-input>
      </div>
      <div class="col-12">
        State: {{$vault.state.test1.msg}}
      </div>
      <div class="col-12">
        Computed: {{$vault.test1.reverseMsg}}
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models'
import ExampleComponent from 'components/CompositionComponent.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'PageIndex',
  components: { ExampleComponent },
  setup () {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1'
      },
      {
        id: 2,
        content: 'ct2'
      },
      {
        id: 3,
        content: 'ct3'
      },
      {
        id: 4,
        content: 'ct4'
      },
      {
        id: 5,
        content: 'ct5'
      }
    ])
    const meta = ref<Meta>({
      totalCount: 1200
    })
    return { todos, meta }
  },
  mounted () {
    console.log('page', {
      t1Computed: this.$vault.test1.reverseMsg,
      t1Method: this.$vault.test1.reverse(this.$vault.state.test1.msg),
      t1State: this.$vault.state.test1.msg,
      t2Computed: this.$vault.test2.reverseMsg,
      t2Method: this.$vault.test2.reverse(this.$vault.state.test2.msg),
      t2State: this.$vault.state.test2.msg
    })
  }
})
</script>
