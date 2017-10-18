/**
 * Created by Zhang Junwei on 2017/10/18.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: resolve => require(['./components/HelloWorld.vue'], resolve),
    children: [
      {path: 'foo', component: resolve => require(['./components/MyFoo.vue'], resolve)}
    ]
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: routes,
  mode: 'hash',
  base: '/'
})

export default router
