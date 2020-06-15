<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="exportData">导出为excel</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="fundList">
      <div class="card-container">
        <div class="title">
          选择基金
          <el-button style="margin: 0 12px" type="primary" size="medium" @click="selectFundsConfirm">确认基金选择</el-button>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" border size="medium">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedFunds" @change="handleCheckedFundsChange">
          <div style="margin: 24px;text-align:left;">
            <div class="fs-18 line-30 main-color" style="margin:12px 0;">经理基金</div> 
            <el-checkbox style="margin:8px;" v-for="item in manager_funds" :label="item" :key="item.id">{{item.name}}</el-checkbox>
          </div>
          <div style="margin: 24px;text-align:left;">
            <div class="fs-18 line-30 main-color" style="margin:12px 0;">指数基金</div> 
            <el-checkbox style="margin:8px;" v-for="item in index_funds" :label="item" :key="item.id">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>

        <template v-if="isConfirmedFunds">
          <div class="title">选择指标
            <el-button style="margin: 0 12px" type="primary" size="medium" @click="selectMetricsConfirm">确认指标选择</el-button>
          </div>
          <el-checkbox-group :max="5" v-model="checkedMetrics">
            <div style="margin: 24px;text-align:left;" v-if="fund_data">
              <div class="fs-18 line-30 main-color" style="margin:12px 0;">基金档案</div> 
              <el-checkbox style="margin:8px;" v-for="item in fund_data" :label="item" :key="item">{{item}}</el-checkbox>
            </div>
            <div style="margin: 24px;text-align:left;" v-if="fund_achievement">
              <div class="fs-18 line-30 main-color" style="margin:12px 0;">基金业绩</div> 
              <el-checkbox style="margin:8px;" v-for="item in fund_achievement" :label="item" :key="item">{{item}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </template>
      </div>
      <template v-if="fundAchievementTable.length > 0">
        <div class="title"> 基金业绩 </div>
        <el-table
          :data="fundAchievementTable"
          border
          stripe
          class="table"
          style="width: 100%"
        >
          <el-table-column
            v-for="(header, key) in fundAchievementHeader"
            :key="key"
            :label="header"
          >
            <template slot-scope="scope">
            {{fundAchievementTable[scope.$index][key]}}
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template v-if="fundArchiveTable.length > 0">
        <div class="title"> 基金档案 </div>
        <el-table
          :data="fundArchiveTable"
          border
          stripe
          class="table"
          style="width: 100%"
        >
          <el-table-column
            v-for="(header, key) in fundArchiveHeader"
            :key="key"
            :label="header"
          >
            <template slot-scope="scope">
            {{fundArchiveTable[scope.$index][key]}}
            </template>
          </el-table-column>
        </el-table>
      </template>
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
      checkedMetrics: [],
      isIndeterminate: true,
      fund_achievement: [],
      fund_data: [],
      idsStr: '',
      metricsStr: '',
      fundAchievementTable: [],
      fundAchievementHeader: ['基金名称'],
      fundArchiveTable: [],
      fundArchiveHeader: ['基金名称']
    }
  },
  methods: {
    exportData () {
      // TODO: 导出为EXCEL
    },
    selectFundsConfirm () {
      this.isConfirmedFunds = true
      let idsStr = ''
      this.checkedFunds.map((data,index) => {
        idsStr += index === 0 ? `${data.id}` : `,${data.id}`
      })
      this.idsStr = idsStr
      this.$axios.get(`/insider/fund_archive/get_fund/?id=${idsStr}`).then(res => {
        this.fund_achievement = res.data.fund_achievement
        this.fund_data = res.data.fund_data
      })
    },
    selectMetricsConfirm () {
      let fundachievementsStr = '', fundarchiveStr = '', f1 = 0, f2 = 0
      this.fundAchievementHeader = ['基金名称']
      this.fundArchiveHeader = ['基金名称']
      this.checkedMetrics.map((data) => {
        if (this.fund_achievement.indexOf(data) > -1) {
          fundachievementsStr += f1 === 0 ? `${data}` : `,${data}`
          this.fundAchievementHeader.push(data)
          f1 += 1
        }
        else {
          fundarchiveStr += f2 === 0 ? `${data}` : `,${data}`
          this.fundArchiveHeader.push(data)
          f2 += 1
        }
      })
      this.$axios.get(`/insider/fund_archive/get_fund_data/?id=${this.idsStr}&fund_data=${fundarchiveStr}&fund_achievement=${fundachievementsStr}`).then(res => {
        this.fundAchievementTable = []
        this.fundArchiveTable = []
        res.data.result.map(data => {
          let tmp = [data.fund_name]
          this.fundAchievementHeader.map(header => {
            if(data.fund_achievement[header])
              tmp.push(data.fund_achievement[header])
          })
          this.fundAchievementTable.push(tmp)
          tmp = [data.fund_name]
          this.fundArchiveHeader.map(header => {
            if(data.fund_data[header])
              tmp.push(data.fund_data[header])
          })
          this.fundArchiveTable.push(tmp)
        })
      })
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
      this.isConfirmedFunds = false
      this.checkedFunds = val ? this.fundList : [];
      console.log(this.checkedFunds)
      this.isIndeterminate = false;
    },
    handleCheckedFundsChange(value) {
      this.isConfirmedFunds = false
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
