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
          :row-style="{ cursor: 'pointer' }"
          style="width: 100%">
          <el-table-column
            align="center"
            label="用户头像"
            width="80">
            <template slot-scope="scope">
              <img style="width:100%;height:100%;" :src="scope.row.wechat_avatar_url">
            </template>
          </el-table-column>
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
            label="当前权限"
            width="70">
            <template slot-scope="scope">{{current_status[scope.row.authorize_type]}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.authorize_type === 'OFF'" type="primary" @click="changeStatus(scope.row)" size="medium">{{action_name[scope.row.authorize_type]}}</el-button>
              <el-button v-else @click="changeStatus(scope.row)" size="medium">{{action_name[scope.row.authorize_type]}}</el-button>
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
      current_status: {
        ON: '已授权',
        OFF: '未授权'
      },
      action_name: {
        ON: '取消授权',
        OFF: '授权'
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
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    changeStatus (data) {
      const action = data.authorize_type === 'ON' ? '关闭' : '打开'
      this.$confirm(`是否要${action}用户` + data.wechat_nickname + '的使用权限？', '重要操作', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用后台接口
        const authorize_type = data.authorize_type === 'ON' ? 'OFF' : 'ON'
        this.$axios.post(`/insider/customer_user/${data.id}/user_authorize_type/`,{ authorize_type: authorize_type })
        .then(()=>{
          data.authorize_type = authorize_type
        })
        this.$message({
          type: 'success',
          message: '更改成功'
        })
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
</style>
