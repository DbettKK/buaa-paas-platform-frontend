// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import 'ant-design-vue/dist/antd.css'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

axios.defaults.baseURL = 'http://V6home.fewings.xyz:5000'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(VueCodemirror)
Vue.use(Vuex)
Vue.use(VueAxios, axios)

Vue.prototype.API = 'https://V6home.fewings.xyz:5000'
// Vue.prototype.API = 'http://8.130.175.25:3306'
Vue.prototype.$qs = qs

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
