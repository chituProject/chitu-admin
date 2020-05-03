<template>
  <div v-loading="loading" class="main-col">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="订单号">
            <span>{{model.id}}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{status[model.status]}}</span>
          </el-form-item>
          <el-form-item label="支付时间">
            <span>{{formatTime(model.paid_at)}}</span>
          </el-form-item>
          <el-form-item label="来源用户">
            <span>{{model.user_name}}</span>
          </el-form-item>
          <el-form-item label="订单金额">
            <span>{{formatPrice(model.order_amount)}}元</span>
          </el-form-item>
          <el-form-item label="商家收入">
            <span>{{formatPrice(model.supplier_incoming_amount)}}元</span>
          </el-form-item>
          <el-form-item label="免单君分成">
            <span>{{formatPrice(model.offpay_profit_amount)}}元</span>
          </el-form-item>
          <el-form-item label="发起分成">
            <span>{{formatPrice(model.sponsor_profit_amount)}}元</span>
          </el-form-item>
          <el-form-item label="转发分成">
            <span>{{formatPrice(model.forwarder_profit_amount)}}元</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-container">
        <el-form class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="收货人姓名">
            <span>{{model.receiver_name}}</span>
          </el-form-item>
          <el-form-item label="收货人手机">
            <span>{{model.receiver_tel}}</span>
          </el-form-item>
          <el-form-item label="收货人地址">
            <span>{{model.receiver_area}} {{model.receiver_address}}</span>
          </el-form-item>
          <el-form-item label="发货时间">
            <span>{{formatTime(model.paid_at)}}</span>
          </el-form-item>
          <el-form-item label="发货快递">
            <span>{{model.express}}</span>
          </el-form-item>
          <el-form-item label="快递单号">
            <span>{{model.logistic_code}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-container">
        <el-form class="demo-table-expand-2" label-width="80px" label-position="left">
          <el-form-item label="品牌">
            <span>{{model.brand_name}}</span>
          </el-form-item>
          <el-form-item label="SKU型号">
            <span>{{model.specification}}</span>
          </el-form-item>
          <el-form-item label="售价">
            <span>{{formatPrice(model.price)}}元</span>
          </el-form-item>
          <el-form-item label="数量">
            <span>{{model.count}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime, formatPrice } from '@/assets/util'
import constants from '@/assets/constants'
export default {
  name: 'OrderDetail',
  data () {
    return {
      loading: false,
      model: {},
      status: constants.ORDER_STATUS
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    formatTime,
    formatPrice,
    goBack () {
      window.open('javascript:window.open("", "_self", "");window.close();', '_self')
    },
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/gift_insider/gift_order/' + this.id + '/')
        .then(res => {
          that.model = res.data
        })
        .finally(() => {
          that.loading = false
        })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>

  .filter-container {
    padding: 12px;
  }
  .card-container {
    padding: 20px;
  }
  .demo-table-expand {
    text-align: left;
    display: grid;
    grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
    grid-column-gap: 10px;
  }
  .demo-table-expand-2 {
    text-align: left;
    display: grid;
    grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
    grid-column-gap: 10px;
  }
  @media (min-width: 1200px) {
    .demo-table-expand {
      grid-template-columns: repeat( 3, 1fr );
    }
    .demo-table-expand-2 {
      grid-template-columns: repeat( 4, 1fr );
    }
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .demo-table-expand-2 .el-form-item {
    margin-bottom: 0;
  }
</style>
