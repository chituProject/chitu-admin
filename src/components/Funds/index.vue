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
          name: '基金列表',
          url: '/funds/list',
          can: 'view Goods'
        },
        {
          name: '批量导入基金',
          url: '/funds/upload',
          can: 'edit Goods'
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
