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
        label="订单类型">
        <template slot-scope="scope">{{ type[scope.row.recommend_type] }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="合伙人收益">
        <template slot-scope="scope">{{ scope.row.online_order_amount | formatPriceFixed }}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="商品金额">
        <template slot-scope="scope">{{ scope.row.online_order_amount | formatPriceFixed }}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="免单金抵扣">
        <template slot-scope="scope">{{ scope.row.online_order_amount | formatPriceFixed }}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="实际支付">
        <template slot-scope="scope">{{ scope.row.online_order_amount | formatPriceFixed }}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户信息">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">{{ status[scope.row.status] }}</template>
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
import constants from '@/assets/constants'

export default {
  name: 'ResellerOnlineOrder',
  data () {
    return {
      loading: false,
      orderList: [],
      orderPageSize: 10,
      orderCurrentPage: 1,
      orderTotalCnt: 0,
      status: constants.ORDER_STATUS,
      type: {
        'bind': '绑定订单',
        'recommend': '推荐订单',
        'bind+recommend': '绑定+推荐订单',
        'normal': '普通订单'
      }
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    getOrders () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/order/?type=ONLINE&from_reseller__uuid=' + this.id +
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
