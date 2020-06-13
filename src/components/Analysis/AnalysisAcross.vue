<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-select v-model="metric_query_key" class="selecter" placeholder="XX基金">
        <el-option
          v-for="item in metricOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input
        class="search"
        v-model="input"
        placeholder="钱数（元）"
        clearable>
      </el-input>
      <div style="float: left; padding-top: 10px;">
        <el-button type="secondary" size="medium" @click="addComponent">添加</el-button>
      </div>
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="exportData">导出</el-button>
        <el-button type="primary" size="medium" @click="exportDataAsImg">导出为图片</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form ref="settingForm" :model="model" :rules="rules" class="demo-table-expand" label-width="160px" label-position="left">
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalysisCreate',
  data () {
    return {
      loading: false,
      metric_query_key: '',
      fund_query_key: '',
      metric_query_value: '',
      fund_query_value: '',
      metricOptions: [],
      fundList: [],
      model: {
      },
      rules: {
      }
    }
  },
  methods: {
    exportData () {
      // todo
    },
    exportDataAsImg () {
      // todo
    },
    addComponent () {
      // todo
    },
    handleMerchantChange (uuid) {
      this.brand = []
      let that = this
      this.merchant.forEach(item => {
        if (item.uuid === uuid) {
          that.brand = item.brand
        }
      })
      this.model.brand = ''
    },
    getData () {}
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  .search {
    width: 120px;
  }
  .filter-container {
    padding: 12px;
  }
  .demo-table-expand {
    margin: 0 20px 20px;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand .el-form-item {
    width: 360px;
    /*margin-right: 0;*/
    margin-bottom: 0;
    padding-bottom: 20px;
  }
  .card-container {
    position: relative;
  }
  .divider {
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
    background-color: #efeded;
  }
  .title {
    font-size: 20px !important;
    /*font-weight: bold;*/
    text-align: left;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .divider + .title {
    margin-top: 40px;
  }
  .demo-table-expand label {
    /*width: 90px;*/
    color: #99a9bf;
  }
  .flex-section {
    display: flex;
    /*width: 400px;*/
  }
</style>
