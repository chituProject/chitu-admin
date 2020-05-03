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
          name: '锦礼列表',
          url: '/gift/list',
          can: 'view Gift'
        },
        {
          name: '锦礼商品',
          url: '/gift/goods',
          can: 'view Gift'
        },
        {
          name: '抽奖列表',
          url: '/gift/lottery',
          can: 'view Gift'
        },
        {
          name: '锦礼订单',
          url: '/gift/orders',
          can: 'view Gift'
        },
        {
          name: '锦礼售后',
          url: '/gift/aftersales',
          can: 'view Gift'
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
