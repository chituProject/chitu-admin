<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="$router.go(-1)">返回</el-button>
    </div>
    <div class="card-outer">
      <div v-if="unauditedList && unauditedList.length > 0" class="card-container">
        <el-card
          v-for="(item, index) in unauditedList"
          :key="index"
          shadow="hover"
          class="card">
          <div style="display: flex;flex-direction: row;align-items: center">
            <img :src="item.facade_picture" style="width: 100px; height: 100px; margin-right: 20px;"/>
            <el-form inline class="demo-table-expand" style="flex: 1" label-width="100px" label-position="left">
              <el-form-item label="场景ID">
                <span>{{item.uuid}}</span>
              </el-form-item>
              <el-form-item label="姓名">
                <span>{{item.username}}</span>
              </el-form-item>
              <el-form-item label="手机号码">
                <span>{{item.phone}}</span>
              </el-form-item>
              <el-form-item label="身份证号码">
                <span>{{item.idcard}}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{status[item.status]}}</span>
              </el-form-item>
              <el-form-item label="店铺名">
                <span>{{item.name}}</span>
              </el-form-item>
              <el-form-item label="微信openid">
                <span>{{item.user ? item.user.wechat_unionid : ''}}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{item.area + ' ' + item.address}}</span>
              </el-form-item>
            </el-form>
            <div>
              <el-row style="margin-bottom: 20px">
                <el-button class="blue_button" size="medium" style="width: 120px" @click.stop="auditYes(item.uuid)">审核通过</el-button>
              </el-row>
              <el-row>
                <el-button class="blue_button" size="medium" style="width: 120px" @click.stop="auditNo(item.uuid)">审核不通过</el-button>
              </el-row>
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
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import constants from '@/assets/constants'
export default {
  name: 'SceneUnaudited',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // list
      unauditedList: [],
      totalCnt: 0,
      currentPage: 1,
      pageSize: 20,
      status: constants.SCENE_STATUS
    }
  },
  methods: {
    getData () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/reseller/?status=UNAUDITED&page_num=' + this.currentPage + '&page_size=' + this.pageSize)
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
      this.getData()
    },
    doAudit (uuid, action, reason) {
      const that = this
      let form = {}
      if (reason) {
        form = {
          action: action,
          reason: reason
        }
      } else {
        form = {
          action: action
        }
      }
      this.$axios.post('/insider/reseller/' + uuid + '/audit/', form).then(() => {
        that.currentPage = 1
        that.getData()
      })
    },
    auditNo (uuid) {
      const that = this
      this.$prompt('不通过原因', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        that.doAudit(uuid, 0, value)
      }).catch(() => {})
    },
    auditYes (uuid) {
      const that = this
      this.$confirm('确认要审核通过吗?', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.doAudit(uuid, 1, null)
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
</style>
