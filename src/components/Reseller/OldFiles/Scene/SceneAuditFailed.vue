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
          <div @click="openDetail(item)" style="display: flex; flex-direction: row;align-items: center">
            <el-form inline class="demo-table-expand" label-width="80px" label-position="left">
              <el-form-item label="ID" label-width="120px" style="width: 100%">
                <span>{{item.uuid}}</span>
              </el-form-item>
              <el-form-item label="店铺名" label-width="120px">
                <span>{{item.name}}</span>
              </el-form-item>
              <el-form-item label="手机号码" label-width="120px">
                <span>{{item.phone}}</span>
              </el-form-item>
              <el-form-item label="状态" label-width="120px">
                <span>{{getStatus(item.status)}}</span>
              </el-form-item>
              <el-form-item label="扫码次数" label-width="120px">
                <span>{{item.scan_times}}</span>
              </el-form-item>
              <el-form-item label="支付次数" label-width="120px">
                <span>{{item.order_amount}}</span>
              </el-form-item>
              <el-form-item label="可提现返利金额" label-width="120px">
                <span>{{(item.withdrawable_rebate / 100).toFixed(2) + '元'}}</span>
              </el-form-item>
              <el-form-item label="可提现免单金额" label-width="120px">
                <span>{{(item.withdrawable_offpay / 100).toFixed(2) + '元'}}</span>
              </el-form-item>
              <el-form-item label="店铺地址" label-width="120px" style="width: 66%;">
                <span>{{item.area + ' ' + item.address}}</span>
              </el-form-item>
            </el-form>
            <div class="demo-operation">
              <el-button class="blue_button" @click.stop="recover(item)">恢复</el-button>
            </div>
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
      title="恢复"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" size="small">
        <el-form-item>
          <span>请在下面输入这个场景名称，然后确认进行恢复成为正在审核状态！</span>
        </el-form-item>
        <el-form-item>
          <el-input type="text" v-model="scene_name"></el-input>
        </el-form-item>
        <div style="text-align: center;">
          <el-button type="primary" @click="confirmRebut(rebut_item, 1)" size="medium" :disabled="isCorrect">确定</el-button>
          <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import constants from '@/assets/constants'
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'SceneAuditFailed',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // list
      list: [],
      totalCnt: 0,
      currentPage: 1,
      pageSize: 20,
      // constants
      status: constants.SCENE_STATUS,
      // dialog
      rebut_item: {},
      scene_name: '',
      dialogVisible: false
    }
  },
  computed: {
    isCorrect () {
      return !(this.scene_name === this.rebut_item.name)
    }
  },
  methods: {
    getStatus (status) {
      return constants.SCENE_STATUS[status]
    },
    getData () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/reseller/?status=AUDIT_FAILED&page_num=' + this.currentPage + '&page_size=' + this.pageSize)
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
    recover (item) {
      // const that = this
      // this.$confirm('确认要恢复场景 ' + item.name + ' 吗?', '恢复', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(() => {
      //   that.confirmRebut(item, 1)
      // })
      this.rebut_item = item
      this.dialogVisible = true
    },
    confirmRebut (item, action) {
      let that = this
      this.$axios.post('/insider/reseller/' + item.uuid + '/audit/', {
        action: action,
        reason: '驳回审核'
      }).then(() => {
        that.currentPage = 1
        that.getData()
        that.$message.success('操作成功')
        that.dialogVisible = false
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
    width: 50%;
    min-width: 200px;
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
