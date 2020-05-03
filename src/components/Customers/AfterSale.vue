<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button class="search-button" :type="query_status === '' ? 'primary' : 'normal'" size="medium" @click="handleSelect('ALL')">全部</el-button>
      <el-button class="search-button" :type="query_status === 'ADMIN_CONFIRMING' ? 'primary' : 'normal'" size="medium" @click="handleSelect('ADMIN_CONFIRMING')">平台审核<span v-if="counts.ADMIN_CONFIRMING > 0"> ({{ counts.ADMIN_CONFIRMING }})</span></el-button>
      <el-button class="search-button" :type="query_status === 'SUPPLIER_CONFIRMING' ? 'primary' : 'normal'" size="medium" @click="handleSelect('SUPPLIER_CONFIRMING')">商家确认<span v-if="counts.SUPPLIER_CONFIRMING > 0"> ({{ counts.SUPPLIER_CONFIRMING }})</span></el-button>
      <el-button class="search-button" :type="query_status === 'CUSTOMER_UNSHIPPED' ? 'primary' : 'normal'" size="medium" @click="handleSelect('CUSTOMER_UNSHIPPED')">买家待发货<span v-if="counts.CUSTOMER_UNSHIPPED > 0"> ({{ counts.CUSTOMER_UNSHIPPED }})</span></el-button>
      <el-button class="search-button" :type="query_status === 'CUSTOMER_SHIPPING' ? 'primary' : 'normal'" size="medium" @click="handleSelect('CUSTOMER_SHIPPING')">商家待收货<span v-if="counts.CUSTOMER_SHIPPING > 0"> ({{ counts.CUSTOMER_SHIPPING }})</span></el-button>
      <el-button class="search-button" :type="query_status === 'FINISHED' ? 'primary' : 'normal'" size="medium" @click="handleSelect('FINISHED')">服务结束<span v-if="counts.FINISHED > 0"> ({{ counts.FINISHED }})</span></el-button>
      <el-button class="search-button" :type="query_status === 'CANCELED' ? 'primary' : 'normal'" size="medium" @click="handleSelect('CANCELED')">已取消<span v-if="counts.CANCELED > 0"> ({{ counts.CANCELED }})</span></el-button>
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
          ref="table"
          stripe
          :data="list"
          @row-click="onRowClick"
          :row-style="{ cursor: 'pointer' }"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form inline class="demo-table-expand" label-width="140px" label-position="left" >
                <el-form-item label="售后单号">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="服务类型">
                  <span>{{ status[scope.row.status] }}</span>
                </el-form-item>
                <el-form-item label="SPU短标题（SKU）">
                  <span>{{ scope.row.order_item.goods_title }}（{{ scope.row.order_item.sku }}）</span>
                </el-form-item>
                <el-form-item label="发起时间">
                  <span>{{ formatTime(scope.row.created_at) }}</span>
                </el-form-item>
                <el-form-item label="服务状态">
                  <span>{{ service_type[scope.row.service_type] }}</span>
                </el-form-item>
                <el-form-item label="SKU数量">
                  <span>{{ scope.row.amount }}</span>
                </el-form-item>
                <el-form-item label="关联订单">
                  <a style="cursor:pointer;" @click="gotoOrderDetail(scope.row.suborder_id)">{{ scope.row.suborder_id }}</a>
                </el-form-item>
                <el-form-item label="订单状态">
                  <span>{{ suborder_status[scope.row.suborder_status] }}</span>
                </el-form-item>
                <el-form-item label="售后原因">
                  <span>{{ scope.row.reason }}</span>
                </el-form-item>
                <template v-if="scope.row.service_type === 'REFUND' || scope.row.service_type === 'REFUND_RETURN'">
                  <hr />
                  <el-form-item label="商家退款">
                    <span>{{ formatPrice(scope.row.supplier_refund) }}元</span>
                  </el-form-item>
                  <el-form-item label="返利退款">
                    <span>{{ formatPrice(scope.row.reseller_rebate_refund) }}元</span>
                  </el-form-item>
                  <el-form-item label="货品状态">
                    <span>{{ goods_status[scope.row.goods_status] }}</span>
                  </el-form-item>
                  <el-form-item label="SKU售价">
                    <span>{{ formatPrice(scope.row.order_item.price) }}元</span>
                  </el-form-item>
                  <el-form-item label="返利场景">
                    <span>{{ scope.row.reseller_name }}</span>
                  </el-form-item>
                  <el-form-item label="用户退款">
                    <span>{{ formatPrice(scope.row.customer_refund) }}元</span>
                  </el-form-item>
                  <el-form-item label="退款商家" style="width: 100%">
                    <span>{{ scope.row.order_item.merchant_name }}</span>
                  </el-form-item>
                </template>
                <hr />
                <el-form-item label="问题描述" style="width: 100%">
                  <span>{{scope.row.description}}</span>
                </el-form-item>
                <template v-if="scope.row.photos">
                  <img-list-upload
                    :editable="false"
                    v-model="scope.row.photos">
                  </img-list-upload>
                </template>
                <template v-if="scope.row.status === 'CUSTOMER_UNSHIPPED' || scope.row.status === 'CUSTOMER_SHIPPING' || (scope.row.status === 'FINISHED' && scope.row.service_type !== 'REFUND')">
                  <template v-if="scope.row.service_type !== 'REPLENISHMENT'">
                    <el-form-item label="收货人电话">
                      <span>{{scope.row.supplier_receiver_tel}}</span>
                    </el-form-item>
                    <el-form-item label="商家收货人">
                      <span>{{scope.row.supplier_receiver_name}}</span>
                    </el-form-item>
                    <el-form-item label="退货地址">
                      <span>{{scope.row.supplier_receiver_address}}</span>
                    </el-form-item>
                    <template v-if="scope.row.status !== 'CUSTOMER_UNSHIPPED'">
                      <el-form-item label="买家退货快递公司">
                        <span>{{scope.row.customer_express_name}}</span>
                      </el-form-item>
                      <el-form-item label="买家退货物流单号">
                        <span>{{scope.row.customer_logistic_code}}</span>
                      </el-form-item>
                      <el-form-item label="买家凭证">
                        <span style="color: #f26250; cursor: pointer;" @click.stop="viewEvidence(scope.row.customer_delivery_evidence)">点击这里弹窗查看</span>
                      </el-form-item>
                    </template>
                  </template>
                  <template v-if="scope.row.status === 'FINISHED' && (scope.row.service_type === 'EXCHANGE' || scope.row.service_type === 'REPLENISHMENT')">
                    <el-form-item label="买家收件人">
                      <span>{{scope.row.suborder.receiver_name}}</span>
                    </el-form-item>
                    <el-form-item label="买家收货地址" style="width: 66%">
                      <span>{{scope.row.suborder.receiver_full_address}}</span>
                    </el-form-item>
                    <el-form-item label="买家手机号码">
                      <span>{{scope.row.suborder.receiver_tel}}</span>
                    </el-form-item>
                    <el-form-item label="回货快递" v-if="scope.row.service_type === 'EXCHANGE'">
                      <span>{{scope.row.supplier_express_name}}</span>
                    </el-form-item>
                    <el-form-item label="商家补货快递" v-else>
                      <span>{{scope.row.supplier_express_name}}</span>
                    </el-form-item>
                    <el-form-item label="回货物流单号" v-if="scope.row.service_type === 'EXCHANGE'">
                      <span>{{scope.row.supplier_logistic_code}}</span>
                    </el-form-item>
                    <el-form-item label="商家补货物流单号" v-else>
                      <span>{{scope.row.supplier_logistic_code}}</span>
                    </el-form-item>
                  </template>
                </template>
                <el-form-item style="color: #f26250; width: 100%" label="取消原因" v-if="scope.row.status === 'CANCELED'">
                  <span style="color: #f26250">{{scope.row.reject_reason}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="id"
            label="售后单号"
            width="210">
          </el-table-column>
          <el-table-column
            align="center"
            label="服务状态">
            <template slot-scope="scope">{{ status[scope.row.status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="服务类型">
            <template slot-scope="scope">{{ service_type[scope.row.service_type] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="发起时间"
            width="135">
            <template slot-scope="scope">{{ formatTime(scope.row.created_at) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="SPU短标题（SKU）"
            width="180">
            <template slot-scope="scope">{{ scope.row.order_item.goods_title }}（{{ scope.row.order_item.sku }}）</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="suborder_id"
            label="关联订单"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            label="订单状态">
            <template slot-scope="scope">{{ suborder_status[scope.row.suborder_status] }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope" v-if="scope.row.status === 'ADMIN_CONFIRMING'">
              <el-button type="text"
                         v-can:edit="'Customers'"
                         @click.stop="auditYes(scope.row.id)">跟进</el-button>
              <el-button type="text"
                         v-can:edit="'Customers'"
                         @click.stop="auditNo(scope.row.id)">驳回</el-button>
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
      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img v-for="(evidence, index) in evidenceList" :src="evidence" :key="index" style="width: 100%;">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { formatTime, formatPrice } from '@/assets/util'
import EmptyPage from '@/components/EmptyPage'
import ImgListUpload from '@/components/ImgListUpload'

export default {
  name: 'Customers',
  components: {
    EmptyPage,
    ImgListUpload
  },
  data () {
    return {
      input: '',
      list: [],
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      query_status: '',
      query_key: 'suborder__id',
      query_value: '',
      options: [
        {
          label: '关联订单',
          value: 'suborder__id'
        }
      ],
      loading: false,
      counts: {},
      status: {
        ADMIN_CONFIRMING: '等待平台审核',
        SUPPLIER_CONFIRMING: '等待商家审核',
        CANCELED: '已取消',
        CUSTOMER_UNSHIPPED: '买家未发货',
        CUSTOMER_SHIPPING: '商家待收货',
        FINISHED: '服务结束'
      },
      service_type: {
        REPLENISHMENT: '补货',
        EXCHANGE: '换货',
        REFUND: '仅退款',
        REFUND_RETURN: '退货退款'
      },
      suborder_status: {
        UNSHIPPED: '待发货',
        SHIPPING: '已发货',
        FINISHED: '已完成'
      },
      goods_status: {
        RECEIVED: '已收到货',
        UNRECEIVED: '未收到货'
      },
      evidenceList: [],
      dialogVisible: false,
      unfold_flag: []
    }
  },
  methods: {
    formatTime,
    formatPrice,
    getData () {
      this.input = ''
      this.query_value = ''
      this.currentPage = 1
      this.query()
    },
    querySearch () {
      this.currentPage = 1
      this.query_value = this.input
      this.query()
    },
    query () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/after_sale/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&status=' + this.query_status +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          that.totalCnt = res.data.count
          for (let i = 0; i < that.pageSize; i++) {
            that.$set(that.unfold_flag, i, false)
          }
          that.list = res.data.results
          that.loading = false
        })
      this.$axios.get('/insider/after_sale/count/')
        .then(res => {
          that.counts = res.data
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    onRowClick (row, event, column) {
      this.$refs.table.toggleRowExpansion(row)
    },
    gotoOrderDetail (suborderId) {
      let id = suborderId.split('-')[0]
      this.$router.push('/orders/' + id)
    },
    handleSelect (key) {
      this.query_status = key === 'ALL' ? '' : key
      this.getData()
    },
    doAudit (id, action, reason) {
      const that = this
      let form = {}
      if (reason) {
        form = {
          action: action,
          reject_reason: reason
        }
      } else {
        form = {
          action: action
        }
      }
      this.$axios.post('/insider/after_sale/' + id + '/confirm/', form).then(() => {
        that.query()
      })
    },
    auditNo (id) {
      const that = this
      this.$prompt('示例：您购买的商品已经已经发货，不能进行退款哟！', '请填写驳回原因，请参考下面的示例进行填写！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入驳回原因'
      }).then(({ value }) => {
        that.doAudit(id, 0, value)
      }).catch(() => {})
    },
    auditYes (id) {
      const that = this
      this.$confirm('确认要跟进吗?', '跟进', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.doAudit(id, 1, null)
      })
    },
    viewEvidence (evidenceList) {
      this.evidenceList = evidenceList
      this.dialogVisible = true
    }
  },
  mounted () {
    this.handleSelect('ALL')
  }
}
</script>

<style scoped>
  .demo-table-expand {
    flex: 1;
  }
  .demo-operation {
    text-align: center;
    vertical-align: center;
  }
  .demo-operation .el-button {
    margin: 6px 0;
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
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
    margin-right: 0;
    width: 33%;
  }
  .card {
    overflow: visible;
    position: relative;
  }
  .unfold_btn {
    position: absolute;
    bottom: -15px;
    left: 0;
    right: 0;
    width: 30px;
    height: 30px;
    margin: auto;
    cursor: pointer;
    border-radius: 15px;
    background-color: #c1bfbf;
    color: white;
    line-height: 30px;
    text-align: center;
  }
  .unfold_btn.rotate{
    transform-origin:center center;
    transform: rotate(180deg);
    transition: transform 0.2s;
  }
  .unfold_btn.normal{
    transform-origin:center center;
    transform: rotate(0deg);
    transition: transform 0.2s;
  }
  .unfold_btn:hover {
    box-shadow: 0 3px 7px 0 rgba(180, 178, 178, 0.35);
  }
</style>
