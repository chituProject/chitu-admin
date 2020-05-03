<template>
  <div class="main-col" v-loading="loading">
    <div class="button-container">
      <el-button type="primary" class="search-button button-container-item" @click="addVip">新增</el-button>
    </div>
    <div class="card-outer">
      <div v-if="list && list.length > 0" class="card-container">
        <el-table
          ref="table"
          stripe
          :data="list"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
            align="center"
            label="有效时间">
            <template slot-scope="scope">{{ scope.row.period }}天</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="划线价">
            <template slot-scope="scope">{{ formatPrice(scope.row.marking_price) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="售价">
            <template slot-scope="scope">{{ formatPrice(scope.row.price) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="赠送免单金">
            <template slot-scope="scope">{{ formatPrice(scope.row.offpay_amount) }}元</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="description"
            label="说明">
          </el-table-column>
          <el-table-column
            align="center">
            <template slot-scope="scope">
              <el-button :disabled="!$can('edit', 'Platform')" class="blue_button_filled" icon="el-icon-edit" circle @click.stop="editVIP(scope.row)"></el-button>
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
      title="编辑会员"
      :visible.sync="addDialogVisible"
      center>
      <el-form ref="addForm" :model="formAdd" :rules="addRules" size="small">
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="formAdd.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="有效时间" prop="period">
          <el-input type="text" v-model="formAdd.period" placeholder="请输入有效时间"></el-input>
        </el-form-item>
        <el-form-item label="赠送免单金" prop="offpay_amount">
          <el-input type="text" v-model="formAdd.offpay_amount" placeholder="请输入赠送免单金"></el-input>
        </el-form-item>
        <el-form-item label="划线价" prop="marking_price">
          <el-input type="text" v-model="formAdd.marking_price" placeholder="请输入划线价"></el-input>
        </el-form-item>
        <el-form-item label="售价" prop="price">
          <el-input type="text" v-model="formAdd.price" placeholder="请输入售价"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input type="text" v-model="formAdd.description" placeholder="请输入说明"></el-input>
        </el-form-item>
        <div style="text-align: right">
          <el-button type="primary" @click.stop="submitAddForm" size="medium">确定</el-button>
          <el-button @click="addDialogVisible = false" size="medium">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      title="编辑会员"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" :model="form" :rules="rules" size="small">
        <el-form-item label="划线价" prop="marking_price">
          <el-input type="text" v-model="form.marking_price" placeholder="请输入划线价"></el-input>
        </el-form-item>
        <el-form-item label="售价" prop="price">
          <el-input type="text" v-model="form.price" placeholder="请输入售价"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input type="text" v-model="form.description" placeholder="请输入说明"></el-input>
        </el-form-item>
        <div style="text-align: right">
          <el-button type="primary" @click.stop="submitForm" size="medium">确定</el-button>
          <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import { formatTime, formatPrice, deformatPrice, deepCopy } from '@/assets/util'

export default {
  name: 'list',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      // list
      list: [],
      pageSize: 50,
      currentPage: 1,
      totalCnt: 0,
      // dialog
      dialogVisible: false,
      addDialogVisible: false,
      rules: {
        marking_price: [
          { required: true, message: '请输入划线价', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入售价', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入说明', trigger: 'blur' }
        ]
      },
      addRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        period: [
          { required: true, message: '请输入有效时间', trigger: 'blur' }
        ],
        offpay_amount: [
          { required: true, message: '请输入赠送免单金', trigger: 'blur' }
        ],
        marking_price: [
          { required: true, message: '请输入划线价', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入售价', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入说明', trigger: 'blur' }
        ]
      },
      form: {
        id: '',
        marking_price: '',
        price: '',
        description: ''
      },
      formAdd: {
        name: '',
        period: '',
        offpay_amount: '',
        marking_price: '',
        price: '',
        description: ''
      }
    }
  },
  methods: {
    formatTime,
    formatPrice,
    addVip () {
      this.formAdd.name = ''
      this.formAdd.period = ''
      this.formAdd.offpay_amount = ''
      this.formAdd.marking_price = ''
      this.formAdd.price = ''
      this.formAdd.description = ''
      this.addDialogVisible = true
    },
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
      that.loading = true
      this.$axios.get('/insider/customer_user_vip_level/?page_num=' + this.currentPage +
        '&page_size=' + this.pageSize)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    editVIP (item) {
      this.form.id = item.id
      this.form.marking_price = item.marking_price / 100
      this.form.price = item.price / 100
      this.form.description = item.description
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogVisible = true
    },
    submitAddForm () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$axios.post('/insider/customer_user_vip_level/', this.encodeForm(this.formAdd))
            .then(res => {
              console.log(res)
              this.query()
            })
            .catch(() => {
              this.loading = false
            })
            .finally(() => {
              this.addDialogVisible = false
            })
        }
      })
    },
    submitForm () {
      let that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          that.loading = true
          that.$axios.patch('/insider/customer_user_vip_level/' + that.form.id + '/', that.encodeForm(that.form))
            .then(res => {
              that.query()
            })
            .catch(() => {
              that.loading = false
            })
            .finally(() => {
              that.dialogVisible = false
            })
        }
      })
    },
    encodeForm (form) {
      let tmpForm = deepCopy(form)
      tmpForm.price = deformatPrice(form.price)
      tmpForm.marking_price = deformatPrice(form.marking_price)
      return tmpForm
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  .card-outer {
    top: 50px
  }
  .button-container {
    overflow: hidden;
    width: 100%;
  }
  .button-container-item {
    float: right;
    margin-right: 10px;
  }
</style>
