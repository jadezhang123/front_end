<template>
  <div class="hello">
    <div>{{msg}}</div>
  </div>
</template>

<script>
  export default {
    name: 'MyFoo',
    data: () => ({msg: 'this is foo'}),
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.msg = 'this is foo2'
      })
    },
    methods: {}
  }
</script>
