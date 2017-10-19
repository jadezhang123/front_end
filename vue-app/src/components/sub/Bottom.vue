<template>
  <div>
    <button @click="click">{{msg}}</button>
  </div>
</template>

<script>
  export default {
    name: 'Bottom',
    data: () => ({
      msg: 'bottom'
    }),
    methods: {
      click: function (index) {
        this.msg = 'bottom changed'
        this.$eventHub.$emit('bottom_click')
      }
    }
  }
</script>

