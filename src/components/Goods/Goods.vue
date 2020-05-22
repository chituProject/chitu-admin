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
        placeholder="单行输入"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" class="search-button" size="medium" @click.stop="querySearch">搜索</el-button>
      <router-link v-can:edit="'Goods'" to="/goods/add"><el-button class="search-button" size="medium" type="primary" icon="el-icon-plus">新增基金</el-button></router-link>
    </div>
    <div class="card-outer">
      <div v-if="list && list.length > 0" class="card-container">
        <el-card
          v-for="(item, index) in list"
          :key="index"
          shadow="hover"
          class="card">
          <div @click="openDetail(item.id)">
            <div style="display: flex; flex-direction: row;align-items: center">
              <el-form class="demo-table-expand" label-width="80px" label-position="left">
                <el-form-item label="基金经理">
                  <span>{{item.manager.name}}</span>
                </el-form-item>
                <el-form-item label="基金名">
                  <span>{{item.name}}</span>
                </el-form-item>
                <el-form-item label="近一年收益">
                  <span>{{item.annual_award==null? "" : item.annual_award}}</span>
                </el-form-item>
                <el-form-item label="最新月回报">
                  <span>{{tem.month_award==null? "" : item.month_award}}</span>
                </el-form-item>
                <el-form-item label="夏普比率">
                  <span>{{item.sharp_ratio==null? "" : item.sharp_ratio }}</span>
                </el-form-item>
                <el-form-item label="用户是否可见">
                  <switch-button v-model="item.visibility_status" @click="changeVisibility(item)"></switch-button>
                </el-form-item>
              </el-form>
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
import Yfooter from '@/components/Footer'
import { formatTime } from '@/assets/util'
import EmptyPage from '../EmptyPage'
import SwitchButton from '@/components/SwitchButton'

export default {
  name: 'Goods',
  components: {
    EmptyPage,
    Yfooter,
    SwitchButton
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_key: '全部',
      query_value: 'all',
      is_search: false,
      options: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '赤兔访谈',
          value: 'chitu__interview'
        },
        {
          label: '百亿私募',
          value: 'tenbillion__private__placement'
        },
        {
          label: '量化',
          value: 'quantization'
        }
      ],
      // list
      list: [],
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0
    }
  },
  methods: {
    formatTime,
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
      that.loading = true
      this.$axios.get('/insider/goods/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
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
    openDetail (id) {
      // this.$router.push('/goods/detail/' + id)
      window.open(window.location.origin + '/#/goods/detail/' + id)
    },
    changeVisibility (item) {
      let that = this
      let newStatus = !item.visibility_status
      that.loading = true
      this.$axios.post('/insider/goods/' + item.id + '/ground/', {
        visibility_status: newStatus
      })
        .then(() => {
          that.getData()
        })
        .catch(error => {
          console.log(error)
          that.loading = false
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
