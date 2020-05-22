<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="save">保存</el-button>
        <!--<el-button type="primary" size="medium" @click="save" v-can:edit="'Platform'">保存</el-button>-->
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form ref="settingForm" :model="model" :rules="rules" class="demo-table-expand" label-width="160px" label-position="left">
          <el-form-item label="联系经理" prop="name" type="name">
            <el-input v-model="model.name" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" type="phone">
            <el-input v-model="model.phone" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱" prop="email" type="email">
            <el-input v-model="model.email" clearable placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserContact',
  data () {
    let validateName = (rule, value, callback) => {
      console.log('validateName', value)
      if (!value) {
        return callback(new Error('请输入姓名'))
      }
      callback()
    }
    let validatePhone = (rule, value, callback) => {
      console.log('validatePhone', value)
      if ((value.match(/\d/g) || []).length !== 11) {
        return callback(new Error('请输入合法联系电话'))
      }
      callback()
    }
    let validateEmail = (rule, value, callback) => {
      console.log('validateEmail', value)
      var mailFormat = /\S+@\S+\.\S+/
      if (!value.match(mailFormat)) {
        return callback(new Error('请输入合法联系邮箱'))
      }
      callback()
    }
    return {
      loading: false,
      model: {
        name: '',
        phone: '',
        email: ''
      },
      rules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save () {
      let that = this
      this.$refs.settingForm.validate((valid) => {
        if (valid) {
          var r = confirm('是否确认修改？这需要在用户退出小程序再次打开后才生效')
          if (r) {
            that.loading = true
            that.$axios.post('/insider/settings/', {
              instances: [{
                func: 'set_scan_contact',
                params: {
                  name: that.model.name,
                  phone: that.model.phone,
                  email: that.model.email
                }
              }]
            })
              .then(res => {
                console.log(res.data)
                if (res.data[0].code === 200) {
                  that.$message.success('保存成功')
                } else {
                  that.$message.error('保存失败')
                }
                that.loading = false
              })
          } else {
            that.$message.error('不保存本次修改')
            return false
          }
        } else {
          that.$message.error('请填写所有项目')
        }
      })
    },
    getData () {
      let that = this
      this.$axios.post('/insider/settings/', {
        instances: [{
          func: 'get_current_scan_contact',
          params: {}
        }]
      })
        .then(res => {
          console.log('get_current_scan_contact', res.data)
          if (res.data.length >= 1 && res.data[0].code === 200) {
            let value = res.data[0].value
            that.model = {
              name: value.name,
              phone: value.phone,
              email: value.email
            }
          }
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .demo-table-expand {
    margin: 0 20px 20px;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand .el-form-item {
    width: 360px;
    /*margin-right: 0;*/
    margin-bottom: 0;
    padding-bottom: 20px;
  }
  .card-container {
    position: relative;
  }
  .divider {
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
    background-color: #efeded;
  }
  .title {
    font-size: 20px !important;
    /*font-weight: bold;*/
    text-align: left;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .divider + .title {
    margin-top: 40px;
  }
  .demo-table-expand label {
    /*width: 90px;*/
    color: #99a9bf;
  }
  .flex-section {
    display: flex;
    /*width: 400px;*/
  }
</style>
