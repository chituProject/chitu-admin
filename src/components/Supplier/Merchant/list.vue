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
      <el-button type="primary" icon="el-icon-search" class="search-button" size="medium" @click.stop="querySearch" disabled>搜索</el-button>
      <router-link to="/supplier/merchant/unaudited"><el-button class="search-button" size="medium">待审核<span v-if="unauditedCount > 0"> ({{unauditedCount}})</span></el-button></router-link>
      <router-link to="/supplier/merchant/auditfailed"><el-button class="search-button" size="medium">审核不通过<span v-if="failedCount > 0"> ({{failedCount}})</span></el-button></router-link>
      <router-link to="/supplier/merchant/abnormal"><el-button class="search-button" size="medium">异常提现<span v-if="abnormalCount > 0"> ({{abnormalCount}})</span></el-button></router-link>
    </div>
    <div class="card-outer">
      <div v-if="supplierList && supplierList.length > 0" class="card-container">
        <el-card
          v-for="(item, index) in supplierList"
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
              <el-button class="blue_button"
                         v-can:edit="'Supplier'"
                         v-if="item.status === 'AUDITED'"
                         @click.stop="rebut(item)">废弃</el-button>
                         <!--<el-button class="blue_button"-->
                         <!--v-else-if="item.status === 'AUDIT_FAILED'"-->
                         <!--@click.stop="recover(item)">恢复</el-button>-->
                         <!--<el-button class="blue_button"-->
                         <!--v-else-if="item.status === 'UNAUDITED'"-->
                         <!--@click.stop="openDetail(item)">审核</el-button>-->
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
      title="废弃"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" size="small">
        <el-form-item>
          <span>请在下面输入这个商家名称，然后确定进行废弃！</span>
        </el-form-item>
        <el-form-item>
          <el-input type="text" v-model="rebut_name"></el-input>
        </el-form-item>
        <div style="text-align: center;">
          <el-button type="primary" @click="confirmRebut(rebut_item, 0)" size="medium" :disabled="isCorrect">确定</el-button>
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
  name: 'Supplier',
  components: {
    EmptyPage
  },
  data () {
    return {
      input: '',
      supplierList: [],
      pageSize: 20,
      currentPage: 1,
      totalCnt: 0,
      query_key: 'name',
      query_value: '',
      is_search: false,
      options: [
        {
          label: '企业名称',
          value: 'name'
        }
      ],
      SupplierDetail: null,
      unauditedCount: 0,
      failedCount: 0,
      loading: false,
      abnormalCount: 0,
      rebut_item: {},
      rebut_name: '',
      dialogVisible: false
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
    getData () {
      let that = this
      this.is_search = false
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
      this.$axios.get('/insider/merchant/?status=UNAUDITED')
        .then(res => {
          that.unauditedCount = res.data.count
        })
      this.$axios.get('/insider/merchant/?status=AUDIT_FAILED')
        .then(res => {
          that.failedCount = res.data.count
        })
      this.$axios.get('/insider/merchant_withdrawal/?status=WAITING_FOR_CONFIRM')
        .then(res => {
          that.abnormalCount = res.data.count
        })
    },
    querySearch () {
      this.is_search = true
      this.currentPage = 1
      this.query_value = this.input
      this.query()
    },
    query () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/merchant/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.supplierList = []
          res.data.results.forEach(item => {
            if (item.status === 'AUDITED') {
              that.supplierList.push(item)
            }
          })
        })
        .finally(() => {
          that.loading = false
        })
    },
    openDetail (item) {
      // this.$router.push('/supplier/merchant/' + item.uuid + '/detail')
      window.open(window.location.origin + '/#/supplier/merchant/' + item.uuid + '/detail')
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    rebut (item) {
      this.rebut_item = item
      this.dialogVisible = true
    },
    recover (item) {
      const that = this
      this.$confirm('确认要恢复供应商 ' + item.name + ' 吗?', '恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.confirmRebut(item, 1)
      })
    },
    confirmRebut (item, action) {
      let that = this
      this.$axios.post('/insider/merchant/' + item.uuid + '/audit/', {
        action: action,
        reason: '审核不通过'
      }).then(() => {
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
  }
  .card:hover {
    cursor: pointer;
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
