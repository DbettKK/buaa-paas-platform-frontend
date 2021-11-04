import Vue from 'vue'
import Router from 'vue-router'
import Index from '../view/index.vue'
import Test from '../view/Test.vue'
import Register from '../view/Register.vue'
import Login from '../view/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
