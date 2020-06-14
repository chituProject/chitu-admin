<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="exportData">导出为excel</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="fundList">
      <div class="card-container">
        <div class="title">选择基金
          <el-button type="primary" size="medium" @click="selectFundsConfirm">确认基金选择</el-button>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" border size="medium">全选基金</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedFunds" @change="handleCheckedFundsChange">
          <div style="margin: 24px;">
            <div class="fs-18 line-30">经理基金</div> 
            <el-checkbox v-for="item in manager_funds" :label="item" :key="item.id">{{item.name}}</el-checkbox>
          </div>
          <div style="margin: 24px;">
            <div class="fs-18 line-30">指数基金</div> 
            <el-checkbox v-for="item in index_funds" :label="item" :key="item.id">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>

        <template v-if="isConfirmedFunds">
          <div class="title">选择指标
            <el-button type="primary" size="medium" @click="selectMetricsConfirm">确认指标选择</el-button>
          </div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group :max="10" v-model="checkedFunds" @change="handleCheckedFundsChange">
            <el-checkbox v-for="item in manager_funds" :label="item" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
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
      isConfirmedFunds: false,
      // list
      fundList: [],
      manager_funds: [],
      index_funds: [],
      checkAll: false,
      checkedFunds: [],
      isIndeterminate: true,
      metricList: [],
      selectedMetrics: [],
    }
  },
  methods: {
    exportData () {
      // TODO: 导出为EXCEL
    },
    selectFundsConfirm () {
      this.isConfirmedFunds = true
      // TODO: 向后台发送请求，获取所有key
    },
    selectMetricsConfirm () {
      // TODO: 向后台发送请求，生成table
    },
    getData () {
      this.loading = true
      this.$axios.get('/insider/fund_archive/')
        .then(res => {
          for (let i = 0; i < res.data.results.length; ++i) {
            if (res.data.results[i].visible === 'TRUE') {
              res.data.results[i].visibility = true
            } else {
              res.data.results[i].visibility = false
            }
            if (res.data.results[i].type === 'MANAGER') {
              this.manager_funds.push(res.data.results[i])
            } else {
              this.index_funds.push(res.data.results[i])
            }
          }
          this.fundList = res.data.results
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCheckAllChange(val) {
      this.checkedFunds = val ? this.fundList : [];
      console.log(this.checkedFunds)
      this.isIndeterminate = false;
    },
    handleCheckedFundsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.fundList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fundList.length;
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
  .flex-section {
    display: flex;
    /*width: 400px;*/
  }
</style>
