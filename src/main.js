import Vue from 'vue'
import ElementUI from 'element-ui'
import Acl from 'vue-browser-acl'
import '../theme/index.css'
import App from './App.vue'


import router from './router'
import axios from './assets/axios'
import { ACLRules } from './assets/acl'
import store from './store'
import config from './config'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Acl, store.state.acl.acl, ACLRules, { router, failRoute: {path: '/index', replace: true} })

Vue.prototype.$axios = axios
Vue.prototype.$store = store
Vue.prototype.$config = config

new Vue({
  router,
  store,
  components: { App },
  render: h => h(App),
}).$mount('#app')
