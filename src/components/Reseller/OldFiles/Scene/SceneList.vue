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
      <el-button class="search-button" size="medium" @click="gotoUnaudited">待审核<span v-if="unauditedCount > 0"> ({{unauditedCount}})</span></el-button>
      <el-button class="search-button" size="medium" @click="gotoAuditFailed">入驻失败<span v-if="failedCount > 0"> ({{failedCount}})</span></el-button>
      <el-button type="primary" icon="el-icon-plus" class="search-button" size="medium" @click.stop="gotoAdd">新增</el-button>
    </div>
    <div class="card-outer">
      <div v-if="sceneList && sceneList.length > 0" class="card-container">
        <el-card
          v-for="(item, index) in sceneList"
          :key="index"
          shadow="hover"
          class="card">
          <div @click="openDetail(item)" style="display: flex; flex-direction: row;align-items: center">
            <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
              <el-form-item label="ID" style="width: 100%">
                <span>{{item.uuid}}</span>
              </el-form-item>
              <el-form-item label="扫码次数">
                <span>{{item.scan_times}}</span>
              </el-form-item>
              <el-form-item label="可提现免单金额">
                <span>{{(item.withdrawable_offpay / 100).toFixed(2) + '元'}}</span>
              </el-form-item>
              <el-form-item label="是否活跃">
                <span>{{item.is_active ? '是' : '否'}}</span>
              </el-form-item>
              <el-form-item label="店铺名">
                <span>{{item.name}}</span>
              </el-form-item>
              <el-form-item label="订单数">
                <span>{{item.order_amount}}</span>
              </el-form-item>
              <el-form-item label="可提现返利金额">
                <span>{{(item.withdrawable_rebate / 100).toFixed(2) + '元'}}</span>
              </el-form-item>
              <el-form-item label="店铺地址" style="width: 66%;">
                <span>{{item.area + ' ' + item.address}}</span>
              </el-form-item>
            </el-form>
            <div class="demo-operation">
              <el-button class="blue_button" @click.stop="rebut(item)">废弃</el-button>
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
          <span>请在下面输入这个场景名称，然后确定进行废弃！</span>
        </el-form-item>
        <el-form-item>
          <el-input type="text" v-model="scene_name"></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button @click="dialogVisible = false" size="medium">取消</el-button>
          <el-button type="primary" @click="confirmRebut(rebut_item, 0)" size="medium" :disabled="isCorrect">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import constants from '@/assets/constants'
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'SceneList',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
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
      sceneList: [],
      pageSize: 20,
      currentPage: 1,
      totalCnt: 0,
      // badge
      unauditedCount: 0,
      failedCount: 0,
      // dialog
      dialogVisible: false,
      scene_name: '',
      rebut_item: {}
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
          that.failedCount = res.data.count
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
      this.$axios.get('/insider/reseller/?status=AUDITED&page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          that.totalCnt = res.data.count
          that.sceneList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    openDetail (item) {
      window.open(window.location.origin + '/#/scene/detail/' + item.uuid)
    },
    gotoUnaudited () {
      this.$router.push('/scene/list/unaudited')
    },
    gotoAuditFailed () {
      this.$router.push('/scene/list/audit_failed')
    },
    gotoAdd () {
      this.$router.push('/scene/add')
    },
    rebut (item) {
      this.rebut_item = item
      this.dialogVisible = true
    },
    recover (item) {
      const that = this
      this.$confirm('确认要恢复场景 ' + item.name + ' 吗?', '恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.confirmRebut(item, 1)
      })
    },
    confirmRebut (item, action) {
      let that = this
      this.$axios.post('/insider/reseller/' + item.uuid + '/audit/', {
        action: action,
        reason: '驳回审核'
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

  .demo-table-expand {
    /*width: 100%;*/
    flex: 1;
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
  .filter-container2 {
    width: 100%;
    position: absolute;
    height: 60px;
    top: 64px;
    left: 0;
    right: 0;
    background-color: #f8f6f6;
  }
  /*.card-outer {*/
    /*top: 124px;*/
  /*}*/

</style>
