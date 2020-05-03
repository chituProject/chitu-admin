<!-- 抢购页面 -->
<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button class="search-button" :type="shelf_status === '' ? 'primary' : 'normal'" size="medium" @click="handleSelect('')">全部</el-button>
      <el-button v-for="(statusLabel, status) of statuses" :key="status" class="search-button"
                 :type="shelf_status === status ? 'primary' : 'normal'" size="medium" @click="handleSelect(status)">
        {{ statusLabel }}
      </el-button>
      <router-link to="/platform/rush/create" v-can:edit="'Goods'"><el-button class="search-button" size="medium" type="primary" icon="el-icon-plus">新增</el-button></router-link>
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
            label="抢购商品">
            <template slot-scope="scope">
              {{ scope.row.goods && scope.row.goods.title }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="所属主页">
            <template slot-scope="scope">{{ scope.row.time.homepage }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="抢购时间段">
            <template slot-scope="scope">{{ scope.row.time.start_at }} - {{ scope.row.time.end_at }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rush_price"
            label="抢购价格">
            <template slot-scope="scope">{{ scope.row.rush_price | formatPriceFixed }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rush_number"
            label="抢购数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="rush_offpay_limit"
            label="赠送免单金">
            <template slot-scope="scope">{{ scope.row.rush_offpay_limit | formatPriceFixed }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="抢购状态">
            <template slot-scope="scope">{{ statuses[scope.row.status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button :disabled="!$can('edit', 'Goods')" type="text" v-if="scope.row.status !== 'CANCEL'" @click.stop="changeStatus(scope.row, 0)">下架</el-button>
              <el-button :disabled="!$can('edit', 'Goods')" type="text" v-else @click.stop="changeStatus(scope.row, 1)">上架</el-button>
              <el-button :disabled="!$can('edit', 'Goods')" type="text" @click.stop="deleteItem(scope.row)">删除</el-button>
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
import { formatTime } from '@/assets/util'
import constants from '@/assets/constants'

export default {
  name: 'GiftList',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      list: [],
      counts: {},
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      shelf_status: '',
      statuses: constants.DISCOUNT_STATUS
    }
  },
  methods: {
    formatTime,
    query () {
      this.loading = true
      this.$axios.get('/insider/goods_rush/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&status=' + this.shelf_status)
        .then(res => {
          this.totalCnt = res.data.count
          this.list = res.data.results.sort((a, b) => {
            // 根据主页排
            if (a.time.homepage !== b.time.homepage) return a.time.homepage - b.time.homepage
            // 根据时间段排
            const [hhA = 0, mmA = 0] = a.time.start_at.split(':').map(item => parseInt(item))
            const [hhB = 0, mmB = 0] = b.time.start_at.split(':').map(item => parseInt(item))
            if (hhA !== hhB) return hhA - hhB
            if (mmA !== mmB) return mmA - mmB
            // 根据抢购商品ID排
            return a.id - b.id
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    handleSelect (query) {
      this.shelf_status = query
      this.query()
    },
    async deleteItem (item) {
      this.loading = true
      try {
        await this.$axios.delete(`/insider/goods_rush/${item.id}`)
      } catch (e) {
      }
      this.loading = false
      this.query()
    },
    // 0: 下架， 1: 上架
    async changeStatus (item, action) {
      this.loading = true
      try {
        await this.$axios.post(`/insider/goods_rush/${item.id}/ground/`, {
          action
        })
      } catch (e) {
      }
      this.loading = false
      this.query()
    },
    onRowClick (row, event, column) {
      this.$router.push({name: 'rushDetail', params: { id: row.id }})
    }
  },
  mounted () {
    this.query()
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
    grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
    grid-column-gap: 10px;
  }
  @media (min-width: 1750px) {
    .demo-table-expand {
      grid-template-columns: repeat( 5, 1fr );
    }
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .demo-operation {
    text-align: center;
    vertical-align: center;
    margin: 0 10px;
  }
  .demo-operation .el-button {
    margin: 6px 0;
    max-width: 100px;
    width: 100%;
  }
  .card {
    cursor: pointer;
  }
</style>
