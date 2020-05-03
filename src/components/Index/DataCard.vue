<template>
  <div>
    <div class="left-column">
      <p>{{labels[label]}}</p>
      <span class="main-label">{{getStatistics(statistics.today)}}<span class="main-unit">{{unit[label]}}</span></span>
      <p>昨日</p>
      <p>{{getStatistics(statistics.yesterday) + unit[label]}}</p>
    </div>
    <div class="right-column" :class="{'color-main': ratio > 0, 'color-second': ratio < 0, 'color-third': ratio === 0}">
      <template v-if="ratio > 0">
        <i class="iconfont">&#xe611;</i>
        <span>{{ratio}}%</span>
      </template>
      <template v-else-if="ratio < 0">
        <i class="iconfont">&#xe610;</i>
        <span>{{-ratio}}%</span>
      </template>
      <template v-else>
        <img src="../../../static/img/chiping.png" width="21px" height="21px"/>
        <!--<i class="iconfont">&#xe67b;</i>-->
        <span>0%</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCard',
  props: {
    label: {
      type: String
    },
    statistics: {
      type: Object
    }
  },
  data () {
    return {
      labels: {
        paid_amount: '付款金额',
        order_count: '订单数量',
        scan_count: '扫码次数',
        reseller_count: '线下场景数量',
        active_reseller_count: '活跃场景数量',
        avg_transform_rate: '平均转化率'
      },
      unit: {
        paid_amount: '元',
        order_count: '笔',
        scan_count: '次',
        reseller_count: '个',
        active_reseller_count: '个',
        avg_transform_rate: '%'
      }
    }
  },
  computed: {
    ratio () {
      if ((this.statistics.today || this.statistics.today === 0) && this.statistics.yesterday && this.statistics.yesterday > 0) {
        return ((this.statistics.today / this.statistics.yesterday - 1.0) * 100).toFixed(0)
      } else if (this.statistics.today > 0 && this.statistics.yesterday === 0) {
        return 100
      } else {
        return 0
      }
    }
  },
  methods: {
    getStatistics (data) {
      if (data || data === 0) {
        if (this.label === 'paid_amount') {
          return (data / 100).toLocaleString()
        } else {
          return data.toLocaleString()
        }
      } else {
        return '-'
      }
    }
  }
}
</script>

<style scoped>
  .color-second {
    /*background-color: #71aae8;*/
    /*color: #FFFFFF;*/
    color: #71aae8;
  }
  .color-main {
    /*background-color: #f56554;*/
    /*color: #FFFFFF;*/
    color: #f56554;
  }
  .color-third {
    color: #333333;
  }
  .left-column {
    float: left;
    text-align: left;
    /*font-family: STHeitiSC-Medium, serif;*/
    color: #666666;
  }
  .left-column p {
    font-size: 14px;
    line-height: 1.2;
  }
  .main-label {
    display: block;
    font-family: STHeitiSC-Medium, serif;
    font-size: 28px;
    font-weight: bold;
    margin: 10px 0 20px 0;
    color: #333333;
  }
  .main-unit {
    margin-left: 10px;
    font-size: 14px;
  }
  .right-column {
    width: 80px;
    float: right;
    vertical-align: baseline;
    text-align: left;
  }
  .right-column img {
    display: inline-block;
  }
  .right-column span {
    display: inline-block;
    font-size: 16px;
    line-height: 16px;
  }
  .right-column i {
    font-size: 23px;
  }
</style>
