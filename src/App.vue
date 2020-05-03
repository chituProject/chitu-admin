<template>
  <div id="app">
    <el-container>
      <el-header>
        <yheader></yheader>
      </el-header>
      <router-view></router-view>
      <!--<el-footer>-->
      <!--<yfooter></yfooter>-->
      <!--</el-footer>-->
    </el-container>
  </div>
</template>

<script>
import yheader from '@/components/Header.vue'
import yfooter from '@/components/Footer.vue'

export default {
  components: { yheader, yfooter },
  name: 'App',
  mounted () {
  }
}
</script>

<style>
  div {
    font-size: 12px;
  }
  span {
    font-size: 12px;
  }
  label {
    font-size: 12px;
  }
  p {
    font-size: 12px;
  }
  @font-face {
    font-family: 'iconfont';  /* project id 834670 */
    src: url('//at.alicdn.com/t/font_834670_1aqk795ickv.eot');
    src: url('//at.alicdn.com/t/font_834670_1aqk795ickv.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_834670_1aqk795ickv.woff') format('woff'),
    url('//at.alicdn.com/t/font_834670_1aqk795ickv.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_834670_1aqk795ickv.svg#iconfont') format('svg');
  }
.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  /*-moz-osx-font-smoothing: grayscale;*/
  text-align: center;
  color: #2c3e50;
}
.box {
  text-align: center;
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
}
.aside-menu {
  border-top: 1px solid #e6e6e6;
  height: 100%;
  overflow: auto;
  width: 200px;
  position: relative;
}
.main-col {
  top: 0;
  bottom: 0;
  height: 100%;
  overflow: auto;
  background-color: rgb(239,237,237);
  flex: 1;
  position: relative;
}
.el-menu-vertical-demo {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
}
label {
  margin-bottom: 0;
}

div .el-tabs__content {
  position: inherit !important;
}
input[type='number'] {
  -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='file'] {
  display: none;
}
.required {
  color: #F56C6C;
  font-weight: bold;
}

.blue_button {
  border-color: #66a4e7;
  background-color: white;
  color: #66a4e7;
}
.blue_button:hover {
  border-color: #66a4e7;
  background-color: #66a4e7;
  color: white;
}
.blue_button_filled {
  border-color: #66a4e7;
  background-color: #66a4e7;
  color: white;
}
.blue_button_filled:hover {
  /*border-color: #87CEFA;*/
  /*background-color: #87CEFA;*/
  border-color: rgba(125, 177, 234, 1);
  background-color: rgba(125, 177, 234, 1);
  color: white;
}
.main {
  position: absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  background-color: #fff;
  overflow:auto;
  z-index:30;
  background-color: rgb(239,237,237);
}
.filter-container {
  width: 100%;
  position: absolute;
  height: 60px;
  left: 0;
  right: 0;
  background-color: #f8f6f6;
}
.selecter {
  width: 10%;
  margin-top: 10px;
  margin-left: 20px;
  float: left;
}
.search {
  width: 30%;
  margin-top: 10px;
  margin-left: 20px;
  float: left;
}
.search-button {
  margin-top: 12px;
  margin-left: 20px;
  float: left;
  min-width: 100px;
}
  @media (min-width: 1500px) {
    .search-button {
      min-width: 125px;
    }
  }
.search-button + .search-button {
  margin-left: 20px;
}
.card-outer {
  position: absolute;
  width: 100%;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
}
.card-container {
  margin: 10px;
  background-color: #ffffff;
  padding: 10px;
}
.card {
  z-index: 0;
  margin: 20px;
  background-color: #fafafa;
}
.pagination {
  padding: 16px 0;
  background-color: #ffffff;
  margin: 0;
}
.demo-table-expand {
  font-size: 0;
  text-align: left;
  word-break: break-all;
}
.left {
  float: left;
}
.right {
  float: right;
}
</style>
