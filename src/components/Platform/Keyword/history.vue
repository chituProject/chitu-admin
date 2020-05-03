<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <router-link to="/platform/keyword"><el-button type="default" class="search-button" size="medium">返回</el-button></router-link>
      <div class="">
        <el-date-picker
          class="search"
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-input
          class="search"
          v-model="searchInput"
          placeholder="请输入关键词"
          clearable>
        </el-input>
        <el-button type="primary" icon="el-icon-search" class="search-button" size="medium" @click.stop="getStatistics">搜索</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div v-if="showList && showList.length > 0" class="card-container">
        <el-table
          ref="table"
          stripe
          :data="showList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="keyword"
            label="关键词">
          </el-table-column>
          <el-table-column
            align="center"
            prop="count"
            sortable
            label="关键词搜索总次数">
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="pageSize < keywordList.length"
          class="pagination"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="keywordList.length"
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <empty-page v-else></empty-page>
    </div>
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import { dateFormat } from '@/assets/util'

export default {
  name: 'history',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      searchInput: '',
      timeRange: [],
      showList: [],
      keywordList: [],
      pageSize: 50,
      currentPage: 1
    }
  },
  methods: {
    getStatistics () {
      if (this.timeRange.length < 2) {
        this.$message.error('请选择时间范围')
        return
      }
      let that = this
      this.$axios.post('/insider/statistics/', {
        instances: [
          {
            func: 'search_history',
            params: {
              created_at__gte: dateFormat(this.timeRange[0], 'yyyy-MM-dd hh:mm:ss'),
              created_at__lte: dateFormat(this.timeRange[1], 'yyyy-MM-dd hh:mm:ss'),
              keyword__contains: this.searchInput === '' ? null : this.searchInput
            }
          }
        ]
      })
        .then(res => {
          console.log('search_history', res.data)
          if (res.data[0].code === 200) {
            that.keywordList = res.data[0].value.map(item => {
              return {
                keyword: item[0],
                count: item[1]
              }
            })
            that.handleCurrentChange(1)
          } else {
            that.$message.error('查询出错，错误码：' + res.data[0].code)
          }
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.showList = this.keywordList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  mounted () {
    let date = new Date()
    this.timeRange.push(new Date(date.getTime() - 1000 * 60 * 60 * 24 * 7))
    this.timeRange.push(date)
    this.getStatistics()
  }
}
</script>

<style scoped>
  .right {
    float: right;
    margin-right: 30px;
    overflow: hidden;
  }
</style>
