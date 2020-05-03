<template>
  <div v-loading="loading">
    <el-table
      stripe
      :data="list"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="id"
        label="提现单号">
      </el-table-column>
      <el-table-column
        align="center"
        label="提现状态">
        <template slot-scope="scope">{{ status[scope.row.status] }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="提现金额">
        <template slot-scope="scope">{{ scope.row.amount | formatPriceFixed }}元</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发起时间">
        <template slot-scope="scope">{{formatTime(scope.row.created_at)}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="bank_card_no"
        label="提现账户号">
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pageSize < totalCnt"
      class="pagination"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalCnt"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import { formatTime } from '@/assets/util'
import constants from '@/assets/constants'

export default {
  name: 'ResellerWithdraw',
  data () {
    return {
      loading: false,
      list: [],
      pageSize: 20,
      currentPage: 1,
      totalCnt: 0,
      status: constants.WITHDRAW_STATUS
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    formatTime,
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/reseller_withdrawal/?reseller__uuid=' + this.id +
        '&page_num=' + this.currentPage +
        '&page_size=' + this.pageSize)
        .then(res => {
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getData()
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>

</style>
