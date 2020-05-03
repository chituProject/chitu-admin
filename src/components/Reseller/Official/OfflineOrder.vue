<template>
  <div v-loading="loading">
    <el-table
      stripe
      :data="orderList"
      tooltip-effect="dark"
      @row-click="onRowClick"
      :row-style="{ cursor: 'pointer' }"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="id"
        label="订单号"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        label="线下订单应付总额">
        <template slot-scope="scope">{{ scope.row.offline_order_amount | formatPriceFixed }}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="免单金抵扣金额">
        <template slot-scope="scope">{{ scope.row.real_offpay_amount | formatPriceFixed }}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="实际支付金额">
        <template slot-scope="scope">{{ scope.row.order_amount | formatPriceFixed }}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="支付时间">
        <template slot-scope="scope">
          {{formatTime(scope.row.paid_at)}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="orderPageSize < orderTotalCnt"
      class="pagination"
      @current-change="handleOrderCurrentChange"
      :current-page="orderCurrentPage"
      :page-size="orderPageSize"
      :total="orderTotalCnt"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import { formatTime } from '@/assets/util'
import constants from '@/assets/constants'

export default {
  name: 'ResellerOfflineOrder',
  data () {
    return {
      loading: false,
      orderList: [],
      orderPageSize: 10,
      orderCurrentPage: 1,
      orderTotalCnt: 0,
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
    getOrders () {
      let that = this
      that.loading = true
      // 正则清除uuid的间隔符，线下订单的type是OFFPAY_OFFLINE
      this.$axios.get('/insider/order/?type=OFFPAY_OFFLINE&from_reseller__uuid=' + this.id.replace(/-/g, '') +
        '&page_num=' + this.orderCurrentPage +
        '&page_size=' + this.orderPageSize +
        '&status!=CANCELED'
      )
        .then(res => {
          that.orderTotalCnt = res.data.count
          that.orderList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleOrderCurrentChange (currentPage) {
      this.orderCurrentPage = currentPage
      this.getOrders()
    },
    onRowClick (row, event, column) {
      this.$router.push('/orders/' + row.id)
    }
  },
  created () {
    this.getOrders()
  }
}
</script>

<style scoped>

</style>
