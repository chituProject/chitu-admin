<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button class="search-button" :type="query_status === '' ? 'primary' : 'normal'" size="medium" @click="handleSelect('')">全部</el-button>
      <el-button class="search-button" :type="query_status === 'UNSHIPPED' ? 'primary' : 'normal'" size="medium" @click="handleSelect('UNSHIPPED')">待发货<span v-if="counts.UNSHIPPED > 0">（{{counts.UNSHIPPED}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'SHIPPING' ? 'primary' : 'normal'" size="medium" @click="handleSelect('SHIPPING')">已发货<span v-if="counts.SHIPPING > 0">（{{counts.SHIPPING}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'FINISHED' ? 'primary' : 'normal'" size="medium" @click="handleSelect('FINISHED')">已完成<span v-if="counts.FINISHED > 0">（{{counts.FINISHED}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'UNPAID_UNFILLED' ? 'primary' : 'normal'" size="medium" @click="handleSelect('UNPAID_UNFILLED')">待付款<span v-if="counts.UNPAID_UNFILLED > 0">（{{counts.UNPAID_UNFILLED}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'CLOSED' ? 'primary' : 'normal'" size="medium" @click="handleSelect('CLOSED')">已关闭<span v-if="counts.CLOSED > 0">（{{counts.CLOSED}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'CANCELED' ? 'primary' : 'normal'" size="medium" @click="handleSelect('CANCELED')">已取消<span v-if="counts.CANCELED > 0">（{{counts.CANCELED}}）</span></el-button>
    </div>
    <div class="filter-container2">
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
          stripe
          ref="table"
          :data="list"
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
            label="状态">
            <template slot-scope="scope">{{ status[scope.row.status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="支付时间"
            width="135">
            <template slot-scope="scope">{{ formatTime(scope.row.paid_at) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单金额">
            <template slot-scope="scope">{{ formatPrice(scope.row.order_amount) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="specification"
            label="SKU型号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="user_name"
            label="来源用户">
          </el-table-column>
          <el-table-column
            align="center"
            prop="receiver_name"
            label="收货人姓名">
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
import EmptyPage from '@/components/EmptyPage'
import { formatTime, formatPrice } from '@/assets/util'
import constants from '@/assets/constants'

export default {
  name: 'GiftOrders',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_key: 'id',
      query_value: '',
      is_search: false,
      query_status: '',
      options: [
        {
          label: '订单号',
          value: 'id'
        },
        {
          label: '来源用户',
          value: 'user__id'
        },
        {
          label: '收货人姓名',
          value: 'receiver_name'
        },
        {
          label: '收货人电话',
          value: 'receiver_tel'
        }
      ],
      // list
      list: [],
      counts: {},
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      status: constants.ORDER_STATUS
    }
  },
  methods: {
    formatTime,
    formatPrice,
    getData () {
      this.is_search = false
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
    },
    querySearch () {
      this.is_search = true
      this.currentPage = 1
      this.query_value = this.input
      this.query()
    },
    handleSelect (status) {
      this.query_status = status
      this.getData()
    },
    query () {
      let that = this
      that.loading = true
      this.$axios.get('/gift_insider/gift_order/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&status=' + this.query_status +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
      this.$axios.get('/gift_insider/gift_order/count/')
        .then(res => {
          console.log(res.data)
          that.counts = res.data
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    onRowClick (row, event, column) {
      // this.$router.push('/gift/orders/' + row.id)
      window.open(window.location.origin + '/#/gift/orders/' + row.id)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
  .filter-container2 {
    width: 100%;
    position: absolute;
    height: 60px;
    top: 64px;
    left: 0;
    right: 0;
    background-color: #f8f6f6;
  }
  .card-outer {
    top: 124px;
  }
</style>
