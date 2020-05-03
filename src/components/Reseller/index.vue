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
          name: '免单达人',
          url: '/reseller/individual',
          can: 'view Reseller'
        },
        {
          name: '线下合伙人',
          url: '/reseller/offline',
          can: 'view Reseller'
        }
      ],
      // badge
      overview: {}
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
