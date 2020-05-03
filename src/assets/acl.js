import store from '../store/index'

export const ACLRules = function(acl) {
  /**
   * 权限对象
   * 除统计信息以外其他权限对象都需和对应页面路由相同
   * 由于插件有Bug，暂时不支持权限对象名字全部小写。。。
   *
   * goods - 商品管理
   * orders - 订单管理
   * reseller - 合伙人
   * supplier - 供应商
   * customers - 客户服务
   * user - 用户管理
   * platform - 平台管理
   * gift - 锦礼君
   * stats - 统计信息
   */
  const categories = Object.keys(store.state.acl.acl)

  /**
   * 权限内容
   * view - 查看
   * edit - 编辑
   */
  const policies = ['view', 'edit']

  categories.forEach(category => {
    policies.forEach(policy => {
      acl.rule(policy, category, () => store.getters["acl/getAccess"](category, policy))
    })
  })
  console.log(acl)
}
