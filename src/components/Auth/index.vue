<template>
  <div class="container">
    <div class="row box">
      <div class="aside-menu">
        <aside-menu :menus="menus"></aside-menu>
        <yfooter></yfooter>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Yfooter from '@/components/Footer'
import AsideMenu from '@/components/AsideMenu'

export default {
  name: 'index',
  components: {
    AsideMenu,
    Yfooter
  },
  data () {
    return {
      menus: [
        // {
        //   name: '修改密码',
        //   url: '/auth/password'
        // },
        {
          name: '创建新用户',
          url: '/auth/create',
          can: 'edit Auth'
        },
        {
          name: '用户管理',
          url: '/auth/users',
          can: 'edit Auth'
        },
        {
          name: '角色管理',
          url: '/auth/role',
          can: 'edit Auth'
        },
        {
          name: '菜单管理',
          url: '/auth/menu',
          can: 'edit Auth'
        }
      ]
    }
  },
  computed: {
    visibleMenus () {
      return this.menus.filter(item =>
        this.$can.apply(this, item.can.split(' '))
      )
    }
  }
}
</script>

<style scoped>
</style>
