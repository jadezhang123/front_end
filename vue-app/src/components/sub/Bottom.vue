<template>
  <div>
    <button @click="click">{{msg}}</button>
  </div>
</template>

<script>
  import {EventBus} from '../../resources'

  export default {
    name: 'Bottom',
    data: () => ({
      msg: 'bottom'
    }),
    methods: {
      click: function (index) {
        this.msg = 'bottom changed'
        EventBus.$emit('bottom_click')
      }
    }
  }
</script>

