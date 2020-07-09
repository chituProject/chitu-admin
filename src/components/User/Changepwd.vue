<template>
  <div class="main-col">
    <div class="filter-container">
      <el-button type="primary" style="float: right;"
                 size="medium" @click.stop="resetConfirm">确定</el-button>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-form v-if="!successful" ref="resetForm" :model="resetForm" :rules="rules" label-width="160px" label-position="left">
          <el-form-item label="用户名">
            <span>{{ username }}</span>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" id="password" v-model="resetForm.password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" id="checkPass" v-model="resetForm.checkPass" placeholder="请再次输入密码"></el-input>
          </el-form-item>
        </el-form>
        <div v-else>
          <i class="el-icon-success reset-success"></i>
          <p>密码修改成功，5秒后自动返回<a href="/#/login" style="color: #F56C6C;">登录页面</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import md5 from 'js-md5'
import { Message } from 'element-ui'
export default {
  name: 'ResetPassword',
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      resetForm: {// 表单中的参数
        username: '',
        password: '',
        checkPass: ''
      },
      successful: false,
      rules: {
        password: [
          { required: true, message: '请输入新密码' }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', validator: validatePass }
        ]
      }
    }
  },
  computed: {
    username () {
      return this.$store.state.username
    }
  },
  methods: {
    deleteEmptyString (ob) {
      for (var i in ob) {
        if (ob[i] === '') {
          delete ob[i]
        }
      }
      return ob
    },
    resetConfirm () {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          const form = {
            ...this.resetForm,
            username: this.username
          }
          this.$axios.post('/insider/session/', this.deleteEmptyString(form))
            .then(res => {
              console.log(res)
              this.successful = true
              // Message.success('修改密码成功')
              setTimeout(() => {
                this.$router.replace('/login')
              }, 5000)
            })
            .catch(error => {
              console.log('error', error)
              Message.error('修改密码失败')
            })
        } else {
          Message.error('请填写所有项目')
        }
      })
    }
  }
}
</script>

<style scoped>
  .addition {
    margin-top: 20px;
  }
  .addition a {
    color: #F56C6C;
  }
  .filter-container {
    padding: 12px;
  }
  .reset-success {
    color: #71aae8;
    font-size: 30px;
    margin: 20px;
  }
  form {
    max-width: 500px;
    margin: 20px;
    font-size: 0;
    text-align: left;
  }
</style>
