<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-select v-model="metric_query_key" class="selecter" placeholder="选择指标">
        <el-option
          v-for="item in metricOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="fund_query_key" class="selecter" placeholder="选择基金">
        <el-option
          v-for="item in fundList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div style="float: left;">
        <el-button type="secondary" size="medium" @click="selectAllFunds">全选基金</el-button>
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
      metricOptions: [
        {
          label: '空头仓位',
          value: '1'
        },
        {
          label: '基金管理费',
          value: '2'
        }
      ],
      fundList: [],
      model: {
        newUser: 5,
        helperNum: 2
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
    selectAllFunds () {
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
    getData () {
      let that = this
      this.$axios.post('/insider/settings/', {
        instances: [{
          func: 'get_current_scan_incoming_param',
          params: {}
        }]
      })
        .then(res => {
          console.log('get_current_scan_incoming_param', res.data)
          if (res.data.length >= 1 && res.data[0].code === 200) {
            that.model = {
              newUser: 5,
              helperNum: 2
            }
          }
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
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
