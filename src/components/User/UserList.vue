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
    </div>
    <div class="card-outer">
      <div v-if="userList && userList.length > 0" class="card-container">
        <el-table
          ref="table"
          tooltip-effect="dark"
          stripe
          :data="userList"
          @row-click="onRowClick"
          :row-style="{ cursor: 'pointer' }"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="wechat_nickname"
            label="微信昵称"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            prop="id"
            label="openid"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            label="首次登录时间"
            width="150">
            <template slot-scope="scope">{{ formatTime(scope.row.auth_user.date_joined) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="当前权限">
            <template slot-scope="scope">{{ current_status[scope.row.auth_user.current_auth]
            }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <el-button @click="changeStatus(scope.row.auth_user.wechat_nickname)" size="medium">{{ change_status[1 - scope.row.auth_user.current_auth]
            }}</el-button>
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
  </div>
</template>

<script>
import { formatTime } from '@/assets/util'
import EmptyPage from '../EmptyPage'

export default {
  name: 'UserList',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // userList
      userList: [],
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      // search
      input: '',
      query_key: 'wechat_nickname__contains',
      query_value: '',
      options: [
        {
          label: '微信昵称',
          value: 'wechat_nickname__contains'
        }
      ],
      // status
      status_index: 0,
      current_status: {
        AUTHORIZE: '已授权',
        NON_AUTH: '未授权'
      },
      change_status: {
        AUTHORIZE: '授权',
        NON_AUTH: '关闭授权'
      }
    }
  },
  methods: {
    formatTime,
    getData () {
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
    },
    querySearch () {
      this.currentPage = 1
      this.query_value = this.input
      this.query()
    },
    query () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/customer_user/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.userList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    onRowClick (row, event, column) {
      // this.$router.push('/orders/' + row.id)
      window.open(window.location.origin + '/#/orders/' + row.id)
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    changeStatus (nickname) {
      var r = confirm('是否要打开/关闭用户' + nickname + '的使用权限？')
      if (r) {
        this.status_index = 1 - this.status_index // TODO: bind to row data
      }
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
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(300px, 1fr) );
    grid-column-gap: 10px;
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .card:hover {
    cursor: pointer;
  }

</style>
