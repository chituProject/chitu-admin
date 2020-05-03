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
        {
          name: '用户列表',
          url: '/user/list',
          can: 'view User'
        },
        {
          name: '用户标签',
          url: '/user/tags',
          can: 'view User'
        },
        {
          name: '会员中心',
          url: '/user/vip',
          can: 'view User'
        },
        {
          name: '邀请助力',
          url: '/user/invite',
          can: 'view User'
        }
      ]
    }
  },
  computed: {
    visibleMenus () {
      return this.menus.filter(item => this.$can.apply(this, item.can.split(' ')))
    }
  }
}
</script>

<style scoped>

</style>
