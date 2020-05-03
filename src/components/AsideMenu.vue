<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-vertical-demo"
    @select="handleSelect">
    <el-menu-item v-for="(item, index) in menus" :index="item.url" :key="index">
      <span slot="title">{{item.name}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AsideMenu',
  props: {
    menus: {
      type: Array
    }
  },
  computed: {
    activeIndex () {
      for (let i = 0; i < this.menus.length; i++) {
        let item = this.menus[i]
        if (this.$route.path.toLowerCase().startsWith(item.url.toLowerCase())) {
          return item.url
        }
      }
      if (this.menus.length > 0) {
        return this.menus[0].url
      } else {
        return ''
      }
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key)
      this.$router.push(key)
    }
  }
}
</script>

<style scoped>

</style>
