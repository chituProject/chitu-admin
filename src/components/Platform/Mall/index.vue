<template>
  <div class="main-col">
    <div class="card-container">
      <el-menu
        router
        default-active="/platform/mall/page"
        mode="horizontal">
        <el-menu-item index="/platform/mall/page">页面配置</el-menu-item>
        <el-menu-item index="/platform/mall/jump_page">跳转路径</el-menu-item>
        <!--<el-menu-item index="/platform/mall/banner/HOME">首页banner</el-menu-item>-->
        <!--<el-menu-item index="/platform/mall/category">推荐品类</el-menu-item>-->
        <el-menu-item index="/platform/mall/goods/NEW">新品专区</el-menu-item>
        <el-menu-item index="/platform/mall/goods/PAST">往期热销</el-menu-item>
        <el-menu-item index="/platform/mall/goods/FORYOU">为你推荐</el-menu-item>
        <!--<el-menu-item index="/platform/mall/goods/SUPERIOR">热销精品</el-menu-item>-->
        <!--<el-menu-item index="/platform/mall/goods/HIGHLY">鼎力推荐</el-menu-item>-->
        <el-menu-item index="/platform/mall/banner/WATERFALL">线下瀑布流banner</el-menu-item>
      </el-menu>
      <div class="mall-child">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Mall'
}
</script>

<style scoped>
  .card-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .mall-child {
    position: absolute;
    top: 81px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    overflow-y: auto;
  }
</style>
