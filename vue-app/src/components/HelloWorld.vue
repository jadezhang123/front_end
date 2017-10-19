<template>
  <div class="hello">
    <h1 @bottom_click="bottomClick">{{ msg }}</h1>
    <router-view @nav_click="navClick"></router-view>
    <h2>Essential Links</h2>
    <router-link class="text-df" to="/foo" exact> to Foo</router-link>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
  import {EventBus} from '../resources'

  export default {
    name: 'HelloWorld',
    created: function () {
      EventBus.$on('bottom_click', this.bottomClick)
    },
    beforeDestroy: function () {
      EventBus.$off('bottom_click', this.bottomClick)
    },
    data: () => ({msg: 'Welcome to Your Vue.js App'}),
    methods: {
      navClick: function (index) {
        this.msg = 'nav ' + index + ' clicked'
      },
      bottomClick: function () {
        this.msg = 'bottom clicked'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
