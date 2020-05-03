<template>
  <div class="page">
    <img src="../../static/empty.png" style="margin: 200px auto 20px auto">
    <div>咦~，还没有数据呢~</div>
  </div>
</template>

<script>
export default {
  name: 'EmptyPage'
}
</script>

<style scoped>
.page {
  background-color: white;
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  top: 10px;
  flex: auto;
}
</style>
