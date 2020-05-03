<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button class="search-button" :type="query_status === '' ? 'primary' : 'normal'" size="medium" @click="handleSelect('')">全部</el-button>
      <el-button class="search-button" :type="query_status === 'PRE' ? 'primary' : 'normal'" size="medium" @click="handleSelect('PRE')">待开奖<span v-if="counts.PRE > 0">（{{counts.PRE}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'FINISH' ? 'primary' : 'normal'" size="medium" @click="handleSelect('FINISH')">已开奖<span v-if="counts.FINISH > 0">（{{counts.FINISH}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'SHIPPING' ? 'primary' : 'normal'" size="medium" @click="handleSelect('SHIPPING')">已派奖<span v-if="counts.SHIPPING > 0">（{{counts.SHIPPING}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'EXPIRE' ? 'primary' : 'normal'" size="medium" @click="handleSelect('EXPIRE')">已过期<span v-if="counts.EXPIRE > 0">（{{counts.EXPIRE}}）</span></el-button>
    </div>
    <div class="filter-container2">
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
      <div v-if="list && list.length > 0" class="card-container">
        <el-table
          stripe
          ref="table"
          :data="list"
          @row-click="onRowClick"
          :row-style="{ cursor: 'pointer' }"
          style="width: 100%">
          <el-table-column
            align="center"
            label="抽奖类型">
            <template slot-scope="scope">{{ scope.row.gift_type === "SINGLE" ? '锦礼商品' : '锦礼礼包' }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">{{ status[scope.row.status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="奖品名称">
            <template slot-scope="scope">{{ scope.row.gift.title }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">{{ status[scope.row.status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="开奖人数"
          >
            <template slot-scope="scope">{{  scope.row.lottery_type === 'PEOPLE' ? scope.row.participant_num : '不限' }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="joined_num"
            label="当前参与人数">
          </el-table-column>
          <el-table-column
            align="center"
            label="发起时间">
            <template slot-scope="scope">{{ formatTime(scope.row.start_time) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="发起人">
            <template slot-scope="scope">{{ scope.row.sponsor.wechat_nickname }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="开奖时间">
            <template slot-scope="scope">{{scope.row.lottery_type === "TIME" ? formatTimeNew(scope.row.start_time,scope.row.valid_period):formatTime(scope.row.end_at)}}</template>
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
import { formatTime, formatTimeNew } from '@/assets/util'
import constants from '@/assets/constants'

export default {
  name: 'GiftLottery',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_key: 'id',
      query_value: '',
      is_search: false,
      query_status: '',
      options: [
        {
          label: 'ID',
          value: 'id'
        },
        {
          label: '奖品名称',
          value: 'gift__title'
        }
      ],
      // list
      list: [],
      counts: {},
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      status: constants.LOTTERY_STATUS
    }
  },
  methods: {
    formatTime,
    formatTimeNew,
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
    handleSelect (status) {
      this.query_status = status
      this.getData()
    },
    query () {
      let that = this
      that.loading = true
      let qstatus = '&status=' + this.query_status
      if (this.query_status === 'SHIPPING') {
        qstatus = '&winners__status=' + this.query_status
      }
      this.$axios.get('/gift_insider/lottery/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        qstatus +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
      this.$axios.get('/gift_insider/lottery/count/')
        .then(res => {
          console.log('COUNTS', res.data)
          that.counts = res.data
          that.$axios.get('/gift_insider/lottery/?winners__status=SHIPPING')
            .then(res2 => {
              console.log(res2.data)
              that.$set(that.counts, 'SHIPPING', res2.data.count)
            })
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    onRowClick (row, event, column) {
      // this.$router.push('/gift/lottery/' + row.id)
      window.open(window.location.origin + '/#/gift/lottery/' + row.id)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
  .filter-container2 {
    width: 100%;
    position: absolute;
    height: 60px;
    top: 64px;
    left: 0;
    right: 0;
    background-color: #f8f6f6;
  }
  .card-outer {
    top: 124px;
  }
  .demo-table-expand {
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
    grid-column-gap: 10px;
  }
  @media (min-width: 1350px) {
    .demo-table-expand {
      grid-template-columns: repeat( 3, 1fr );
    }
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
</style>
