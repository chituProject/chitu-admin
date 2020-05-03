<template>
  <div class="flex-justify_center index_wrapper">
    <div class="bg-panel">
      <img src="/static/img/indexIcon.png" style="position:absolute;margin-left:-143px;margin-top:89px;"/>
    </div>
    <div class="input-panel">
      <el-container>
        <el-main style="height:458px;padding-top:120px;">
          <img src="/static/img/user.svg" style="position:absolute;width:25px;height:27px;margin-left:-173px;margin-top:7px;"/>
          <img src="/static/img/password.svg" style="position:absolute;width:26px;height:22px;margin-left:-173px;margin-top:70px;"/>
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item label="" prop="user">
              <el-input type="text" id="user" v-model="loginForm.user" placeholder="用户名" style="width:279px;"></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" id="password" v-model="loginForm.password" placeholder="密码" style="width:279px;"></el-input>
            </el-form-item>
            <br/>
            <el-button type="primary" @click="login" style="width:279px;">登录</el-button>
            <br/><br/>
            <el-button @click="createAccount" style="width:279px;" v-if="config.isDev">注册</el-button>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
// import md5 from 'js-md5'
import { Message } from 'element-ui'
import config from '../config.js'
export default {
  name: 'Login',
  data () {
    return {
      config,
      loginForm: {// 表单中的参数
        user: '',
        password: ''
      },
      rules: {
        user: [
          { required: true, message: '请输入用户名' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ]
      }
    }
  },
  methods: {
    resetForm: function () {
      this.loginForm.user = ''
      this.loginForm.userError = ''
      this.loginForm.password = ''
      this.loginForm.passwordError = ''
    },
    login: function () {
      let user = this.loginForm.user
      let password = this.loginForm.password
      let that = this
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          that.$axios.post('/insider/session/', {
            username: user,
            password: password
          })
            .then(res => {
              console.log(res)
              if (res.status === 200 || res.status === 201) {
                Message.success('登录成功，欢迎' + user)
                that.$store.commit('SET_USERNAME', user)
                let url = that.$route.query.redirect
                console.log('url:', url)
                if (url) {
                  that.$router.replace({path: url})
                } else {
                  that.$router.replace({path: '/index'})
                }
              } else {
                this.$message.error('登录失败，未知错误')
              }
            })
            .catch(error => {
              console.log('error', error)
              Message({
                message: '登录失败，请核对用户名密码，或进行注册',
                type: 'error',
                center: true
              })
            })
        } else {
          Message.error('请输入用户名密码')
        }
      })
    },
    createAccount: function () {
      let user = this.loginForm.user
      let password = this.loginForm.password
      let that = this
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          that.$axios.post('/insider/user/', {
            user_name: user,
            password: password
          })
            .then(res => {
              console.log(res)
              Message.success('注册成功，请登录')
            })
            .catch(error => {
              if (error.response.status >= 500) {
                Message.warning('该用户已存在，请登录')
              } else {
                Message.error('注册失败，请重试')
              }
            })
        } else {
          Message.error('请输入用户名密码')
        }
      })
    },
    inputBlur: function (errorItem, inputContent) {
      if (errorItem === 'user') {
        if (inputContent === '') {
          this.loginForm.userError = '用户名不能为空'
        } else {
          this.loginForm.userError = ''
        }
      } else if (errorItem === 'password') {
        if (inputContent === '') {
          this.loginForm.passwordError = '密码不能为空'
        } else {
          this.loginForm.passwordError = ''
        }
      }
      this.loginForm.beDisabled = !(this.loginForm.user !== '' && this.loginForm.password !== '')
    }
  }
}
</script>

<style scoped>
.bg-panel{
  height:458px;
  width:421px;
  background-image: linear-gradient(-55deg, #ff8c37 0%, #fa7744 55%, #f56250 95%), linear-gradient(#7443ff, #7443ff);
  background-blend-mode: normal, normal;
  border-radius: 4px;
}
.input-panel{
  width: 421px;
  height: 458px;
  background-color: #ffffff;
  box-shadow: 0px 0px 72px 18px rgba(189, 193, 222, 0.3);
  opacity: 0.96;
}
.flex-justify_center {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
}
.index_wrapper{
  padding-top:calc(50vh - 489px);
  background:url('/static/img/background.png') no-repeat;
  height:calc(100vh - 60px);
}
</style>
