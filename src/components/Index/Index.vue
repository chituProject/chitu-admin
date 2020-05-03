<template>
  <div class="flex-justify_center index_wrapper">
    <div class="main-col full-screen" v-can:view="'Stats'">
      <div class="card-outer">
        <div class="message-container">
          <data-card
            v-for="(value, key, index) in dataCardFuncs"
            :key="index"
            :label="key"
            :statistics="value"
            class="card-container left"></data-card>
        </div>
        <div class="message-container">
          <div class="info-container left">
            <i class="iconfont">&#xe614;</i>
            <div @click="goToPage('/orders')">
              <p>待发货</p>
              <h4>{{unshippedCount}}</h4>
            </div>
          </div>
          <div class="info-container left">
            <i class="iconfont">&#xe607;</i>
            <div @click="goToPage('/customers/aftersale')">
              <p>待处理售后</p>
              <h4>{{aftersaleCount}}</h4>
            </div>
          </div>
          <div class="info-container left">
            <i class="iconfont">&#xe65e;</i>
            <div @click="openUrl('https://mpkf.weixin.qq.com/')">
              <p>待回复客服消息</p>
              <h4>{{serviceCount}}</h4>
            </div>
          </div>
        </div>
        <div class="message-container">
          <h4>订单数
            <el-date-picker
              v-model="order_count_date"
              type="month"
              :editable="false"
              :clearable="false"
              @change="OrderCntChange"
              class="date-picker"
              placeholder="选择月份">
            </el-date-picker>
            <div class="order-show-type">
              <el-radio v-model="order_show_type" label="order_count_per_day" value="order_count_per_day">订单数</el-radio>
              <el-radio v-model="order_show_type" label="paid_amount_per_day" value="paid_amount_per_day">销售额</el-radio>
            </div>
          </h4>
          <div ref="orderCountChart" class="order-count"></div>
        </div>
        <div class="message-container">
          <h4>销售商品 TOP30
            <el-date-picker
              v-model="top_goods_date"
              type="month"
              :editable="false"
              :clearable="false"
              @change="topGoodsChange"
              class="date-picker"
              placeholder="选择月份">
            </el-date-picker>
          </h4>
          <div ref="goodsTopChart" class="top-goods"></div>
        </div>
        <!-- <div class="message-container">
          <h4>用户转化漏斗图
            <el-date-picker
              v-model="transform_date"
              type="month"
              :editable="false"
              :clearable="false"
              @change="transformChange"
              class="date-picker"
              placeholder="选择月份">
            </el-date-picker>
          </h4>
          <div ref="transformChart" class="user-source"></div>
        </div> -->
        <div class="message-container">
          <h4>用户留存漏斗图
            <el-date-picker
              v-model="retention_date"
              type="month"
              :editable="false"
              :clearable="false"
              @change="retentionChange"
              class="date-picker"
              placeholder="选择月份">
            </el-date-picker>
          </h4>
          <div ref="retentionChart" class="user-source"></div>
        </div>
        <div class="message-container">
          <h4>用户来源分析</h4>
          <div ref="userSourceChart" class="user-source"></div>
        </div>
      </div>
    </div>
    <empty-page v-can:view.not="'Stats'"></empty-page>
  </div>
</template>

