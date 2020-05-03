<template>
  <div class="main-col" v-loading="loading">
    <div style="overflow: hidden">
      <div class="card-header left" :class="{'main-color': type === 'user'}" @click="changeType('user')">
        <p class="fs-23 line-30">{{ vip_user_count }} 人</p>
        <p class="fs-14 line-26">会员数</p>
      </div>
      <div class="card-header right" :class="{'main-color': type !== 'user'}" @click="changeType('order')">
        <p class="fs-23 line-30">{{ formatPrice(vip_order_amount) }} 元</p>
        <p class="fs-14 line-26">会员购买</p>
      </div>
    </div>
    <div v-if="type === 'user'">
      <div class="card-container">
        <div v-if="userList && userList.length > 0">
          <el-table
            ref="table"
            stripe
            :data="userList"
            tooltip-effect="dark"
            @row-click="onRowClick"
            :row-style="{ cursor: 'pointer' }"
            style="width: 100%">
            <el-table-column
              align="center"
              prop="id"
              label="用户ID"
              width="70">
            </el-table-column>
            <el-table-column
              align="center"
              label="微信头像">
              <template slot-scope="scope"><img :src="scope.row.wechat_avatar_url" style="width: 50px; height: 50px"></template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="wechat_nickname"
              label="微信昵称">
            </el-table-column>
            <el-table-column
              align="center"
              label="会员到期时间">
              <template slot-scope="scope">{{ formatTime(scope.row.vip_expired_at) }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              label="最近一次购买的会员">
              <template slot-scope="scope">{{ scope.row.last_vip_order_type ? scope.row.last_vip_order_type : '' }}</template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="pageSize < userTotalCnt"
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="userTotalCnt"
            layout="total, prev, pager, next, jumper">
          </el-pagination>
        </div>
        <empty-page v-else></empty-page>
      </div>
    </div>
    <div v-else>
      <div v-if="orderList && orderList.length > 0" class="card-container">
        <el-table
          ref="table"
          :data="orderList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            label="购买时间">
            <template slot-scope="scope">{{ formatTime(scope.row.paid_at) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="微信头像">
            <template slot-scope="scope"><img :src="scope.row.user.wechat_avatar_url" style="width: 50px; height: 50px"></template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="user.wechat_nickname"
            label="微信昵称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="vip_level.name"
            label="购买类型">
          </el-table-column>
          <el-table-column
            align="center"
            label="支付金额">
            <template slot-scope="scope">{{ formatPrice(scope.row.order_amount) }}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="pageSize < orderTotalCnt"
          class="pagination"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="orderTotalCnt"
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
  name: 'VIPList',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      type: 'user',
      // search
      input: '',
      query_key: 'wechat_nickname',
      query_value: '',
      is_search: false,
      options: [
        {
          label: '微信昵称',
          value: 'wechat_nickname'
        },
        {
          label: '标签',
          value: 'tags__name'
        },
        {
          label: '来源店铺',
          value: 'from_reseller__name'
        },
        {
          label: '联系电话',
          value: 'delivery_address__receiver_tel'
        }

      ],
      pageSize: 20,
      currentPage: 1,
      // userList
      userList: [],
      userTotalCnt: 0,
      // orderList
      orderList: [],
      orderTotalCnt: 0,
      // statistics
      vip_user_count: 0,
      vip_order_amount: 0
    }
  },
  methods: {
    formatTime,
    formatPrice,
    changeType (type) {
      this.type = type
      this.currentPage = 1
      this.query()
    },
    getData () {
      this.is_search = false
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
      this.getStatistics()
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
      if (this.type === 'order') {
        this.$axios.get('/insider/customer_user_vip_order/?page_num=' + this.currentPage +
          '&page_size=' + this.pageSize)
          .then(res => {
            console.log('query', res.data)
            that.orderTotalCnt = res.data.count
            that.orderList = res.data.results
          })
          .finally(() => {
            that.loading = false
          })
      } else {
        this.$axios.get('/insider/customer_user/?page_num=' + this.currentPage +
          '&page_size=' + this.pageSize + '&vip_status=ON')
          .then(res => {
            console.log('query', res.data)
            that.userTotalCnt = res.data.count
            that.userList = res.data.results
          })
          .finally(() => {
            that.loading = false
          })
      }
    },
    getStatistics () {
      let that = this
      this.$axios.post('/insider/statistics/', {
        instances: [
          {
            func: 'vip_user_count',
            params: {}
          },
          {
            func: 'vip_order_amount',
            params: {}
          }
        ]
      })
        .then(res => {
          console.log(res.data)
          that.decodeQueries(res.data)
        })
    },
    decodeQueries (data) {
      let that = this
      data.forEach(item => {
        if (item.code === 200) {
          if (item.instance.func === 'vip_user_count') {
            that.vip_user_count = item.value
          } else if (item.instance.func === 'vip_order_amount') {
            that.vip_order_amount = item.value
          }
        }
      })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    onSelectionChange (selection) {
      this.selectedList = selection
    },
    onRowClick (row, event, column) {
      // this.$router.push('/user/detail/' + row.id)
      window.open(window.location.origin + '/#/user/detail/' + row.id)
    },
    addTag () {
      if (this.selectedList.length === 0) {
        this.$message.error('请先选择用户')
      } else {
        this.dialogIsAdd = true
        this.form.id = ''
        if (this.$refs.Form) {
          this.$refs.Form.clearValidate()
        }
        this.dialogVisible = true
      }
    },
    removeTag () {
      if (this.selectedList.length === 0) {
        this.$message.error('请先选择用户')
      } else {
        this.dialogIsAdd = false
        this.form.id = ''
        if (this.$refs.Form) {
          this.$refs.Form.clearValidate()
        }
        this.dialogVisible = true
      }
    },
    submitForm () {
      let that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let list = []
          for (let index = 0; index < that.selectedList.length; index++) {
            list.push(that.selectedList[index].id)
          }
          that.loading = true
          that.$axios.post('/insider/customer_user_tag/' + that.form.id + '/user/', {
            customer_user: list,
            action: that.dialogIsAdd
          }).then(res => {
          }).finally(() => {
            that.loading = false
            that.dialogVisible = false
            that.$refs.table.clearSelection()
          })
        }
      })
    }
  },
  created () {
    this.getData()
    // this.getAllTags()
  }
}
</script>

<style scoped>
  .card-header {
    width: calc(50% - 20px);
    margin: 10px;
    /*min-height: 100px;*/
    background-color: #ffffff;
    padding: 20px 20px 10px 20px;
  }
  .card-header:hover {
    cursor: pointer;
  }
  .card-container {
    position: relative;
    min-height: calc(100vh - 210px);
  }
</style>
