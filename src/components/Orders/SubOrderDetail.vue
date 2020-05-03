<template>
  <div v-loading="loading" class="main-col">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="子订单号">
            <span>{{ model.id }}</span>
          </el-form-item>
          <el-form-item label="订单状态">
            <span>{{ status[model.status] }}</span>
          </el-form-item>
          <el-form-item label="供应商名称">
            <span>{{ model.merchant_name }}</span>
          </el-form-item>
          <el-form-item label="商品总额">
            <span>{{ totalPrice | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="场景返利">
            <span>{{ model.rebate_amount | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="产生免单金">
            <span>{{ totalOffpay | formatPriceFixed }}元</span>
          </el-form-item>
          <el-form-item label="运费">
            <span>{{ model.shipment_fee | formatPriceFixed }}元</span>
          </el-form-item>
        </el-form>
        <hr />
        <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="收货人">
            <span>{{ model.receiver_name }}</span>
          </el-form-item>
          <el-form-item label="收货人电话">
            <span>{{ model.receiver_tel }}</span>
          </el-form-item>
          <el-form-item label="收货人地址">
            <span>{{ model.receiver_full_address }}</span>
          </el-form-item>
          <el-form-item label="发货快递">
            <span>{{ model.express_name }}</span>
          </el-form-item>
          <el-form-item label="发货时间">
            <span>{{ formatTime(model.delivery_at) }}</span>
          </el-form-item>
          <el-form-item label="快递单号">
            <span @click="showDelivery(model)" style="color: #f26250; cursor:pointer;">{{ model.logistic_code }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-container">
        <el-table
          :data="model.items"
          tooltip-effect="dark"
          stripe
          style="width: 100%">
          <el-table-column
            align="center"
            label="sku图"
            width="60">
            <template slot-scope="scope"><img v-bind:src="scope.row.sku_pic" class="info-img"/></template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="goods_full_title"
            label="商品标题">
          </el-table-column>
          <el-table-column
            align="center"
            prop="sku_id"
            label="sku编号">
          </el-table-column>
          <el-table-column
            align="center"
            label="sku型号">
            <template slot-scope="scope">{{ JSON.parse(scope.row.sku_name).join(' ') }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商品售价">
            <template slot-scope="scope">{{ scope.row.price | formatPriceFixed }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="count"
            label="数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="产生免单金">
            <template slot-scope="scope">{{ (scope.row.total_offpay_limit * model.customer_profit / 100) | formatPriceFixed }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="场景返利">
            <template slot-scope="scope">{{ scope.row.total_rebate | formatPriceFixed }}</template>
          </el-table-column>
        </el-table>
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
    totalPrice () {
      let sum = 0
      if (this.model.items) {
        this.model.items.forEach(item => {
          sum += item.total
        })
      }
      return sum
    },
    totalOffpay () {
      let sum = 0
      if (this.model.items) {
        this.model.items.forEach(item => {
          sum += item.total_offpay_limit * this.model.customer_profit / 100
        })
      }
      return sum
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
      this.$axios.get('/insider/suborder/' + this.id + '/')
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
    width: 50px;
    height: 50px;
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
