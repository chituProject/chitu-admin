<template>
  <div v-loading="loading" class="main-col">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form inline class="demo-table-expand" label-width="80px" label-position="left">
          <el-form-item label="订单号" label-width="120px">
            <span>{{model.id}}</span>
          </el-form-item>
          <el-form-item label="支付时间" label-width="120px">
            <span>{{formatTime(model.paid_at)}}</span>
          </el-form-item>
          <el-form-item label="来源店铺" label-width="120px" v-if="model.reseller_name !== '无'">
            <span>{{model.reseller_name}}</span>
          </el-form-item>
          <el-form-item label="商品总金额" label-width="120px" v-if="model.online_order_amount > 0">
            <span>{{model.online_order_amount | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="场景返利总额" label-width="120px">
            <span>{{model.rebate_amount | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="产生免单金" label-width="120px">
            <span>{{ totalOffpayAmount | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="线下商品金额" label-width="120px" v-if="model.offline_order_amount > 0">
            <span>{{model.offline_order_amount | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="额外支付金额" label-width="120px" v-if="model.extra_extra_payment_amount > 0">
            <span>{{model.extra_payment_amount | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="抵扣免单金" label-width="120px" v-else>
            <span>{{(- model.extra_payment_amount)| formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="运费" label-width="120px">
            <span>{{model.shipment_fee | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="实际支付金额" label-width="120px">
            <span>{{model.order_amount | formatPriceFixed }}元</span>
          </el-form-item>
        </el-form>
        <hr />
        <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="收货人" style="width: 30%;">
            <span>{{model.receiver_name}}</span>
          </el-form-item>
          <el-form-item label="收货人电话" style="width: 30%;">
            <span>{{model.receiver_tel}}</span>
          </el-form-item>
          <el-form-item label="收货人地址" style="width: 40%;">
            <span>{{model.receiver_full_address}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div
        v-for="(item, index) in model.suborders"
        :key="index"
        class="card-container">
        <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="子订单号">
            <span>{{item.id}}</span>
          </el-form-item>
          <el-form-item label="订单状态">
            <span>{{status[item.status]}}</span>
          </el-form-item>
          <el-form-item label="供应商名称">
            <span>{{item.merchant_name}}</span>
          </el-form-item>
          <el-form-item label="发货地点">
            <span>{{item.delivery_place}}</span>
          </el-form-item>
          <el-form-item label="商品总额">
            <span>{{ item.suborder_amount | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="场景返利">
            <span>{{ item.rebate_amount | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="产生免单金">
            <span>{{(item.total_offpay_limit * item.customer_profit / 100) | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="运费">
            <span>{{ item.shipment_fee | formatPriceFixed }}元</span>
          </el-form-item>
        </el-form>
        <hr />
        <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="发货快递">
            <span>{{item.express_name}}</span>
          </el-form-item>
          <el-form-item label="发货时间">
            <span>{{formatTime(item.delivery_at)}}</span>
          </el-form-item>
          <el-form-item label="快递单号">
            <span @click="showDelivery(item)">{{item.logistic_code}}</span>
          </el-form-item>
        </el-form>
        <div
          v-for="(goods, index) in item.items"
          :key="index">
          <hr />
          <div style="display: flex; flex-direction: row;align-items: center">
            <img v-bind:src="goods.sku_pic" class="info-img"/>
            <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
              <el-form-item label="SKU">
                <span>{{goods.sku_id}}</span>
              </el-form-item>
              <el-form-item label="数量">
                <span>{{goods.count}}</span>
              </el-form-item>
              <el-form-item label="商品金额">
                <span>{{(goods.total / 100).toFixed(2)}}元</span>
              </el-form-item>
              <el-form-item label="产生免单金">
                <span>{{(goods.total_offpay_limit * item.customer_profit / 100) | formatPriceFixed }}元</span>
              </el-form-item>
              <el-form-item label="商品标题">
                <span>{{goods.goods_full_title}}</span>
              </el-form-item>
              <el-form-item label="型号">
                <span>{{ goods.sku_name && goods.sku_name.startsWith('[') ? JSON.parse(goods.sku_name).join(' ') : goods.sku_name }}</span>
              </el-form-item>
              <el-form-item label="场景返利">
                <span>{{ goods.total_rebate | formatPriceFixed }}元</span>
              </el-form-item>
              <el-form-item label="运费">
                <span>{{ goods.shipment_fee | formatPriceFixed }}元</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/assets/util'
export default {
  name: 'OrderDetail',
  data () {
    return {
      loading: false,
      model: {},
      status: {
        UNSHIPPED: '待发货',
        SHIPPING: '已发货',
        FINISHED: '已完成',
        CLOSED: '已关闭'
      }
    }
  },
  props: {
    id: {
      type: String
    }
  },
  computed: {
    /**
     * 订单产生的总免单金 = sum(子订单免单金 * rebate)
     */
    totalOffpayAmount () {
      if (!this.model || !this.model.suborders) return 0
      return this.model.suborders.reduce((sum, item) => sum + item.total_offpay_limit * item.customer_profit, 0) / 100
    }
  },
  methods: {
    formatTime,
    goBack () {
      window.open('javascript:window.open("", "_self", "");window.close();', '_self')
    },
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/order/' + this.id + '/')
        .then(res => {
          that.model = res.data
        })
        .finally(() => {
          that.loading = false
        })
    },
    showDelivery (suborder) {
      this.$axios.get('/insider/suborder/' + suborder.id + '/delivery/')
        .then(res => {
          console.log(res.data)
          let msg = '物流公司：' + res.data.express + '<br />'
          msg += '快递单号：' + res.data.nu + '<br />'
          for (let i = 0; i < res.data.data.length; i++) {
            msg += res.data.data[i].ftime + ' ' + res.data.data[i].context + '<br />'
          }
          this.$alert(msg, '物流', {
            confirmButtonText: '关闭',
            dangerouslyUseHTMLString: true
          })
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
    width: 100%;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    margin-top: 5px;
    width: 33%;
    min-width: 200px;
  }
  .info-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 20px;
  }
  .demo-table-expand-2 {
    flex: 1;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand-2 .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    margin-top: 5px;
    width: 20%;
    min-width: 200px;
  }
</style>
