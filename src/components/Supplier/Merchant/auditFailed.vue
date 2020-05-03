<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
    </div>
    <div class="card-outer">
      <div v-if="unauditedList && unauditedList.length > 0" class="card-container">
        <el-card
          v-for="(item, index) in unauditedList"
          :key="index"
          shadow="hover"
          class="card">
          <div @click="openDetail(item)" style="display: flex; flex-direction: row;align-items: center">
            <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
              <el-form-item label="商家ID" style="width: 100%">
                <span>{{item.uuid}}</span>
              </el-form-item>
              <el-form-item label="商家名称">
                <span>{{item.name}}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{item.score}}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{getStatus(item.status)}}</span>
              </el-form-item>
              <el-form-item label="联系人姓名">
                <span>{{item.contact_name}}</span>
              </el-form-item>
              <el-form-item label="主营类目">
                <span>{{item.main_category}}</span>
              </el-form-item>
              <el-form-item label="可提现金额">
                <span>{{(item.withdrawable_incoming / 100).toFixed(2)}}</span>
              </el-form-item>
            </el-form>
            <div class="demo-operation">
              <el-button class="blue_button" v-can:edit="'Supplier'" @click.stop="recover(item)">恢复</el-button>
            </div>
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
    <el-dialog
      title="恢复"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" size="small">
        <el-form-item>
          <span>请在下面输入这个商家名称，然后确认进行恢复成为正在审核状态！</span>
        </el-form-item>
        <el-form-item>
          <el-input type="text" v-model="rebut_name"></el-input>
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
import EmptyPage from '@/components/EmptyPage'
import constants from '@/assets/constants'

export default {
  name: 'SupplierAuditFailed',
  components: {EmptyPage},
  data () {
    return {
      loading: true,
      input: '',
      sort_value: 'name',
      options: [
        {
          label: '企业名称',
          value: 'name'
        }
      ],
      unauditedList: [],
      totalCnt: 0,
      currentPage: 1,
      pageSize: 20,
      status: constants.SCENE_STATUS,
      rebut_item: {},
      rebut_name: '',
      dialogVisible: false
    }
  },
  props: {
    model: {
      type: Object
    }
  },
  computed: {
    isCorrect () {
      return !(this.rebut_name === this.rebut_item.name)
    }
  },
  methods: {
    getStatus (status) {
      return constants.SCENE_STATUS[status]
    },
    goBack () {
      this.$router.go(-1)
    },
    getUnaudited () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/merchant/?status=AUDIT_FAILED&page_num=' + that.currentPage + '&page_size=' + that.pageSize)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.unauditedList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getUnaudited()
    },
    querySearch () {
    },
    recover (item) {
      this.rebut_item = item
      this.dialogVisible = true
      // const that = this
      // this.$confirm('确认要恢复供应商 ' + item.name + ' 吗?', '恢复', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(() => {
      //   that.confirmRebut(item, 1)
      // })
    },
    confirmRebut (item, action) {
      let that = this
      this.$axios.post('/insider/merchant/' + item.uuid + '/audit/', {
        action: action,
        reason: '驳回审核'
      }).then(() => {
        that.getUnaudited()
        that.$message.success('操作成功')
        that.dialogVisible = false
      })
    }
  },
  created () {
    this.getUnaudited()
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
