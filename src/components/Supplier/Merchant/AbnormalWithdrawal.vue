<template>
  <div class="main-col">
    <div class="main-col" v-loading="loading">
      <div class="filter-container">
        <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      </div>
      <div class="card-outer">
        <div v-if="dataSlice && list.length > 0" class="card-container">
          <el-card
            v-for="(item, index) in dataSlice"
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
            <div class="not-passed primary">
              <hr/>
              <p>异常原因：{{item.reason}}</p>
              <el-button class="blue_button"
                         v-can:edit="'Supplier'"
                         @click.stop="openDialog(item)">非异常提现</el-button>
              <el-button class="blue_button"
                         v-can:edit="'Supplier'"
                         @click.stop="confirm(item, 1)">异常提现</el-button>
            </div>
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
  components: {EmptyPage},
  data () {
    return {
      loading: true,
      list: [],
      input: '',
      confirm_item: {},
      sort_value: 'name',
      reseller_uuid: '',
      status: {
        CREATED: '已发起',
        DEALING: '处理中',
        TRANSFERRED: '已到账',
        WAITING_FOR_CONFIRM: '等待人工审核',
        CANCELED: '已取消'
      },
      currentPage: 1,
      pageSize: 20,
      dialogVisible: false
    }
  },
  computed: {
    totalCnt () {
      if (this.list) {
        return this.list.length
      }
      return 0
    },
    dataSlice () {
      return this.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    isCorrect () {
      return !(this.input === this.confirm_item.confirm_code)
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
      this.$axios.get('/insider/merchant_withdrawal/?status=WAITING_FOR_CONFIRM&page_num=' + that.currentPage + '&page_size=' + that.pageSize)
        .then(res => {
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
      this.$axios.post('/insider/merchant_withdrawal/' + item.id + '/confirm/', {
        action: action,
        confirm_code: item.confirm_code
      })
        .then(() => {
          that.$message.success('异常提现处理成功')
          this.getData()
        })
        .catch(error => {
          console.log(error)
          that.$message.error('异常提现处理失败')
        })
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
