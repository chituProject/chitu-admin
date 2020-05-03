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
          stripe
          :data="userList"
          tooltip-effect="dark"
          :row-style="{ cursor: 'pointer' }"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="id"
            label="流水ID">
          </el-table-column>
          <el-table-column
            align="left"
            label="发起用户">
            <template slot-scope="scope">
              <img :src="scope.row.receiver.wechat_avatar_url" style="width: 50px; height: 50px">
              <span class="wechat_nickname">{{scope.row.receiver.wechat_nickname}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="助力免单金">
            <template slot-scope="scope">{{ formatPrice(scope.row.offpay_amount) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="助力时间">
            <template slot-scope="scope">{{ formatTime(scope.row.created_at) }}</template>
          </el-table-column>
          <el-table-column
            align="left"
            label="助力用户">
            <template slot-scope="scope">
              <img :src="scope.row.helper.wechat_avatar_url" style="width: 50px; height: 50px">
              <span class="wechat_nickname">{{scope.row.helper.wechat_nickname}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="奖励红包">
            <template slot-scope="scope">{{ formatPrice(scope.row.helper_offpay_amount) }}元</template>
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
import EmptyPage from '@/components/EmptyPage'
import { formatTime, formatPrice } from '@/assets/util'

export default {
  name: 'UserList',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_key: 'wechat_nickname',
      query_value: '',
      is_search: false,
      options: [
        {
          label: '发起用户',
          value: 'wechat_nickname'
        }
      ],
      // list
      userList: [],
      pageSize: 20,
      currentPage: 1,
      totalCnt: 0
    }
  },
  methods: {
    formatTime,
    formatPrice,
    getData () {
      this.is_search = false
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
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
      this.$axios.get('/insider/assistance/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize)
        .then(res => {
          console.log('list', res.data)
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
    onRowClick (row, event, column) {
      // this.$router.push('/user/detail/' + row.id)
      window.open(window.location.origin + '/#/user/detail/' + row.id)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
.wechat_nickname {
  margin-left: 10px;
}
</style>
