<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="closeWindow">返回</el-button>
    </div>
    <div class="card-outer">
      <template v-if="detail">
        <div class="title">基本资料</div>
        <div class="card-container" style="display: flex;">
          <img :src="detail.wechat_avatar_url" style="width: 80px; height: 80px; border-radius: 40px; margin: 20px 20px 0 0;">
          <div style="flex: 1">
            <el-form class="demo-table-expand" label-width="100px" label-position="left">
              <el-form-item label="微信昵称" style="grid-column: 1 / 4">
                <span>{{ detail.wechat_nickname }}</span>
              </el-form-item>
              <el-form-item label="用户ID">
                <span>{{ detail.id }}</span>
              </el-form-item>
              <el-form-item label="注册时间">
                <span>{{ detail.auth_user ? formatTime(detail.auth_user.date_joined) : '' }}</span>
              </el-form-item>
              <el-form-item label="会员等级">
                <span>{{ detail.level ? detail.level: '无' }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ detail.wechat_phone_number ? detail.wechat_phone_number : '无' }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ detail.wechat_gender === 'male' ? '男' : (detail.wechat_gender === 'female' ? '女' : '') }}</span>
              </el-form-item>
              <el-form-item label="来源类型">
                <span>{{ sourceType[detail.source] }}</span>
              </el-form-item>
              <el-form-item label="会员积分">
                <span>{{ detail.points }}</span>
              </el-form-item>
              <el-form-item label="城市">
                <span>{{ detail.wechat_city }}</span>
              </el-form-item>
              <el-form-item label="来源场景" v-if="detail.source === 'SCAN'">
                <span>{{ detail.from_reseller.name }}</span>
              </el-form-item>
              <el-form-item label="来源用户" v-else-if="detail.source === 'TRANSFER'">
                <span>{{ detail.from_customer }}</span>
              </el-form-item>
              <el-form-item label="用户标签">
                <el-tag type="success" v-for="(tag, index) in detail.tags" :key="index">{{ tag.name }}</el-tag>
              </el-form-item>
            </el-form>
            <hr />
            <el-form class="demo-table-expand" label-width="100px" label-position="left">
              <el-form-item label="可使用免单金">
                <span>{{ formatPrice(detail.offpay_amount) }}元</span>
              </el-form-item>
              <el-form-item label="累计免单金额">
                <span>{{ formatPrice(detail.total_offpay_amount) }}元</span>
              </el-form-item>
              <el-form-item label="下单次数">
                <span>{{ detail.order_amount }}次</span>
              </el-form-item>
              <el-form-item label="冻结免单金">
                <span>{{ formatPrice(detail.unavailable_offpay_amount) }}元</span>
              </el-form-item>
              <el-form-item label="累计消费金额">
                <span>{{ formatPrice(detail.total_order_amount) }}元</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="title">收货地址</div>
        <div class="card-container">
          <el-table
            stripe
            :data="addressList"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              align="center"
              width="80">
              <el-tag size="small" type="success" slot-scope="scope" v-if="scope.row.is_default">默认</el-tag>
            </el-table-column>
            <el-table-column
              align="center"
              prop="receiver_name"
              label="收货人姓名"
              width="100">
            </el-table-column>
            <el-table-column
              align="center"
              prop="receiver_tel"
              label="手机号码"
              width="200">
            </el-table-column>
            <el-table-column
              label="地址">
              <span slot-scope="scope">{{ scope.row.receiver_area }} {{ scope.row.receiver_address }}</span>
            </el-table-column>
          </el-table>
        </div>
        <div class="title">订单记录</div>
        <order-list :id="id" class="card-container"></order-list>
        <div class="title">免单金使用记录</div>
        <offpay-list :id="id" class="card-container"></offpay-list>
      </template>
      <empty-page v-else></empty-page>
    </div>
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import { formatTime, formatPrice } from '@/assets/util'
import OrderList from './order'
import OffpayList from './offpay'

export default {
  name: 'UserDetail',
  components: {
    EmptyPage,
    OrderList,
    OffpayList
  },
  data () {
    return {
      loading: false,
      detail: null,
      // address list
      addressList: [],
      // constant
      sourceType: {
        CLICK: '直接点击',
        SCAN: '线下扫码',
        TRANSFER: '转发'
      }
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    formatTime,
    formatPrice,
    getDetail () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/customer_user/' + this.id + '/')
        .then(res => {
          that.detail = res.data
          that.addressList = res.data.delivery_address
        })
        .finally(() => {
          that.loading = false
        })
    },
    closeWindow () {
      window.open('javascript:window.open("", "_self", "");window.close();', '_self')
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .card-container {
    padding: 20px;
    margin: 0 20px 20px 20px;
  }
  .demo-table-expand {
    display: grid;
    grid-template-columns: repeat( 3, 1fr );
    grid-column-gap: 10px;
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    margin: 20px 20px 10px 40px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
