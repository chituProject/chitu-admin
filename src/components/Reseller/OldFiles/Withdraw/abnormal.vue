<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="$router.go(-1)">返回</el-button>
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
            <el-form-item label="店铺名称">
              <span>{{item.reseller_name}}</span>
            </el-form-item>
            <el-form-item label="提现类型">
              <span>{{types[item.type]}}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{status[item.status]}}</span>
            </el-form-item>
            <el-form-item label="发起时间">
              <span>{{formatTime(item.created_at)}}</span>
            </el-form-item>
            <el-form-item label="提现卡号">
              <span>{{item.bank_card_no}}</span>
            </el-form-item>
            <el-form-item label="可提现返利金额">
              <span>{{(item.related_withdrawable_amount / 100).toFixed(2)}}元</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{item.name}}</span>
            </el-form-item>
            <el-form-item label="到账时间">
              <span>无</span>
            </el-form-item>
            <el-form-item label="手机号码">
              <span>{{item.phone}}</span>
            </el-form-item>
            <el-form-item label="提现金额">
              <span>{{(item.amount / 100).toFixed(2)}}元</span>
            </el-form-item>
          </el-form>
          <div class="not-passed primary">
            <hr/>
            <p>异常原因：{{item.reason}}</p>
            <el-button class="blue_button"
                       @click.stop="openDialog(item)">非异常提现</el-button>
            <el-button class="blue_button"
                       @click.stop="confirm(item, 1)">异常提现</el-button>
          </div>
        </el-card>
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" size="small">
        <el-form-item>
          <span>请仔细确认提现申请是否存在异常，如无异常请输入收到的校验码，校验码输入之后请仔细确认是否输入正确，确认之后不能进行更改。</span>
        </el-form-item>
        <el-form-item>
          <span>收到的校验码为：<b>{{confirm_item.confirm_code}}</b></span>
        </el-form-item>
        <el-form-item>
          <el-input type="number" v-model="input"></el-input>
        </el-form-item>
        <div style="text-align: center;">
          <el-button type="primary" @click="confirm(confirm_item, 0)" size="medium" :disabled="isCorrect">提交</el-button>
          <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { formatTime } from '@/assets/util'
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'AbnormalWithdrawal',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // constants
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
      // list
      list: [],
      currentPage: 1,
      pageSize: 20,
      totalCnt: 0,
      // dialog
      dialogVisible: false,
      confirm_item: {},
      input: ''
    }
  },
  computed: {
    isCorrect () {
      return !(this.input === this.confirm_item.confirm_code)
    }
  },
  methods: {
    formatTime,
    getData () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/reseller_withdrawal/?status=WAITING_FOR_CONFIRM&page_num=' +
        that.currentPage + '&page_size=' + that.pageSize)
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
    },
    openDialog (item) {
      this.confirm_item = item
      this.input = ''
      this.dialogVisible = true
    },
    confirm (item, action) {
      let that = this
      that.loading = true
      this.$axios.post('/insider/reseller_withdrawal/' + item.id + '/confirm/', {
        action: action,
        confirm_code: item.confirm_code
      }).then(() => {
        that.$message.success('异常提现处理成功')
        this.currentPage = 1
        this.getData()
      }).finally(() => {
        that.loading = false
      })
    }
  },
  created () {
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
  .not-passed {
    width: 100%;
    display: block;
    float: left;
    text-align: left;
    font-weight: bold;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .not-passed p {
    float: left;
    width: 50%;
    margin-left: 10px;
    color: #F56C6C;
  }
  .not-passed .el-button {
    margin-top: -10px;
    margin-right: 10px;
    float: right;
  }
  .demo-operation {
    text-align: center;
    vertical-align: center;
  }
  .demo-operation .el-button {
    margin: 6px 0;
    width: 100%;
  }
</style>
