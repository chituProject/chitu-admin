<template>
  <div v-loading="loading">
    <el-table
      stripe
      :data="offpayList"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="id"
        label="流水单号"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="reseller_name"
        label="来源场景">
      </el-table-column>
      <el-table-column
        align="center"
        label="线下商品金额">
        <template slot-scope="scope">{{formatPrice(scope.row.offline_order_amount)}}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="消耗账户免单金">
        <template slot-scope="scope">{{formatPrice(scope.row.real_offpay_amount)}}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="实际支付金额">
        <template slot-scope="scope">{{formatPrice(scope.row.order_amount)}}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="支付时间"
        width="135">
        <template slot-scope="scope">{{ formatTime(scope.row.paid_at) }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="offpayPageSize < offpayTotalCnt"
      class="pagination"
      @current-change="handleOffpayCurrentChange"
      :current-page="offpayCurrentPage"
      :page-size="offpayPageSize"
      :total="offpayTotalCnt"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import { formatTime, formatPrice } from '@/assets/util'

export default {
  name: 'UserDetailOffpay',
  data () {
    return {
      loading: false,
      offpayList: [],
      offpayPageSize: 10,
      offpayCurrentPage: 1,
      offpayTotalCnt: 0
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
    getOffpays () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/offpay_offline_order/?user__id=' + this.id +
        '&page_num=' + this.offpayCurrentPage +
        '&page_size=' + this.offpayPageSize)
        .then(res => {
          that.offpayTotalCnt = res.data.count
          that.offpayList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleOffpayCurrentChange (currentPage) {
      this.offpayCurrentPage = currentPage
      this.getOffpays()
    }
  },
  created () {
    this.getOffpays()
  }
}
</script>

<style scoped>

</style>
