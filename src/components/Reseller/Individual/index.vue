<template>
  <div class="main-col" v-loading="loading">
    <overview></overview>
    <div v-if="sceneList && sceneList.length > 0" class="card-container">
      <div class="search-bar">
        <el-button type="primary" icon="el-icon-search" class="search-button right" size="medium" @click.stop="querySearch">搜索</el-button>
        <el-input
          class="search right"
          v-model="input"
          placeholder="搜索内容"
          clearable>
        </el-input>
      </div>
      <el-table
        ref="table"
        stripe
        :data="sceneList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="id"
          label="用户ID">
        </el-table-column>
        <el-table-column
          align="center"
          label="微信头像昵称"
          width="150">
          <template slot-scope="scope">
            <img :src="scope.row.customer_user.wechat_avatar_url" class="avatar">
            <span>{{scope.row.customer_user.wechat_nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="wechat_gender"
          label="类型">
          <template slot-scope="scope">{{ getType(scope.row.status) }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="可提现返利">
          <template slot-scope="scope">{{ scope.row.withdrawable_rebate | formatPriceFixed }}元</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="待入账">
          <template slot-scope="scope">{{ scope.row.unwithdrawable_rebate | formatPriceFixed }}元</template>
        </el-table-column>
        <el-table-column
          align="center"
          width="240"
          label="未激活粉丝">
          <template slot-scope="scope">
            <span>{{scope.row.inactive_fans_count}}人</span>
            <img v-for="i in [0, 1, 2, 3]" :key="i" v-if="scope.row.inactive_fans[i]" :src="scope.row.inactive_fans[i].wechat_avatar_url" class="avatar">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="240"
          label="激活的粉丝">
          <template slot-scope="scope">
            <span>{{scope.row.active_fans_count}}人</span>
            <img v-for="i in [0, 1, 2, 3]" :key="i" v-if="scope.row.active_fans[i]" :src="scope.row.active_fans[i].wechat_avatar_url" class="avatar">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.inactive_fans_count + scope.row.active_fans_count" @click.stop="openDetail(scope.row)">查看更多</el-button>
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
</template>

<script>
import constants from '@/assets/constants'
import EmptyPage from '@/components/EmptyPage'
import Overview from '@/components/Reseller/overview'
import { formatTime } from '@/assets/util'

export default {
  name: 'ResellerIndividualList',
  components: {
    EmptyPage,
    Overview
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_key: 'customer_user__wechat_nickname',
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
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0
    }
  },
  methods: {
    formatTime,
    getType (type) {
      return constants.RESELLER_TYPE[type]
    },
    querySearch () {
      this.currentPage = 1
      this.query_value = this.input
      this.query()
    },
    query () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/reseller_person/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
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
      // console.log('openDetail', item)
      window.open(window.location.origin + '/#/reseller/individual/' + item.id)
    }
  },
  mounted () {
    this.input = ''
    this.query_value = ''
    this.currentPage = 1
    this.query()
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
  .search-bar {
    width: 100%;
    height: 60px;
    padding: 0 20px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    margin: 4px;
  }
</style>
