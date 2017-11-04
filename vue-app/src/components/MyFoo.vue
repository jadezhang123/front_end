<template>
  <div>
    <div>{{msg}}</div>
    <div v-for="item in items">{{item}}</div>
    <div class="column is-12">
      <label class="label" for="email">Email</label>
      <p class="control">
        <input id="email" v-validate data-rules="required|email"
               :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="Email">
        <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
      </p>
    </div>
    <button @click="submit">submit</button>
  </div>
</template>

<script>
  // import {Foo} from '../resources'

  export default {
    name: 'MyFoo',
    data: () => ({
      msg: 'this is foo',
      items: []
    }),
    beforeRouteEnter (to, from, next) {
//      Foo.list().then(response => {
//        next(vm => {
//          vm.items = response.data || []
//          vm.msg = 'msg changed to foo1'
//        })
//      })

      next(vm => {
        vm.items = []
        vm.msg = 'msg changed to foo1'
      })
    },
    methods: {
      submit: () => {
      }
    }
  }
</script>
<style>
  .is-danger {
    color: red;
  }
</style>
