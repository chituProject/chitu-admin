<template>
  <div v-loading="loading">
    <el-table
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
        prop="reseller_name"
        label="来源场景">
      </el-table-column>
      <el-table-column
        align="center"
        label="收货信息">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.receiver_name">
            <p>电话: {{ scope.row.receiver_tel }}</p>
            <p>住址: {{ scope.row.receiver_area }} {{ scope.row.receiver_address }}</p>
            <div slot="reference">
              {{ scope.row.receiver_name }}
            </div>
          </el-popover>
          <template v-else>未填写</template>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="商品总金额">
        <template slot-scope="scope">{{formatPrice(scope.row.online_order_amount)}}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="线下消费金额">
        <template slot-scope="scope">{{formatPrice(scope.row.offline_order_amount)}}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="免单金">
        <template slot-scope="scope">{{formatPrice(scope.row.max_offpay_amount)}}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="实际支付金额">
        <template slot-scope="scope">{{formatPrice(scope.row.order_amount)}}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="id"
        label="支付时间"
        width="135">
        <template slot-scope="scope">{{ formatTime(scope.row.paid_at) }}</template>
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
import { formatTime, formatPrice } from '@/assets/util'

export default {
  name: 'UserDetailOrder',
  data () {
    return {
      loading: false,
      orderList: [],
      orderPageSize: 10,
      orderCurrentPage: 1,
      orderTotalCnt: 0
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
    getOrders () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/order/?user__id=' + this.id +
        '&page_num=' + this.orderCurrentPage +
        '&page_size=' + this.orderPageSize)
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
