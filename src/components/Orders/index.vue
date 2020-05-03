<template>
  <div class="container">
    <div class="row box">
      <div class="aside-menu">
        <aside-menu :menus="visibleMenus"></aside-menu>
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
          name: '订单列表',
          url: '/orders',
          can: 'view Orders'
        },
        {
          name: '子订单列表',
          url: '/orders/sub',
          can: 'view Orders'
        },
        {
          name: '免单生活',
          url: '/orders/life',
          can: 'view Orders'
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
