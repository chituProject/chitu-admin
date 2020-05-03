<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-select v-model="query_key" class="selecter">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input
        class="search"
        v-model="input"
        placeholder="搜索内容"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" class="search-button" size="medium" @click.stop="querySearch">搜索</el-button>
    </div>
    <div class="card-outer">
      <div v-if="list && list.length > 0" class="card-container">
        <el-table
          ref="table"
          stripe
          :data="list"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="id"
            label="订单号">
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">{{ scope.row.status }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="充值时间">
            <template slot-scope="scope">{{ formatTime(scope.row.paid_at) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="充值类别">
            <template slot-scope="scope" v-if="scope.row.items.length > 0">{{ scope.row.items[0].goods_full_title }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="选项售价">
            <template slot-scope="scope" v-if="scope.row.items.length > 0">{{ formatPrice(scope.row.items[0].total) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="免单金抵扣">
            <template slot-scope="scope">{{ formatPrice(scope.row.real_offpay_amount) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="实际支付">
            <template slot-scope="scope">{{ formatPrice(scope.row.order_amount) }}元</template>
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
      <empty-page v-else></empty-page>
    </div>
  </div>
</template>

<script>
import Yfooter from '@/components/Footer'
import { formatTime, formatPrice } from '@/assets/util'
import EmptyPage from '../EmptyPage'

export default {
  name: 'Orders',
  components: {
    EmptyPage,
    Yfooter
  },
  data () {
    return {
      loading: false,
      // list
      list: [],
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      // search
      input: '',
      query_key: 'id',
      query_value: '',
      options: [
        {
          label: '充值用户',
          value: 'receiver_name'
        },
        {
          label: '订单号',
          value: 'id'
        }
      ]
      // status
      // query_status: 'PAID_FILLED',
    }
  },
  methods: {
    formatTime,
    formatPrice,
    getData () {
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
    },
    querySearch () {
      this.currentPage = 1
      this.query_value = this.input
      this.query()
    },
    query () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/suborder/?type=OFFPAY_LIFE&page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    handleSelectStatus () {
      this.currentPage = 1
      this.query()
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
  .demo-table-expand {
    width: 100%;
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(300px, 1fr) );
    grid-column-gap: 10px;
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .card:hover {
    cursor: pointer;
  }

</style>
