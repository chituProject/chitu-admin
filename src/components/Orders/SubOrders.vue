<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button class="search-button" :type="query_status === '' ? 'primary' : 'normal'" size="medium" @click="handleSelect('')">全部</el-button>
      <el-button class="search-button" :type="query_status === 24 ? 'primary' : 'normal'" size="medium" @click="handleSelect(24)">超过24小时没发货<span v-if="counts.VERIFY > 0">（{{counts.VERIFY}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 48 ? 'primary' : 'normal'" size="medium" @click="handleSelect(48)">超过48小时没发货<span v-if="counts.PRE_ON > 0">（{{counts.PRE_ON}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 72 ? 'primary' : 'normal'" size="medium" @click="handleSelect(72)">超过72小时没发货<span v-if="counts.ON > 0">（{{counts.ON}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'SHIPPING' ? 'primary' : 'normal'" size="medium" @click="handleSelect('SHIPPING')">已发货<span v-if="counts.OFF > 0">（{{counts.OFF}}）</span></el-button>
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
          ref="table"
          stripe
          :data="list"
          @row-click="onRowClick"
          :row-style="{ cursor: 'pointer' }"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="id"
            label="子订单号"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="reseller_name"
            label="订单状态">
            <template slot-scope="scope">{{ status[scope.row.status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="reseller_name"
            label="产生免单金">
            <template slot-scope="scope">{{ (scope.row.total_offpay_limit * scope.row.customer_profit / 100) | formatPriceFixed }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商品合计">
            <template slot-scope="scope">{{ scope.row.suborder_amount | formatPriceFixed }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="merchant_name"
            label="商家名称">
          </el-table-column>
          <el-table-column
            align="center"
            label="支付时间"
            width="135">
            <template slot-scope="scope">{{ formatTime(scope.row.paid_at) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="快递单号">
            <template slot-scope="scope">
              <span v-if="scope.row.logistic_code">{{ scope.row.logistic_code }}</span>
              <el-button type="text" v-else @click.stop="ship(scope.row)" v-can:edit.disable="'Orders'">发货</el-button>
            </template>
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
import { formatTime } from '@/assets/util'
import EmptyPage from '../EmptyPage'
import constants from '../../assets/constants'

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
      counts: {},
      // search
      input: '',
      query_key: 'id',
      query_value: '',
      options: [
        {
          label: '子订单号',
          value: 'id'
        },
        {
          label: '商家名称',
          value: 'merchant__name'
        }
      ],
      // status
      query_status: '',
      status: constants.ORDER_STATUS
    }
  },
  methods: {
    formatTime,
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
      let url = '/insider/suborder/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value
      if (typeof this.query_status === 'number') {
        url += '&unshipped_hours_more_than=' + this.query_status
      } else if (typeof this.query_status === 'string') {
        url += '&status=' + this.query_status
      }
      this.$axios.get(url)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    onRowClick (row, event, column) {
      window.open(window.location.origin + '/#/orders/sub/' + row.id)
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    handleSelect (shelfStatus) {
      this.query_status = shelfStatus
      this.getData()
    },
    ship (row) {
      this.$message.warning('暂不支持该操作')
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
