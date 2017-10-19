<template>
  <div>
    <ul>
      <li v-for="(item, index) in items" @click="click(index)">{{item}}</li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'Nav',
    data: () => ({
      items: ['home', 'doc', 'download']
    }),
    methods: {
      click: function (index) {
        this.$set(this.items, index, 'change')
        this.$emit('nav_click', index)
      }
    }
  }
</script>

