<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button class="search-button" :type="query_shelf_status === '' ? 'primary' : 'normal'" size="medium" @click="handleSelect('')">全部</el-button>
      <el-button class="search-button" :type="query_shelf_status === 'VERIFY' ? 'primary' : 'normal'" size="medium" @click="handleSelect('VERIFY')">审核中<span v-if="counts.VERIFY > 0">（{{counts.VERIFY}}）</span></el-button>
      <el-button class="search-button" :type="query_shelf_status === 'PRE_ON' ? 'primary' : 'normal'" size="medium" @click="handleSelect('PRE_ON')">待上架<span v-if="counts.PRE_ON > 0">（{{counts.PRE_ON}}）</span></el-button>
      <el-button class="search-button" :type="query_shelf_status === 'ON' ? 'primary' : 'normal'" size="medium" @click="handleSelect('ON')">上架<span v-if="counts.ON > 0">（{{counts.ON}}）</span></el-button>
      <el-button class="search-button" :type="query_shelf_status === 'OFF' ? 'primary' : 'normal'" size="medium" @click="handleSelect('OFF')">下架<span v-if="counts.OFF > 0">（{{counts.OFF}}）</span></el-button>
      <router-link v-can:edit="'Goods'" to="/goods/add"><el-button class="search-button" size="medium" type="primary" icon="el-icon-plus">新增商品</el-button></router-link>
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
        <el-card
          v-for="(item, index) in list"
          :key="index"
          shadow="hover"
          class="card">
          <div @click="openDetail(item.id)">
            <div style="display: flex; flex-direction: row;align-items: center">
              <img v-bind:src="item.main_picture" class="info-img"/>
              <el-form class="demo-table-expand" label-width="80px" label-position="left">
                <el-form-item label="SPU">
                  <span>{{item.id}}</span>
                </el-form-item>
                <el-form-item label="供应商">
                  <span>{{item.merchant==null?"":item.merchant.name}}</span>
                </el-form-item>
                <el-form-item label="品牌">
                  <span>{{item.brand==null?"":item.brand.name}}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>{{status[item.shelf_status]}}</span>
                </el-form-item>
                <el-form-item label="默认型号">
                  <span>{{item.default_sku ? item.default_sku.specification.join(' '): "未创建默认SKU"}}</span>
                </el-form-item>
                <el-form-item label="商品标题">
                  <span>{{item.title}}</span>
                </el-form-item>
                <el-form-item label="商品类型">
                  <span>{{ goodsTypeName[item.goods_type] }}</span>
                </el-form-item>
                <el-form-item label="促销价">
                  <span>{{item.default_sku ? (item.default_sku.price / 100).toFixed(2) : "未创建默认SKU"}}</span>
                </el-form-item>
                <el-form-item label="上架时间">
                  <span>{{formatTime(item.on_shelf_time)}}</span>
                </el-form-item>
              </el-form>
              <div class="demo-operation" v-can:edit="'Goods'">
                <el-button class="blue_button"
                           v-if="item.shelf_status === 'ON'"
                           @click.stop="groundGood(item, 0)">下架</el-button>
                <div v-else-if="item.shelf_status === 'OFF'">
                  <el-button class="blue_button"
                             @click.stop="deleteGood(item)">删除</el-button>
                  <br/>
                  <el-button class="blue_button"
                             @click.stop="groundGood(item, 1)">重新上架</el-button>
                </div>
                <el-button class="blue_button"
                           v-else-if="item.shelf_status === 'VERIFY'"
                           @click.stop="verifyGood(item)">审核</el-button>
                <el-button class="blue_button"
                           v-else
                           @click.stop="groundGood(item, 1)">上架</el-button>
                           <!--<el-button-->
                           <!--type="warning"-->
                           <!--@click.stop="verifyGood(item)">审核</el-button>-->
              </div>
            </div>
            <div v-for="(verifyRecord, j) in item.verify_record" :key="j" v-if="verifyRecord.action === 0" class="reject-reason">
              {{ formatTime(verifyRecord.created_at )}}不通过：{{ verifyRecord.reason }}
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
import constants from '@/assets/constants'
import { formatTime } from '@/assets/util'
import EmptyPage from '../EmptyPage'

export default {
  name: 'Goods',
  components: {
    EmptyPage,
    Yfooter
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_key: 'id',
      query_value: '',
      is_search: false,
      query_shelf_status: '',
      options: [
        {
          label: 'SPU',
          value: 'id'
        },
        {
          label: '商家名称',
          value: 'merchant__name__contains'
        },
        {
          label: '商品标题',
          value: 'title__contains'
        },
        {
          label: '品牌名',
          value: 'brand__name__contains'
        }
      ],
      // list
      list: [],
      counts: {},
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      goodsTypeName: constants.GOODS_TYPE,
      status: constants.SHELF_STATUS
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
    handleSelect (shelfStatus) {
      this.query_shelf_status = shelfStatus
      this.getData()
    },
    query () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/goods/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&shelf_status=' + this.query_shelf_status +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.list = res.data.results
          for (let i = 0; i < that.list.length; i++) {
            if (that.list[i].default_sku) {
              if (!that.list[i].default_sku.specification.startsWith('[')) {
                // sku 型号旧数据处理
                that.list[i].default_sku.specification = [that.list[i].default_sku.specification]
              } else {
                // sku 型号新数据处理
                that.list[i].default_sku.specification = JSON.parse(that.list[i].default_sku.specification)
              }
            }
          }
        })
        .finally(() => {
          that.loading = false
        })
      this.$axios.get('/insider/goods/count/')
        .then(res => {
          console.log(res.data)
          that.counts = res.data
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
    groundGood (item, action) {
      let that = this
      that.loading = true
      this.$axios.post('/insider/goods/' + item.id + '/ground/', {
        action: action
      })
        .then(() => {
          that.$message.success((action ? '上架' : '下架') + '成功')
          that.getData()
        })
        .catch(error => {
          console.log(error)
          that.$message.error((action ? '上架' : '下架') + '失败')
          that.loading = false
        })
    },
    verifyGood (item) {
      this.$router.push('/goods/detail/' + item.id + '/verify')
    },
    deleteGood (item) {
      console.log('deleteGood', item)
      let that = this
      that.loading = true
      this.$axios.delete('/insider/goods/' + item.id + '/')
        .then(res => {
          console.log(res.data)
          that.$message.success('删除成功')
          that.getData()
        })
        .catch(error => {
          console.log(error)
          that.$message.error('删除失败')
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
  .info-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 20px;
  }
  .demo-table-expand {
    flex: 1;
    font-size: 0;
    text-align: left;
    display: grid;
    grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
    grid-column-gap: 10px;
  }
  @media (min-width: 1350px) {
    .demo-table-expand {
      grid-template-columns: repeat( 3, 1fr );
    }
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .demo-operation {
    text-align: center;
    vertical-align: center;
  }
  .demo-operation .el-button {
    margin: 6px 0;
    max-width: 100px;
    width: 100%;
  }
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
  .card:hover {
    cursor: pointer;
  }
  .reject-reason {
    text-align: left;
    color: #f26250;
    margin-top: 10px;
  }
</style>
