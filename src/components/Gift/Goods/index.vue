<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button class="search-button" :type="query_status === '' ? 'primary' : 'normal'" size="medium" @click="handleSelect('')">全部</el-button>
      <el-button class="search-button" :type="query_status === 'ON' ? 'primary' : 'normal'" size="medium" @click="handleSelect('ON')">上架<span v-if="counts.ON > 0">（{{counts.ON}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'OFF' ? 'primary' : 'normal'" size="medium" @click="handleSelect('OFF')">下架<span v-if="counts.OFF > 0">（{{counts.OFF}}）</span></el-button>
      <router-link to="/gift/goods/create" v-can:edit="'Gift'"><el-button class="search-button" size="medium" type="primary" icon="el-icon-plus">新增</el-button></router-link>
    </div>
    <div class="card-outer">
      <div v-if="list && list.length > 0" class="card-container">
        <el-table
          ref="table"
          stripe
          :data="list"
          @row-click="onRowClick"
          :row-style="{ cursor: 'pointer' }"
          style="width: 100%">
          <el-table-column
            align="center"
            width="60">
            <template slot-scope="scope"><img v-bind:src="scope.row.sku_pic" class="info-img"/></template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="specification"
            label="SKU型号">
          </el-table-column>
          <el-table-column
            align="center"
            label="所属商家">
            <template slot-scope="scope">{{ scope.row.merchant ? scope.row.merchant.name : '' }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="商品标题">
          </el-table-column>
          <el-table-column
            align="center"
            label="售价">
            <template slot-scope="scope">{{ formatPrice(scope.row.price) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="上架时间">
            <template slot-scope="scope">{{ formatTime(scope.row.on_shelf_time) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">{{ status[scope.row.shelf_status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            v-if="$can('edit', 'Gift')"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text"
                         v-if="scope.row.shelf_status === 'ON'"
                         @click.stop="groundGood(scope.row, 0)">下架</el-button>
              <el-button type="text"
                         v-else-if="scope.row.shelf_status === 'OFF'"
                         @click.stop="groundGood(scope.row, 1)">上架</el-button>
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
import EmptyPage from '@/components/EmptyPage'
import { formatTime, formatPrice } from '@/assets/util'

export default {
  name: 'GiftGoods',
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
          label: 'SPU',
          value: 'id'
        }
      ],
      // list
      list: [],
      counts: {},
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      status: {
        ON: '上架',
        OFF: '下架'
      }
    }
  },
  methods: {
    formatPrice,
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
    handleSelect (status) {
      this.query_status = status
      this.getData()
    },
    query () {
      let that = this
      that.loading = true
      this.$axios.get('/gift_insider/gift_goods/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&shelf_status=' + this.query_status +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
      this.$axios.get('/gift_insider/gift_goods/count/')
        .then(res => {
          console.log(res.data)
          that.counts = res.data
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    onRowClick (row, event, column) {
      // this.$router.push('/gift/goods/detail/' + row.id)
      window.open(window.location.origin + '/#/gift/goods/detail/' + row.id)
    },
    groundGood (item, action) {
      let that = this
      this.loading = true
      this.$axios.post('/gift_insider/gift_goods/' + item.id + '/ground/', {
        action: action
      })
        .then(() => {
          that.getData()
          that.$message.success((action ? '上架' : '下架') + '成功')
        })
        .catch(error => {
          console.log(error)
          that.$message.error((action ? '上架' : '下架') + '失败')
        })
        .finally(() => {
          that.loading = false
        })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
  .info-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 20px;
  }
  .demo-table-expand {
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-columns: repeat( auto-fill, minmax(300px, 1fr) );
    grid-column-gap: 10px;
  }
  @media (min-width: 1500px) {
    .demo-table-expand {
      grid-template-columns: repeat( 3, 1fr );
    }
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .card:hover {
    cursor: pointer;
  }
</style>
