<template>
  <div class="main-col" v-loading="loading">
    <overview></overview>
    <div class="filter-container flex-filter">
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
      <el-button type="primary" icon="el-icon-search" class="search-button" size="medium" @click.stop="querySearch">筛选</el-button>
      <el-button class="search-button" :type="query_status === '' ? 'primary' : 'normal'" size="medium" @click="queryStatus('')">全部<span v-if="allCount > 0"> ({{allCount}})</span></el-button>
      <el-button class="search-button" :type="query_status === 'UNAUDITED' ? 'primary' : 'normal'" size="medium" @click="queryStatus('UNAUDITED')">待审核<span v-if="unauditedCount > 0"> ({{unauditedCount}})</span></el-button>
      <el-button class="search-button" :type="query_status === 'AUDIT_FAILED' ? 'primary' : 'normal'" size="medium" @click="queryStatus('AUDIT_FAILED')">异常<span v-if="abnormalCount > 0"> ({{abnormalCount}})</span></el-button>
      <el-button type="primary" icon="el-icon-plus" class="search-button" size="medium" @click.stop="gotoAdd" v-can:edit="'Reseller'">新增</el-button>
    </div>
    <div class="card-outer">
      <div v-if="list && list.length > 0" class="card-container">
        <el-table
          ref="table"
          stripe
          :data="list"
          @row-click="onRowClick"
          :row-style="{ cursor: 'pointer' }"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="name"
            label="商户名称">
          </el-table-column>
          <el-table-column
            align="center"
            label="商户地址"
            width="202">
            <template slot-scope="scope">{{ scope.row.area }}{{ scope.row.address }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="微信用户">
            <template slot-scope="scope" v-if="scope.row.user">
              <div style="display: flex; align-items: center; width: 110px; margin: auto">
                <img class="avatar" :src="scope.row.user.wechat_avatar_url">
                <div class="avatar-name">{{scope.row.user.wechat_nickname ? scope.row.user.wechat_nickname : scope.row.username}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="绑定用户"
            width="202">
            <template slot-scope="scope">
              <template v-if="scope.row.bind_users && scope.row.bind_users.length > 0">
                <div style="display: flex; align-items: center;">
                  <img v-for="i in [0, 1, 2]" v-if="i < scope.row.bind_users.length" :key="i" class="avatar" :src="scope.row.bind_users[i].wechat_avatar_url">
                  <div class="avatar-name">共{{scope.row.bind_users.length}}人</div>
                </div>
              </template>
              <template v-else>
                无
              </template>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="线下收款金额">
            <template slot-scope="scope">
              {{ scope.row.amount_class.payment_amount | formatPriceFixed }}元
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="待入账金额">
            <template slot-scope="scope">
              {{ scope.row.amount_class.unrecorded_amount | formatPriceFixed }}元
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态"
            width="90">
            <template slot-scope="scope">{{ status[scope.row.status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button type="text"
                         v-can:edit.disable="'Reseller'"
                         v-if="scope.row.status === 'AUDITED'"
                         @click.stop="rebut(scope.row, 0)">废弃</el-button>
              <el-button type="text"
                         v-can:edit.disable="'Reseller'"
                         v-else-if="scope.row.status === 'AUDIT_FAILED'"
                         @click.stop="recover(scope.row, 1)">恢复</el-button>
              <div v-else>
                <el-button type="text"
                           v-can:edit.disable="'Reseller'"
                           @click.stop="auditYes(scope.row)">通过</el-button>
                <el-button type="text"
                           v-can:edit.disable="'Reseller'"
                           @click.stop="auditNo(scope.row)">不通过</el-button>
              </div>
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
    <el-dialog
      title="废弃"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" size="small">
        <el-form-item>
          <span>请在下面输入这个场景名称，然后确定进行废弃！</span><br/>
          <span style="font-weight: bold;">场景名称：{{ scene_name_old }}</span>
        </el-form-item>
        <el-form-item>
          <el-input type="text" v-model="scene_name"></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button @click="dialogVisible = false" size="medium">取消</el-button>
          <el-button type="primary" @click="doAudit(rebut_item, 0, '废弃')" size="medium" :disabled="isCorrect">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import constants from '@/assets/constants'
import EmptyPage from '@/components/EmptyPage'
import Overview from '@/components/Reseller/overview'

export default {
  name: 'ResellerOfficialList',
  components: {
    EmptyPage,
    Overview
  },
  props: {
    type: {
      type: String,
      default: 'ONLINE'
    }
  },
  watch: {
    type: function () {
      console.log('type changed: ' + this.type)
      this.getData()
    }
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_status: '',
      query_key: 'name',
      query_value: '',
      options: [
        {
          label: '店铺名',
          value: 'name'
        },
        {
          label: '店铺ID',
          value: 'uuid'
        },
        {
          label: '姓名',
          value: 'username'
        }
      ],
      // list
      list: [],
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      status: {
        'AUDITED': '入驻成功',
        'UNAUDITED': '未审核',
        'AUDIT_FAILED': '异常'
      },
      // badge
      allCount: 0,
      unauditedCount: 0,
      abnormalCount: 0,
      // dialog
      dialogVisible: false,
      scene_name: '',
      scene_name_old: '',
      rebut_item: {}
    }
  },
  computed: {
    isCorrect () {
      return !(this.scene_name === this.rebut_item.name)
    }
  },
  methods: {
    getData () {
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
      let that = this
      this.$axios.get('/insider/reseller/?status=UNAUDITED')
        .then(res => {
          that.unauditedCount = res.data.count
        })
      this.$axios.get('/insider/reseller/?status=AUDIT_FAILED')
        .then(res => {
          that.abnormalCount = res.data.count
        })
      this.$axios.get('/insider/reseller/')
        .then(res => {
          that.allCount = res.data.count
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
      this.$axios.get(`/insider/reseller/?type=${this.type}&status=${this.query_status}&page_num=${this.currentPage}&page_size=${this.pageSize}&${this.query_key}=${this.query_value}`)
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
    queryStatus (status) {
      this.query_status = status
      this.getData()
    },
    auditYes (item) {
      const that = this
      this.$confirm('确认要通过场景 ' + item.name + ' 审核吗?', '审核通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.doAudit(item, 1, '审核通过')
      })
    },
    auditNo (item) {
      const that = this
      this.$prompt('不通过原因', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入不通过原因'
      }).then(({ value }) => {
        that.doAudit(item, 0, value)
      }).catch(() => {})
    },
    gotoAdd () {
      this.$router.push(`/reseller/${this.type}/add`)
    },
    onRowClick (row, event, column) {
      window.open(`${window.location.origin}/#/reseller/${this.type}/${row.uuid}`)
    },
    rebut (item) {
      this.rebut_item = item
      this.scene_name_old = item.name
      this.dialogVisible = true
    },
    recover (item) {
      const that = this
      this.$confirm('确认要恢复场景 ' + item.name + ' 吗?', '恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.doAudit(item, 1, '恢复')
      })
    },
    doAudit (item, action, reason) {
      let that = this
      this.$axios.post('/insider/reseller/' + item.uuid + '/audit/', {
        action: action,
        reason: reason
      }).then(() => {
        that.getData()
        that.$message.success('操作成功')
        that.dialogVisible = false
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  .main-col {
    display: flex;
    flex-direction: column;
  }
  .avatar {
    width: 40px;
    height: 40px;
  }
  .avatar + .avatar {
    margin-left: 4px;
  }
  .avatar-name {
    width: 60px;
    margin-left: 4px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-outer {
    position: relative;
    top: 0px;
    flex: auto;
  }
  .flex-filter {
    position: static;
    display: flex;
    justify-content: space-around;
    padding: 10px;
  }
  .flex-filter .search-button,
  .flex-filter .search,
  .flex-filter .selecter {
    margin: 0 !important;
  }
</style>
