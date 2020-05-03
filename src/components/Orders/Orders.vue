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
      <el-select v-model="query_status" class="selecter" style="float: right; margin-right: 20px" @change="handleSelectStatus">
        <el-option
          v-for="item in status_options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
            label="订单号"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            label="支付时间"
            width="135">
            <template slot-scope="scope">{{ formatTime(scope.row.paid_at) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商品合计">
            <template slot-scope="scope">{{ scope.row.online_order_amount | formatPriceFixed }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="免单金抵扣">
            <template slot-scope="scope">{{ (scope.row.online_order_amount - scope.row.order_amount) | formatPriceFixed }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="产生免单金">
            <template slot-scope="scope">{{ (scope.row.max_offpay_amount * scope.row.customer_profit / 100) | formatPriceFixed }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="实际支付">
            <template slot-scope="scope">{{ scope.row.order_amount | formatPriceFixed }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="receiver_name"
            label="收货人姓名">
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">{{ status[scope.row.suborder_status] }}</template>
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
      // search
      input: '',
      query_key: 'id',
      query_value: '',
      options: [
        {
          label: '订单号',
          value: 'id'
        },
        {
          label: '收货人姓名',
          value: 'receiver_name'
        },
        {
          label: '收货人电话',
          value: 'receiver_tel'
        },
        {
          label: '场景名称',
          value: 'from_reseller__name'
        }
      ],
      // status
      query_status: 'PAID_FILLED',
      status_options: [
        {
          label: '已支付',
          value: 'PAID_FILLED'
        },
        {
          label: '待填写地址',
          value: 'PAID_UNFILLED'
        },
        {
          label: '待支付',
          value: 'UNPAID_UNFILLED'
        },
        {
          label: '已结束',
          value: 'FINISHED'
        },
        {
          label: '已取消',
          value: 'CANCELED'
        }
      ],
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
      this.$axios.get('/insider/order/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value +
        '&status=' + this.query_status)
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
      // this.$router.push('/orders/' + row.id)
      window.open(window.location.origin + '/#/orders/' + row.id)
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
