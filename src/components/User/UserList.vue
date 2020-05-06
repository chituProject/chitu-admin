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
        placeholder="搜索内容"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" class="search-button" size="medium" @click.stop="querySearch">搜索</el-button>
    </div>
    <div class="card-outer">
      <div v-if="userList && userList.length > 0" class="card-container">
        <el-table
          ref="table"
          :data="userList"
          tooltip-effect="dark"
          stripe
          @selection-change="onSelectionChange"
          @row-click="onRowClick"
          :row-style="{ cursor: 'pointer' }"
          style="width: 100%">
          <el-table-column
            align="center"
            type="selection"
            v-if="$can('edit', 'User')"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            prop="id"
            label="用户ID"
            width="70">
          </el-table-column>
          <el-table-column
            align="center"
            prop="phone_number"
            label="手机号"
            width="100"
          >
            <template slot-scope="scope">
              {{scope.row.wechat_phone_number ? scope.row.wechat_phone_number : scope.row.app_phone_number}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="微信头像"
            width="90">
            <template slot-scope="scope"><img :src="scope.row.wechat_avatar_url" style="width: 50px; height: 50px"></template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="wechat_nickname"
            label="微信昵称"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            prop="wechat_gender"
            label="性别"
            width="50">
            <template slot-scope="scope">{{ scope.row.wechat_gender === 'male' ? '男' : (scope.row.wechat_gender === 'female' ? '女' : '') }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="wechat_city"
            label="城市">
          </el-table-column>
          <el-table-column
            align="center"
            label="可用免单金">
            <template slot-scope="scope">{{ formatPrice(scope.row.offpay_amount + scope.row.eb_offpay_amount) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="冻结免单金">
            <template slot-scope="scope">{{ formatPrice(scope.row.unavailable_offpay_amount) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="order_amount"
            label="订单数">
          </el-table-column>
          <el-table-column
            align="center"
            label="累计消费">
            <template slot-scope="scope">{{ formatPrice(scope.row.total_order_amount) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="累计消耗免单金">
            <template slot-scope="scope">{{ formatPrice(scope.row.total_offpay_amount) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="注册时间"
            width="135">
            <template slot-scope="scope">{{ formatTime(scope.row.auth_user.date_joined) }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="来源类型">
            <template slot-scope="scope">{{ scope.row.source ? sourceType[scope.row.source] : '' }}</template>
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
    <el-dialog
      :title="dialogIsAdd ? '新增标签' : '删除标签'"
      :visible.sync="dialogVisible"
      width="300px"
      center>
      <el-form ref="Form" :model="form" :rules="rules" class="demo-table-expand">
        <el-form-item>
          <span>请选择需要{{dialogIsAdd ? '添加' : '删除'}}的标签</span>
        </el-form-item>
        <el-form-item prop="id">
          <el-select v-model="form.id" style="width: 100%">
            <el-option
              v-for="item in allTags"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click.stop="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import { formatTime, formatPrice } from '@/assets/util'

export default {
  name: 'UserList',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_key: 'wechat_nickname__contains',
      query_value: '',
      is_search: false,
      options: [
        {
          label: '微信昵称',
          value: 'wechat_nickname__contains'
        },
        {
          label: '手机号',
          value: 'wechat_phone_number__contains'
        },
        {
          label: '标签',
          value: 'tags__name'
        },
        {
          label: '来源店铺',
          value: 'from_reseller__name__contains'
        }
      ],
      // list
      userList: [],
      selectedList: [],
      pageSize: 20,
      currentPage: 1,
      totalCnt: 0,
      // dialog
      dialogVisible: false,
      dialogIsAdd: true,
      allTags: [],
      form: {
        id: ''
      },
      rules: {
        id: [
          { required: true, message: '请选择标签', trigger: 'change' }
        ]
      },
      // constant
      sourceType: {
        CLICK: '直接点击',
        SCAN: '线下扫码',
        TRANSFER: '转发'
      }
    }
  },
  methods: {
    formatTime,
    formatPrice,
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
      this.loading = true
      this.$axios.get('/insider/customer_user/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          that.totalCnt = res.data.count
          that.userList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    getAllTags () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/customer_user_tag/tags/')
        .then(res => {
          that.allTags = res.data
        })
        .finally(() => {
          that.loading = false
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
    this.getAllTags()
  }
}
</script>

<style scoped>

</style>
