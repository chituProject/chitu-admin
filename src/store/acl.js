import axios from '@/assets/axios'

const state = {
  /**
   * 0: 不可查看，不可编辑
   * 1: 可查看，不可编辑
   * 2: 可查看，可编辑
   */
  acl: {
    'Goods': 2,
    'Orders': 2,
    'Reseller': 2,
    'Supplier': 2,
    'Customers': 2,
    'User': 2,
    'Platform': 2,
    'Gift': 2,
    'Stats': 1,
    'Auth': 2
  }
}

const policies = ['view', 'edit']

const dict = {
  'Goods': '商品管理',
  'Orders': '订单管理',
  'Reseller': '合伙人',
  'Supplier': '供应商',
  'Customers': '客户服务',
  'User': '用户管理',
  'Platform': '平台管理',
  'Gift': '锦鲤君',
  'Stats': '首页统计',
  'Auth': '权限管理'
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
