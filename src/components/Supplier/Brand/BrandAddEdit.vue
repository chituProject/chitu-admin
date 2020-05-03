<template>
  <div ref="detail" v-show="show" class="main">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button type="primary" size="medium" v-can:edit="'Supplier'" @click="submit">保存</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-card shadow="never" class="card">
          <el-form :model="form" :rules="rules" ref="form" class="demo-table-expand" label-width="100px" label-position="left">
            <el-form-item label="品牌ID">
              <span>{{id}}</span>
            </el-form-item>
            <el-form-item label="品牌名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="商标注册号" prop="register_code">
              <el-input type="number" v-model="form.register_code"></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="supplier">
              <el-select v-model="form.supplier" placeholder="请选择">
                <el-option
                  v-for="item in supplierList"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="LOGO" prop="logo" style="margin-bottom: 0">
              <img-single-upload
                ref="logo"
                :uuid="uuid"
                root="brand"
                path="logo"
                :customSize="true"
                style="width: 120px; float: left;"
                v-model="form.logo">
              </img-single-upload>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import ImgSingleUpload from '@/components/ImgSingleUpload'
import UUID from 'uuid-js'

export default {
  name: 'BrandAddEdit',
  components: {
    ImgSingleUpload
  },
  data () {
    return {
      show: false,
      id: undefined,
      isAdd: true,
      uuid: null,
      form: {
        name: '',
        supplier: '',
        logo: '',
        register_code: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
        register_code: [
          { required: true, message: '请输入商标注册号', trigger: 'blur' }
        ],
        supplier: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        logo: [
          { required: true, message: '请上传LOGO', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    supplierList () {
      return this.$store.state.merchant
    }
  },
  props: {
    model: {
      type: Object
    }
  },
  methods: {
    close () {
      this.show = false
    },
    open (brand) {
      this.show = true
      this.$refs.form.resetFields()
      this.form.logo = ''
      this.id = null
      if (brand) {
        this.isAdd = false
        this.uuid = brand.uuid
        this.id = brand.id
        this.form.name = brand.name
        this.form.supplier = brand.merchant.uuid
        this.form.logo = brand.logo
        this.form.register_code = brand.register_code ? brand.register_code : ''
      } else {
        this.isAdd = true
        this.uuid = UUID.create(1).hex
      }
    },
    goBack () {
      this.$refs.logo.cancelChanges()
      this.$emit('goBack')
    },
    submit () {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.$refs.logo.confirmChanges()
          if (!that.isAdd) {
            that.$axios.patch('/insider/brand/' + that.id + '/', that.deleteEmptyString({
              name: that.form.name,
              merchant: that.form.supplier,
              logo: that.form.logo,
              register_code: that.form.register_code
            })).then(() => {
              that.$emit('complete')
            })
          } else {
            that.$axios.post('/insider/brand/', {
              uuid: that.uuid,
              name: that.form.name,
              merchant: that.form.supplier,
              logo: that.form.logo,
              register_code: that.form.register_code
            }).then(() => {
              that.$emit('complete')
            })
          }
        }
      })
    },
    deleteEmptyString (ob) {
      for (var i in ob) {
        if (ob[i] === '') {
          delete ob[i]
        }
      }
      return ob
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .demo-table-expand {
    width: 100%;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    width: 50%;
    min-width: 200px;
  }
</style>
