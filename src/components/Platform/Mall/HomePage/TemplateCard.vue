<template>
  <div class="default-size container">
    <div class="row" v-if="item.banner_type !== 'NULL'">
      <img v-for="(banner, i) in item.homepage_banner_item" :key="i" :src="banner.picture" alt="" class="banner-pic"/>
    </div>
    <div class="row" v-if="item.goods_list.length > 0">
      <img v-for="i in [0, 1, 2]" :key="i" v-if="item.goods_list[i]" :src="item.goods_list[i].main_picture" alt="" class="goods-pic"/>
    </div>
    <div class="row" v-if="item.goods_list.length > 3">
      <img v-for="i in [3, 4, 5]" :key="i" v-if="item.goods_list[i]" :src="item.goods_list[i].main_picture" alt="" class="goods-pic"/>
    </div>
    <div class="row" v-if="item.goods_list.length > 6 && item.banner_type === 'NULL'">
      <img v-for="i in [6, 7, 8]" :key="i" v-if="item.goods_list[i]" :src="item.goods_list[i].main_picture" alt="" class="goods-pic"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplateCard',
  props: {
    item: {
      default: {}
    }
  }
}
</script>

<style scoped>
  .default-size {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    text-align: center;
  }
  .goods-pic {
    width: 30%;
  }
  .banner-pic {
    width: 100%;
  }
</style>
