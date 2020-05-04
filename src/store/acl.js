import axios from '@/assets/axios'

const state = {
  /**
   * 0: 不可查看，不可编辑
   * 1: 可查看，不可编辑
   * 2: 可查看，可编辑
   */
  acl: {
    'Goods': 2,
    'Analysis': 2,
    'User': 2
  }
}

const policies = ['view', 'edit']

const dict = {
  'Goods': '基金管理',
  'Analysis': '基金分析',
  'User': '用户管理'
}

const mutations = {
  setACL: (state, acl) => {
    state.acl = acl
  }
}

const getters = {
  getAccess: (state) => (category, policy) => {
    const policyIndex = policies.indexOf(policy)
    const access = state.acl[category]
    if (!access || policyIndex < 0) {
      return false
    }
    return access > policies.indexOf(policy)
  },
  getKeys: () => {
    return dict
  }
}

const actions = {
  set: ({ commit }, info) => {
    const temp = { ...dict }
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(temp)) {
      temp[key] = 0
    }
    Object.assign(temp, info)
    // commit('setACL', temp)
  },
  clear: ({ commit, dispatch }) => {
    dispatch('set', null)
    axios.get('/insider/session/')
      .then(res => {
        dispatch('set', res.data.user.acl)
      })
  }
}

export const acl = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
