<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <div style="float:left;">
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
        <el-button :disabled="!selectedFund.name || investment < 0.000001" type="primary" size="medium" @click="addFund">添加</el-button>
        <el-button :disabled="selectedFundsTable.length < 2" type="primary" size="medium" @click="simulationConfirm">确认组合选择</el-button>
      </div>
      <div style="float: right;">
        <el-button :disabled="confirmStage < 1" type="primary" size="medium" @click="exportData">导出为excel</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="selectedFundsTable">
      <div class="card-container">
        <el-table
          id="selectedFundsTable"
          :data="selectedFundsTable"
          border
          stripe
          class="table"
          style="width: 100%"
        >
          <el-table-column
            label="基金经理"
            prop="manager"
            align="center">
          </el-table-column>
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
        <el-table
          v-show="simulationTable.length > 0"
          id="simulationTable"
          :data="simulationTable"
          height="800"
          stripe
        >
          <el-table-column label="月份">
            <template slot-scope="scope">
              {{formatTimeMonth(scope.row.time)}}
            </template>
          </el-table-column>
          <el-table-column label="净值" prop="net_worth">
          </el-table-column>
          <el-table-column label="月收益率" prop="monthly_yield">
            <template slot-scope="scope">
            {{ `${(scope.row.monthly_yield * 100 ).toFixed(2)}%` }}
            </template>
          </el-table-column>
          <el-table-column label="回撤" prop="fallback">
            <template slot-scope="scope">
            {{ `${(scope.row.fallback * 100 ).toFixed(2)}%` }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import * as XLSX from 'xlsx'
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
      confirmStage: 0,
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
      this.confirmStage = 0
      let flag = false
      this.selectedFundsTable.map((item) => {
        if (item.name === this.selectedFund.name) {
          this.$message.error('请不要重复添加同一基金！')
          flag = true
        }
      })
      if (flag) return
      this.selectedFund.investment = this.investment
      this.selectedFundsTable.push(this.selectedFund)
    },
    deleteFund(row) {
      this.confirmStage = 0
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
          this.confirmStage += 1
          this.loading = false
        })
    },
    exportData () {
      var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换(添加此行代码表格中的百分比就不会再导出的时候被转换成小数点)
      const wb = XLSX.utils.book_new();

      if (this.selectedFundsTable.length > 0) {
        const sheet1 = XLSX.utils.table_to_sheet(
          document.querySelector("#selectedFundsTable"),
          xlsxParam
        );
        XLSX.utils.book_append_sheet(wb, sheet1, '基金组合');
      }
      if (this.simulationTable.length > 0) {
        const sheet2 = XLSX.utils.table_to_sheet(
          document.querySelector("#simulationTable"),
          xlsxParam
        );
        XLSX.utils.book_append_sheet(wb, sheet2, '组合净值');
      }

      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      // 获取当前的时间戳，用来当文件名
      try {
        let str=''
        this.selectedFundsTable.map( data => {
          str += `-${data.name}`
        })
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          `赤兔基金-模拟组合${str}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
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
    margin: 0 12px;
    width: 200px;
  }
  .selecter {
    margin: 0;
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
