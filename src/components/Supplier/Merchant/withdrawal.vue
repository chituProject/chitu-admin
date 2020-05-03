<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
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
            <el-form-item label="企业地址">
              <span>{{item.address}}</span>
            </el-form-item>
            <el-form-item label="企业名称">
              <span>{{item.name}}</span>
            </el-form-item>
            <el-form-item label="发起时间">
              <span>{{formatTime(item.created_at)}}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{status[item.status]}}</span>
            </el-form-item>
            <el-form-item label="银行编码">
              <span>{{item.bank_code}}</span>
            </el-form-item>
            <el-form-item label="纳税人税务登记号">
              <span>{{item.tax_registration_number}}</span>
            </el-form-item>
            <el-form-item label="到账时间">
              <span>{{formatTime(item.transferred_at)}}</span>
            </el-form-item>
            <el-form-item label="提现金额">
              <span>{{(item.amount / 100).toFixed(2)}}元</span>
            </el-form-item>
            <el-form-item label="银行账号">
              <span>{{item.bank_card_no}}</span>
            </el-form-item>
            <el-form-item label="手机号码">
              <span>{{item.phone}}</span>
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
  name: 'SupplierWithdrawal',
  components: {EmptyPage},
  data () {
    return {
      loading: true,
      input: '',
      sort_value: 'name',
      options: [
        {
          label: '场景名称',
          value: 'name'
        }
      ],
      types: {
        OFFPAY: '免单提现',
        REBATE: '返利提现',
        EARNEST: '诚意金'
      },
      status: {
        CREATED: '已发起',
        DEALING: '处理中',
        TRANSFERRED: '已到账',
        WAITING_FOR_CONFIRM: '等待人工审核',
        CANCELED: '已取消'
      },
      list: [],
      totalCnt: 0,
      currentPage: 1,
      pageSize: 20
    }
  },
  props: {
    uuid: {
      type: String
    }
  },
  methods: {
    formatTime,
    goBack () {
      this.$router.go(-1)
    },
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/merchant_withdrawal/?merchant__uuid=' + that.uuid + '&page_num=' + that.currentPage + '&page_size=' + that.pageSize)
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
      this.getData()
    },
    querySearch () {
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>

  .filter-container {
    padding: 12px;
  }
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
