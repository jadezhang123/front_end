// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import messages from './assets/local/zh_CN'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 添加事件中心
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

Vue.use(VeeValidate, {
  locale: 'zhCN',
  dictionary: {
    zhCN: {messages}  // 注册VeeValidate中文提示
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
