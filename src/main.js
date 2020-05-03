// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import ElementUI from 'element-ui'
import Acl from 'vue-browser-acl'
import '../theme/index.css'
import App from './App'
import router from './router'
import axios from './assets/axios'
import { ACLRules } from './assets/acl'
import store from './store'
import config from './config'
import { formatPrice, formatTime } from '@/assets/util'

const options = {
  release: '2.6', // 当前应用版本
  environment: 'production', // process.env.NODE_ENV, 指定为production才会上报
  allowDuplicates: false, // 允许相同错误重复上报
  sampleRate: 1, // 采样率
  autoBreadcrumbs: {
    console: true
  }
}

Raven
  .config(config.ravenUrl, options)
  .addPlugin(RavenVue, Vue)
  .install()

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Acl, store.state.acl.acl, ACLRules, { router, failRoute: {path: '/index', replace: true} })
Vue.prototype.$axios = axios
Vue.prototype.$store = store
Vue.prototype.$config = config

Vue.filter('formatPrice', value => {
  if (!value) return 0
  return formatPrice(value, 'float')
})

Vue.filter('formatPriceFixed', value => {
  if (!value) return 0
  return formatPrice(value, 'fixed')
})

Vue.filter('formatTime', value => {
  if (!value) return ''
  return formatTime(value)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