<script>
import ECharts from 'echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/map'
import chinaJson from '@/assets/china.json'
import dataCard from '@/components/Index/DataCard'
import { getChina } from '@/assets/util'
import mapOption from '@/assets/echarts/map_options'
import topGoodsOption from '@/assets/echarts/top_goods'
import orderCountOption from '@/assets/echarts/order_cnt'
import funnelOption from '@/assets/echarts/funnel'
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'index',
  components: {
    'chart': ECharts,
    dataCard,
    EmptyPage
  },
  data () {
    return {
      statisticsQuery: [],
      myDate: new Date(),
      myYesterday: null,
      dataCardFuncs: {
        paid_amount: {},
        order_count: {},
        scan_count: {},
        reseller_count: {},
        active_reseller_count: {},
        avg_transform_rate: {}
      },
      orderCountChart: null,
      goodsTopChart: null,
      userSourceChart: null,
      retentionChart: null,
      transformChart: null,
      unshippedCount: 0,
      aftersaleCount: 0,
      serviceCount: '登录查看',
      top_goods_date: new Date(),
      order_count_date: new Date(),
      retention_date: new Date(),
      transform_date: new Date(),
      order_show_type: 'order_count_per_day',
      transformData: {}
    }
  },
  watch: {
    order_show_type () {
      this.OrderCntChange(this.order_count_date)
    }
  },
  computed: {
  },
  methods: {
    openUrl (url) {
      window.open(url, '_blank')
    },
    goToPage (url) {
      this.$router.push(url)
    },
    buildTimeQuery (func) {
      this.statisticsQuery.push({
        func: func,
        params: this.buildParams(this.myDate, true)
      })
      this.statisticsQuery.push({
        func: func,
        params: this.buildParams(this.myYesterday, true)
      })
    },
    buildParams (date, oneday) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: oneday ? date.getDate() : null
      }
    },
    buildQueries () {
      for (let item in this.dataCardFuncs) {
        this.buildTimeQuery(item)
      }
      this.statisticsQuery.push({
        func: 'unshipped_suborder_count',
        params: {}
      })
      this.statisticsQuery.push({
        func: 'dealing_aftersale_count',
        params: {}
      })
      this.statisticsQuery.push({
        func: 'order_count_per_day',
        params: this.buildParams(this.myDate, false)
      })
      this.statisticsQuery.push({
        func: 'goods_top30',
        params: this.buildParams(this.myDate, false)
      })
      this.statisticsQuery.push({
        func: 'user_source',
        params: {}
      })
      this.statisticsQuery.push({
        func: 'retention_data',
        params: this.buildParams(this.myDate, false)
      })
      this.statisticsQuery.push({
        func: 'transform_exposure',
        params: this.buildParams(this.myDate, false)
      })
      this.statisticsQuery.push({
        func: 'transform_click',
        params: this.buildParams(this.myDate, false)
      })
      this.statisticsQuery.push({
        func: 'transform_5secs',
        params: this.buildParams(this.myDate, false)
      })
      this.statisticsQuery.push({
        func: 'transform_order',
        params: this.buildParams(this.myDate, false)
      })
    },
    OrderCntChange (date) {
      this.statisticsQuery = []
      this.statisticsQuery.push({
        func: this.order_show_type,
        params: this.buildParams(date, false)
      })
      this.getStatistics()
    },
    topGoodsChange (date) {
      this.statisticsQuery = []
      this.statisticsQuery.push({
        func: 'goods_top30',
        params: this.buildParams(date, false)
      })
      this.getStatistics()
    },
    retentionChange (date) {
      this.statisticsQuery = []
      this.statisticsQuery.push({
        func: 'retention_data',
        params: this.buildParams(date, false)
      })
      this.getStatistics()
    },
    transformChange (date) {
      this.statisticsQuery = []
      this.statisticsQuery.push({
        func: 'transform_exposure',
        params: this.buildParams(date, false)
      })
      this.statisticsQuery.push({
        func: 'transform_click',
        params: this.buildParams(date, false)
      })
      this.statisticsQuery.push({
        func: 'transform_5secs',
        params: this.buildParams(date, false)
      })
      this.statisticsQuery.push({
        func: 'transform_order',
        params: this.buildParams(date, false)
      })
      this.getStatistics()
    },
    getStatistics () {
      let that = this
      this.$axios.post('/insider/statistics/', {
        instances: this.statisticsQuery
      })
        .then(res => {
          console.log(res.data)
          that.decodeQueries(res.data)
        })
    },
    decodeQueries (data) {
      let that = this
      data.forEach(item => {
        if (item.code === 200) {
          if (that.dataCardFuncs.hasOwnProperty(item.instance.func)) {
            let ins = that.dataCardFuncs[item.instance.func]
            if (item.instance.params.day === that.myDate.getDate()) {
              that.$set(ins, 'today', item.value)
            } else {
              that.$set(ins, 'yesterday', item.value)
            }
          } else if (item.instance.func === 'user_source') {
            that.setUserSource(item.value)
          } else if (item.instance.func === 'unshipped_suborder_count') {
            that.unshippedCount = item.value
          } else if (item.instance.func === 'dealing_aftersale_count') {
            that.aftersaleCount = item.value
          } else if (item.instance.func === 'goods_top30') {
            that.setTopGoods(item.value)
          } else if (item.instance.func === 'order_count_per_day') {
            that.setOrderCount(item.value)
          } else if (item.instance.func === 'paid_amount_per_day') {
            that.setOrderCount(item.value)
          } else if (item.instance.func === 'retention_data') {
            that.setRetention(item.value)
          } else if (item.instance.func === 'transform_exposure') {
            that.transformData.transform_exposure = item.value
          } else if (item.instance.func === 'transform_click') {
            that.transformData.transform_click = item.value
          } else if (item.instance.func === 'transform_5secs') {
            that.transformData.transform_5secs = item.value
          } else if (item.instance.func === 'transform_order') {
            that.transformData.transform_order = item.value
          }
        }
      })
      // this.setTransform(this.transformData)
    },
    setOrderCount (sourceData) {
      orderCountOption.seriesOption.name = this.order_show_type === 'order_count_per_day' ? '订单数' : '￥'
      orderCountOption.seriesOption.data = sourceData.map(item => {
        return this.order_show_type === 'order_count_per_day' ? item.count : item.count / 100
      })
      this.orderCountChart.setOption({
        xAxis: {
          data: sourceData.map(item => {
            let result = item.date.split('-')
            result.splice(0, 1)
            return result.join('-')
          })
        },
        series: [orderCountOption.seriesOption]
      })
    },
    setTopGoods (sourceData) {
      let flag = 'axis'
      if (sourceData.length === 0) {
        sourceData = [{sku__goods__title: '今日暂无商品售出'}]
        flag = 'none'
      }
      while (sourceData.length < 5) {
        sourceData.push({sku__goods__title: ''})
      }
      topGoodsOption.seriesOption.data = sourceData.map(item => {
        return item.goods_sum
      })
      this.goodsTopChart.setOption({
        tooltip: {
          trigger: flag
        },
        yAxis: {
          data: sourceData.map(item => {
            return item.sku__goods__title
          })
        },
        series: [topGoodsOption.seriesOption]
      })
    },
    setTransform (sourceData) {
      let showData = []
      let maxValue = 0
      for (let parm in sourceData) {
        if (parm === 'transform_exposure') {
          showData.push({name: '曝光', value: sourceData[parm]})
          maxValue = maxValue > sourceData[parm] ? maxValue : sourceData[parm]
        } else if (parm === 'transform_click') {
          showData.push({name: '点击', value: sourceData[parm]})
          maxValue = maxValue > sourceData[parm] ? maxValue : sourceData[parm]
        } else if (parm === 'transform_5secs') {
          showData.push({name: '5秒存活', value: sourceData[parm]})
          maxValue = maxValue > sourceData[parm] ? maxValue : sourceData[parm]
        } else if (parm === 'transform_order') {
          showData.push({name: '购买', value: sourceData[parm]})
          maxValue = maxValue > sourceData[parm] ? maxValue : sourceData[parm]
        }
      }
      funnelOption.retentionOption.max = maxValue
      funnelOption.retentionOption.data = showData
      this.transformChart.setOption({
        legend: {
          data: showData.map(item => {
            return item.name
          })
        },
        series: [funnelOption.retentionOption]
      })
    },
    setRetention (sourceData) {
      let showData = []
      let maxValue = 0
      for (let parm in sourceData) {
        if (parm === '1') {
          showData.push({name: '一次购买', value: sourceData[parm]})
          maxValue = maxValue > sourceData[parm] ? maxValue : sourceData[parm]
        } else if (parm === '2') {
          showData.push({name: '二次购买', value: sourceData[parm]})
          maxValue = maxValue > sourceData[parm] ? maxValue : sourceData[parm]
        } else if (parm === '3') {
          showData.push({name: '三次购买', value: sourceData[parm]})
          maxValue = maxValue > sourceData[parm] ? maxValue : sourceData[parm]
        } else if (parm === '4') {
          showData.push({name: '多次购买', value: sourceData[parm]})
          maxValue = maxValue > sourceData[parm] ? maxValue : sourceData[parm]
        }
      }
      funnelOption.retentionOption.max = maxValue
      funnelOption.retentionOption.data = showData
      this.retentionChart.setOption({
        legend: {
          data: showData.map(item => {
            return item.name
          })
        },
        series: [funnelOption.retentionOption]
      })
    },
    setUserSource (sourceData) {
      mapOption.seriesOption.data = sourceData.map(item => {
        let result = {}
        result.name = getChina(item.wechat_province)
        result.value = item.id__count
        return result
      })
      this.userSourceChart.setOption({
        series: [mapOption.seriesOption]
      })
    },
    initCharts () {
      ECharts.registerMap('china', chinaJson)
      this.userSourceChart = ECharts.init(this.$refs.userSourceChart)
      this.userSourceChart.setOption(mapOption.option)
      this.goodsTopChart = ECharts.init(this.$refs.goodsTopChart)
      this.goodsTopChart.setOption(topGoodsOption.option)
      this.orderCountChart = ECharts.init(this.$refs.orderCountChart)
      this.orderCountChart.setOption(orderCountOption.option)
      this.retentionChart = ECharts.init(this.$refs.retentionChart)
      this.retentionChart.setOption(funnelOption.option)
      // this.transformChart = ECharts.init(this.$refs.transformChart)
      // this.transformChart.setOption(funnelOption.option)
    }
  },
  mounted () {
    // this.myDate = new Date()
    this.myYesterday = new Date(this.myDate.getTime() - 1000 * 60 * 60 * 24)
    if (!this.$store.state.username) {
      this.$message.error('您尚未登录或登录状态已过期，请重新登录')
      this.$router.replace('/')
    }
    if (this.$can('view', 'Stats')) {
      this.buildQueries()
      this.initCharts()
      this.getStatistics()
    }
  }
}
</script>

