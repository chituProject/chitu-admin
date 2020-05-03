<template>
  <div class="main-col">
    <div class="filter-container">
      <el-button
        type="primary"
        style="float: right;"
        icon="el-icon-plus"
        size="medium"
        v-can:edit="'Auth'"
        @click.stop="create"
      >添加用户</el-button>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-form
          ref="settingForm"
          :model="model"
          :rules="rules"
          label-width="160px"
          label-position="left"
          class="demo-table-expand"
        >
          <el-form-item label="用户名" prop="user_name">
            <el-input v-model="model.user_name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" id="password" v-model="model.password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input
              type="password"
              id="checkPass"
              v-model="model.checkPass"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select placeholder="请选择" v-model="model.role">
              <el-option v-for="(value, key) of roles" :key="key" :value="key" :label="value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.model.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      model: {
        user_name: '',
        password: '',
        checkPass: '',
        role: ''
      },
      rules: {
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        checkPass: [{ validator: validatePass, trigger: 'blur' }],
        role: [{ required: true, message: '请选择用户角色', trigger: 'blur' }]
      },
      roles: Object.freeze(['超级管理员', '市场人员'])
    }
  },
  methods: {
    create () {
      this.$refs.settingForm.validate(valid => {
        if (!valid) {
          this.$message.error('请填写所有项目')
          return
        }
        console.log(this.model)
      })
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  margin: 20px;
  font-size: 0;
  text-align: left;
}
.demo-table-expand .el-form-item {
  width: 460px;
  /*margin-right: 0;*/
  margin-bottom: 0;
  padding-bottom: 20px;
}
.filter-container {
  padding: 12px;
}
</style>
