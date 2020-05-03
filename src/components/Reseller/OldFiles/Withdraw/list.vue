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
      <el-button class="search-button" size="medium" @click="gotoAbnormal">异常提现<span v-if="abnormalCount > 0">（{{abnormalCount}}）</span></el-button>
    </div>
    <div class="card-outer">
      <div v-if="list && list.length > 0" class="card-container">
        <el-card
          v-for="(item, index) in list"
          :key="index"
          shadow="hover"
          class="card">
          <el-form inline class="demo-table-expand" label-width="110px" label-position="left">
            <el-form-item label="提现单号">
              <span>{{item.id}}</span>
            </el-form-item>
            <el-form-item label="发起时间">
              <span>{{formatTime(item.created_at)}}</span>
            </el-form-item>
            <el-form-item label="提现类型">
              <span>{{types[item.type]}}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{status[item.status]}}</span>
            </el-form-item>
            <el-form-item label="提现卡号">
              <span>{{item.bank_card_no}}</span>
            </el-form-item>
            <el-form-item label="可提现返利金额">
              <span>{{(item.related_withdrawable_amount / 100).toFixed(2)}}元</span>
            </el-form-item>
            <el-form-item label="到账时间">
              <span>{{formatTime(item.transferred_at)}}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{item.name}}</span>
            </el-form-item>
            <el-form-item label="手机号码">
              <span>{{item.phone}}</span>
            </el-form-item>
            <el-form-item label="提现金额">
              <span>{{(item.amount / 100).toFixed(2)}}元</span>
            </el-form-item>
          </el-form>
        </el-card>
        <el-pagination
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
import { formatTime } from '@/assets/util'
import EmptyPage from '@/components/EmptyPage'
export default {
  name: 'SceneWithdrawal',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      abnormalCount: 0,
      // search
      input: '',
      query_key: 'reseller__name',
      query_value: '',
      options: [
        {
          label: '店铺名',
          value: 'reseller__name'
        },
        {
          label: '店铺ID',
          value: 'reseller__uuid'
        },
        {
          label: '姓名',
          value: 'name'
        }
      ],
      // list
      list: [],
      totalCnt: 0,
      currentPage: 1,
      pageSize: 20,
      // constants
      types: {
        OFFPAY: '免单提现',
        REBATE: '返利提现',
        EARNEST: '诚意金'
      },
      status: {
        CREATED: '已发起',
        DEALING: '提现中',
        TRANSFERRED: '已到账'
      }
    }
  },
  methods: {
    formatTime,
    getData () {
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
      let that = this
      this.$axios.get('/insider/reseller_withdrawal/?status=WAITING_FOR_CONFIRM')
        .then(res => {
          that.abnormalCount = res.data.count
        })
    },
    querySearch () {
      this.currentPage = 1
      this.query_value = this.input
      this.query()
    },
    query () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/reseller_withdrawal/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
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
      this.query()
    },
    gotoAbnormal () {
      this.$router.push('/scene/withdraw/abnormal')
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
</style>