<style scoped>
.full-screen {
  height: calc(100vh - 60px);
}
.card-outer {
  top: 0;
}
.message-container {
  margin: 10px 10px 10px 10px;
  background-color: #ffffff;
  padding: 25px 10% 25px 10%;
  font-size: 24px;
  width: calc(100% - 20px);
  overflow: hidden;
  text-align: left;
}
.card-container {
  margin: 15px 10px 15px 10px;
  background-color: #ffffff;
  padding: 15px 30px 5px 30px;
  border-radius: 5px;
  box-shadow: 1px 1px 6px #cccccc;
  width: calc(100% / 3 - 20px);
}
.left {
  float: left;
}
.user-source {
  width: 800px;
  height: 500px;
  margin-left: auto;
  margin-right: auto;
}
.top-goods {
  width: 800px;
  height: 400px;
  margin-left: auto;
  margin-right: auto;
}
.order-count {
  width: 1000px;
  height: 400px;
  margin-left: auto;
  margin-right: auto;
}
.date-picker {
  margin-left: 30px;
}
.order-show-type {
  display: inline-block;
  margin-left: 30px;
}
.info-container {
  margin: 15px 10px 15px 10px;
  background-color: #ffffff;
  padding: 15px 30px 5px 30px;
  width: calc(100% / 3 - 20px);
}
.info-container i {
  margin-top: 10px;
  float: left;
  display: block;
  font-size: 40px;
  line-height: 40px;
  color: #71aae8;
}
.info-container img {
  margin-top: 10px;
  float: left;
}
.info-container div {
  float: left;
  margin-left: 25%;
  display: inline-block;
  text-align: center;
}
.info-container div:hover {
  cursor: pointer;
}
.info-container p {
  color: #666666;
  font-size: 16px;
  line-height: 24px;
}
.info-container h4 {
  color: #333333;
  font-size: 30px;
  font-weight: normal;
}
</style>
