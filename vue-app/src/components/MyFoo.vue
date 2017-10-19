<template>
  <div>
    <div>{{msg}}</div>
    <div v-for="item in items">{{item}}</div>
  </div>
</template>

<script>
  import {Foo} from '../resources'

  export default {
    name: 'MyFoo',
    data: () => ({
      msg: 'this is foo',
      items: []
    }),
    beforeRouteEnter (to, from, next) {
      Foo.list().then(response => {
        next(vm => {
          vm.items = response.data || []
          vm.msg = 'msg changed to foo1'
        })
      })
    }
  }
</script>
