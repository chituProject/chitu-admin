<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button class="search-button" :type="query_status === '' ? 'primary' : 'normal'" size="medium" @click="handleSelect('')">全部</el-button>
      <el-button class="search-button" :type="query_status === 'VERIFY' ? 'primary' : 'normal'" size="medium" @click="handleSelect('VERIFY')">审核中<span v-if="counts.VERIFY > 0">（{{counts.VERIFY}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'ON' ? 'primary' : 'normal'" size="medium" @click="handleSelect('ON')">已发布<span v-if="counts.ON > 0">（{{counts.ON}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'OFF' ? 'primary' : 'normal'" size="medium" @click="handleSelect('OFF')">暂停中<span v-if="counts.OFF > 0">（{{counts.OFF}}）</span></el-button>
      <el-button class="search-button" :type="query_status === 'FINISH' ? 'primary' : 'normal'" size="medium" @click="handleSelect('FINISH')">已结束<span v-if="counts.FINISH > 0">（{{counts.FINISH}}）</span></el-button>
      <router-link to="/gift/add" v-can:edit="'Gift'"><el-button class="search-button" size="medium" type="primary" icon="el-icon-plus">新增</el-button></router-link>
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
            <template slot-scope="scope"><img v-if="scope.row.gift_goods" v-bind:src="scope.row.gift_goods.sku_pic" class="info-img"/></template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="锦礼名称">
          </el-table-column>
          <el-table-column
            align="center"
            label="锦礼类型">
            <template slot-scope="scope">{{scope.row.gift_type === 'PACKAGE' ? '锦礼礼包' : '锦礼商品'}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="所属商家">
            <template slot-scope="scope" v-if="scope.row.gift_goods">{{ scope.row.gift_goods.merchant.name }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="锦礼价值">
            <template slot-scope="scope">{{ formatPrice(scope.row.gift_value) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="开奖方式">
            <template slot-scope="scope">{{ scope.row.lottery_type === 'TIME' ? '定时开奖' : '满员开奖' }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="开奖人数/时间">
            <template slot-scope="scope">{{ scope.row.lottery_type === 'TIME' ? scope.row.lottery_valid_period + '分钟' : scope.row.participant_num + '人' }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="gift_num"
            label="奖品数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="remain_gift_num"
            label="剩余数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">{{ status[scope.row.shelf_status] }}</template>
          </el-table-column>
          <!--<el-table-column-->
          <!--align="center"-->
          <!--prop=""-->
          <!--label="曝光量">-->
          <!--</el-table-column>-->
          <el-table-column
            align="center"
            v-if="$can('edit', 'Gift')"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text"
                         v-if="scope.row.shelf_status === 'ON'"
                         @click.stop="doGroundGift(scope.row, 0)">暂停</el-button>
              <el-button type="text"
                         v-else-if="scope.row.shelf_status === 'OFF'"
                         @click.stop="doGroundGift(scope.row, 1)">重新开启</el-button>
              <el-button type="text"
                         v-else-if="scope.row.shelf_status === 'PRE_ON'"
                         @click.stop="groundGift(scope.row, 1)">发布</el-button>
              <el-button type="text"
                         v-else-if="scope.row.shelf_status === 'VERIFY'"
                         @click.stop="verifyGift(scope.row)">审核</el-button>
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
import constants from '@/assets/constants'

export default {
  name: 'GiftList',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
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
      status: constants.GIFT_STATUS
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
      this.$axios.get('/gift_insider/gift/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&shelf_status=' + this.query_status)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
      this.$axios.get('/gift_insider/gift/count/')
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
      // this.$router.push('/gift/detail/' + row.id)
      window.open(window.location.origin + '/#/gift/detail/' + row.id)
    },
    verifyGift (item) {
      this.$router.push('/gift/detail/' + item.id + '?verify=true')
    },
    groundGift (item, action) {
      if (action) {
        this.$confirm('一旦发布就无法修改，确定要发布吗？', '发布锦礼', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.doGroundGift(item, action)
        })
      }
    },
    doGroundGift (item, action) {
      let that = this
      this.loading = true
      this.$axios.post('/gift_insider/gift/' + item.id + '/ground/', {
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
