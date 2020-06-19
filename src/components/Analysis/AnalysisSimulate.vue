<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-select v-model="selectedFund" value-key="id" class="selecter" placeholder="请选择基金">
        <el-option
          v-for="item in fundList"
          :key="item.id"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-input
        type="number"
        class="search"
        v-model="investment"
        placeholder="投资金额（万元）"
        clearable>
      </el-input>
      <div style="float:left;padding: 10px;">
        <el-button :disabled="!selectedFund.name || investment < 0.000001" type="primary" size="medium" @click="addFund">添加</el-button>
        <el-button :disabled="selectedFundsTable.length < 2" type="primary" size="medium" @click="simulationConfirm">确认组合选择</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="selectedFundsTable">
      <div class="card-container">
        <el-table
          :data="selectedFundsTable"
          border
          stripe
          class="table"
          style="width: 100%"
        >
          <el-table-column
            label="基金名称"
            prop="name"
            align="center">
          </el-table-column>
          <el-table-column
            label="投资金额"
            prop="investment"
            align="center">
          </el-table-column>
          <el-table-column
            label="所占比例"
            prop="propotion"
            align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click.stop="deleteFund(scope.row)" type="primary" size="large">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-show="simulationTable.length > 0" ref="simulationTableChart" class="achievement-chart"></div>
        <el-table v-show="simulationTable.length > 0" ref="simulationTable" :data="simulationTable" height="800" stripe>
          <el-table-column label="月份" width="90">
            <template slot-scope="scope">
              {{formatTimeMonth(scope.row.time)}}
            </template>
          </el-table-column>
          <el-table-column label="净值" prop="net_worth">
          </el-table-column>
          <el-table-column label="月收益率" prop="monthly_yield">
          </el-table-column>
          <el-table-column label="回撤" prop="fallback">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import ECharts from 'echarts'
import 'echarts/lib/chart/line'
import chartOptions from './chartOptions'
import { formatTimeMonth } from '@/assets/util'

export default {
  name: 'AnalysisCreate',
  data () {
    return {
      loading: false,
      investment: 0,
      selectedFund: {},
      fundList: [],
      fundsCombination: [],
      selectedFundsTable: [],
      simulationTableChart: null,
      simulationTable: [],
      edit: true
    }
  },
  watch: {
    selectedFundsTable: {
      handler () {
        let sum = 0
        this.selectedFundsTable.map(row=> {
          sum += row.investment * 1.0
        })
        this.selectedFundsTable.map(row=> {
          row.weight = row.investment / sum
          row.propotion = `${(row.weight * 100).toFixed(2)}%`
        })
      },
      immediate: true
    }
  },
  methods: {
    formatTimeMonth,
    addFund () {
      let flag = false
      this.selectedFundsTable.map((item) => {
        if (item[0] === this.selectedFund.name) {
          this.$message.error('请不要重复添加同一基金！')
          flag = true
        }
      })
      if (flag) return
      this.selectedFund.investment = this.investment
      this.selectedFundsTable.push(this.selectedFund)
    },
    deleteFund(row) {
      this.selectedFundsTable.map((item, index) => {
        if (item.name === row.name)
          this.selectedFundsTable.splice(index, 1)
      })
    },
    simulationConfirm() {
      this.loading = true
      let data = []
      this.selectedFundsTable.map((item) => {
        const tmp = {
          fund_id: item.id,
          weight: item.weight
        }
        data.push(tmp)
      })
      this.$axios.post('/insider/fund_archive/simulation/', {data:data})
        .then(res => {
          this.simulationTable = res.data.results
          this.simulationTableChart.setOption({
            title: {
              text: '净值'
            },
            xAxis: {
              data: this.simulationTable.map((item) => {
                return item.time
              })
            },
            series: {
              data: this.simulationTable.map((item) => {
                return parseFloat(item.net_worth)
              })
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    getData () {
      this.loading = true
      this.$axios.get('/insider/fund_archive/')
        .then(res => {
          this.fundList = res.data.results
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted () {
    this.simulationTableChart = ECharts.init(this.$refs.simulationTableChart)
    this.simulationTableChart.setOption(chartOptions.option)
    this.getData()
  }
}
</script>

<style scoped>
  .search {
    width: 200px;
  }
  .filter-container {
    padding: 12px;
  }
  .card-container {
    position: relative;
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
  .achievement-chart{
    width: 800px;
    height: 400px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
