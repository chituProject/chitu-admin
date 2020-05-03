import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { acl } from './acl'

Vue.use(Vuex)

let store = new Vuex.Store({
  modules: {
    acl
  },
  plugins: [createPersistedState({
    key: 'offpay-admin',
    paths: ['username', 'uuid']
  })],
  state: {
    token: '',
    username: '',
    merchant: null,
    uuid: '',
    categories: [],
    jumpPages: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      console.log('token updated: ', state.token)
    },
    SET_USERNAME: (state, username) => {
      state.username = username
      localStorage.username = username
      console.log('username updated: ', state.username)
    },
    SET_MERCHANT: (state, merchant) => {
      state.merchant = merchant
      console.log('merchant updated: ', state.merchant)
    },
    SET_UUID: (state, uuid) => {
      state.uuid = uuid
      console.log('uuid updated: ', state.uuid)
    },
    SET_CATEGORIES: (state, categories) => {
      state.categories = categories
      console.log('categories updated: ', state.categories)
    },
    SET_JUMPPAGES: (state, jumpPages) => {
      state.jumpPages = jumpPages
      console.log('jumpPages updated: ', state.jumpPages)
    }
  }
})

export default store
