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
      <el-button type="primary" class="search-button" size="medium" icon="el-icon-plus" v-can:edit="'User'" @click.stop="addTag">新增标签</el-button>
    </div>
    <div class="card-outer">
      <div v-if="tagList && tagList.length > 0" class="card-container">
        <el-table
          ref="table"
          stripe
          :data="tagList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="id"
            align="center"
            label="标签ID">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="标签名称">
          </el-table-column>
          <el-table-column
            prop="customer_user_amount"
            align="center"
            label="用户数">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="active"-->
          <!--align="center"-->
          <!--label="今日活跃">-->
          <!--</el-table-column>-->
          <el-table-column
            align="center"
            label="累计消费（元）">
            <template slot-scope="scope">{{ formatPrice(scope.row.total_order_amount) }}元</template>
          </el-table-column>
          <el-table-column
            prop="description"
            align="center"
            label="说明">
          </el-table-column>
          <el-table-column
            align="center">
            <template slot-scope="scope">
              <el-button :disabled="!$can('edit', 'User')" class="blue_button_filled" icon="el-icon-edit" circle @click.stop="editTag(scope.row)"></el-button>
              <el-button :disabled="!$can('edit', 'User')" type="primary" icon="el-icon-delete" circle @click.stop="deleteTag(scope.row)"></el-button>
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
    <el-dialog
      :title="dialogIsAdd ? '新增标签' : '修改标签'"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" :model="form" :rules="rules" class="demo-table-expand" label-width="80px">
        <el-form-item label="">
          <span>{{dialogIsAdd ? '请填写新增的' : '修改'}}标签信息</span>
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="标签说明" prop="description">
          <el-input v-model="form.description"></el-input>
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
import { formatPrice } from '@/assets/util'

export default {
  name: 'UserTagList',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // search
      input: '',
      query_key: 'name',
      query_value: '',
      is_search: false,
      options: [
        {
          label: '标签名称',
          value: 'name'
        }
      ],
      // list
      tagList: [],
      pageSize: 20,
      currentPage: 1,
      totalCnt: 0,
      // dialog
      form: {
        id: -1,
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入标签说明', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      dialogIsAdd: true
    }
  },
  methods: {
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
      this.$axios.get('/insider/customer_user_tag/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize +
        '&' + this.query_key + '=' + this.query_value)
        .then(res => {
          that.totalCnt = res.data.count
          that.tagList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    editTag (item) {
      this.form.id = item.id
      this.form.name = item.name
      this.form.description = item.description
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    deleteTag (item) {
      let that = this
      this.$confirm('确定要删除这个标签吗?', '删除标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.loading = true
        this.$axios.delete('/insider/customer_user_tag/' + item.id + '/')
          .then(res => {
            that.getData()
          })
          .finally(() => {
            that.loading = false
          })
      })
    },
    addTag () {
      this.form.name = ''
      this.form.description = ''
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    submitForm () {
      let that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          that.loading = true
          if (this.dialogIsAdd) {
            this.$axios.post('/insider/customer_user_tag/', this.form)
              .then(res => {
                that.getData()
              })
              .finally(() => {
                this.dialogVisible = false
                that.loading = false
              })
          } else {
            this.$axios.patch('/insider/customer_user_tag/' + this.form.id + '/', this.form)
              .then(res => {
                that.query()
              })
              .finally(() => {
                this.dialogVisible = false
                that.loading = false
              })
          }
        }
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>

</style>
