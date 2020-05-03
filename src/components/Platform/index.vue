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
          name: '品类管理',
          url: '/platform/category',
          can: 'view Platform'
        },
        {
          name: '商城设置',
          url: '/platform/mall',
          can: 'view Platform'
        },
        {
          name: '会员设置',
          url: '/platform/vip',
          can: 'view Platform'
        },
        {
          name: '场景管理',
          url: '/platform/reseller',
          can: 'view Platform'
        },
        {
          name: '搜索管理',
          url: '/platform/keyword',
          can: 'view Platform'
        },
        {
          name: '免单生活',
          url: '/platform/offpaylife',
          can: 'view Platform'
        },
        {
          name: '商品抢购',
          url: '/platform/rush',
          can: 'view Platform'
        },
        {
          name: '平台参数',
          url: '/platform/redPacket',
          can: 'view Platform'
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
