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
      <div v-if="manager_funds.length > 0 || index_funds.length > 0" class="card-container">
        <el-table
          :data="manager_funds"
          border
          class="table"
          style="width: 100%"
        >
          <el-table-column
            prop="manager"
            label="基金经理"
            width="150">
          </el-table-column>
          <el-table-column
            prop="name"
            label="基金名称"
            width="240">
          </el-table-column>
          <el-table-column
            prop="yearly_profit"
            label="近一年收益"
            width="100">
          </el-table-column>
          <el-table-column
            prop="monthly_profit"
            label="最新月回报"
            width="100">
          </el-table-column>
          <el-table-column
            prop="sharp_rate"
            label="夏普比率"
            width="100">
          </el-table-column>
          <el-table-column
            label="可见性"
            width="70">
            <template slot-scope="scope">
              {{visible_status[scope.row.visible]}}
            </template>
          </el-table-column>
          <el-table-column
            label="修改可见性"
            width="100">
            <template slot-scope="scope">
              <switch-button v-model="scope.row.visibility" @click="changeVisibility(scope.row)"></switch-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click.stop="openDetail(scope.row.id)" type="primary" size="large">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="index_funds"
          border
          class="table"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="指数名称"
            width="390">
          </el-table-column>
          <el-table-column
            prop="yearly_profit"
            label="近一年收益"
            width="100">
          </el-table-column>
          <el-table-column
            prop="monthly_profit"
            label="最新月回报"
            width="100">
          </el-table-column>
          <el-table-column
            prop="sharp_rate"
            label="夏普比率"
            width="100">
          </el-table-column>
          <el-table-column
            label="可见性"
            width="70">
            <template slot-scope="scope">
              {{visible_status[scope.row.visible]}}
            </template>
          </el-table-column>
          <el-table-column
            label="修改可见性"
            width="100">
            <template slot-scope="scope">
              <switch-button v-model="scope.row.visibility" @click="changeVisibility(scope.row)"></switch-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="openDetail(scope.row.id)" type="primary" size="large">查看</el-button>
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
import SwitchButton from '@/components/SwitchButton'

export default {
  name: 'Goods',
  components: {
    EmptyPage,
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
      visible_status: {
        TRUE: '可见',
        FALSE: '不可见'
      },
      // list
      manager_funds: [],
      index_funds: [],
      pageSize: 20,
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
      this.loading = true
      this.$axios.get('/insider/fund_archive/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
          this.totalCnt = res.data.count
          for (let i = 0; i < res.data.results.length; ++i) {
            if (res.data.results[i].visible === 'TRUE') {
              res.data.results[i].visibility = true
            } else {
              res.data.results[i].visibility = false
            }
            if (res.data.results[i].type === 'MANAGER') {
              this.manager_funds.push(res.data.results[i])
            } else {
              this.index_funds.push(res.data.results[i])
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    openDetail (id) {
      this.$router.push('/goods/detail/' + id)
      // window.open(window.location.origin + '/#/goods/detail/' + id)
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
  .table:hover {
    cursor: pointer;
  }

</style>
