<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="save" v-can:edit="'Platform'">保存</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form ref="settingForm" :model="model" :rules="rules" class="demo-table-expand" label-width="160px" label-position="left">
          <el-form-item label="新用户电商红包（元）" prop="newUser">
            <el-input v-model="model.newUser" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="助力人数 (人)" prop="helperNum">
            <el-input v-model="model.helperNum" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="新用户线下红包（元）"></el-form-item>
          <div style="margin-left: 40px">
            <div class="flex-section">
              <el-form-item label="区间一 (元)" prop="x1">
                <el-input v-model="model.x1" type="number" clearable @change="numToFixedX1"></el-input>
              </el-form-item>
              <i class="fs-23 iconfont">&nbsp;&#xe62b;&nbsp;</i>
              <el-input v-model="model.x2" type="number" disabled style="width: 200px"></el-input>
            </div>
            <el-form-item label="概率" prop="p1">
              <el-input v-model="model.p1" type="number" clearable @change="calProbP1"></el-input>
            </el-form-item>
            <div class="flex-section">
              <el-form-item label="区间二 (元)" prop="x2">
                <el-input v-model="model.x2" type="number" clearable @change="numToFixedX2"></el-input>
              </el-form-item>
              <i class="fs-23 iconfont">&nbsp;&#xe62b;&nbsp;</i>
              <el-input v-model="model.x3" type="number" disabled style="width: 200px"></el-input>
            </div>
            <el-form-item label="概率" prop="p2">
              <el-input v-model="model.p2" type="number" clearable @change="calProbP2"></el-input>
            </el-form-item>
            <div class="flex-section">
              <el-form-item label="区间三 (元)" prop="x3">
                <el-input v-model="model.x3" type="number" clearable @change="numToFixedX3"></el-input>
              </el-form-item>
              <i class="fs-23 iconfont">&nbsp;&#xe62b;&nbsp;</i>
              <el-form-item label-width="0" prop="x4">
                <el-input v-model="model.x4" type="number" clearable style="width: 200px" @change="numToFixedX4"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="概率" prop="p3">
              <el-input v-model="model.p3" type="number" disabled></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { deformatPrice, formatPrice } from '@/assets/util'
export default {
  name: 'GoodsCreate',
  data () {
    let validateX1 = (rule, value, callback) => {
      console.log('validateX1', value)
      if (isNaN(value)) {
        return callback(new Error('请输入区间一的下限'))
      } else if (value > parseFloat(this.model.x2) - 0.01) {
        return callback(new Error('区间一的下限至少比上限小0.01'))
      }
      callback()
    }
    let validateX2 = (rule, value, callback) => {
      console.log('validateX2', value)
      if (!value) {
        return callback(new Error('请输入区间二的下限'))
      } else if (isNaN(value)) {
        return callback(new Error('请输入数字'))
      } else if (value < parseFloat(this.model.x1) + 0.01) {
        return callback(new Error('区间一的上限至少比下限大0.01'))
      } else if (value > parseFloat(this.model.x3) - 0.01) {
        return callback(new Error('区间二的下限至少比上限小0.01'))
      }
      callback()
    }
    let validateX3 = (rule, value, callback) => {
      console.log('validateX2', value)
      if (!value) {
        return callback(new Error('请输入区间三的下限'))
      } else if (isNaN(value)) {
        return callback(new Error('请输入数字'))
      } else if (value < parseFloat(this.model.x2) + 0.01) {
        return callback(new Error('区间二的上限至少比下限大0.01'))
      } else if (value > parseFloat(this.model.x4) - 0.01) {
        return callback(new Error('区间的下限至少比上限小0.01'))
      }
      callback()
    }
    let validateX4 = (rule, value, callback) => {
      console.log('validateX2', value)
      if (!value) {
        return callback(new Error('请输入区间三的上限'))
      } else if (isNaN(value)) {
        return callback(new Error('请输入数字'))
      } else if (value < parseFloat(this.model.x3) + 0.01) {
        return callback(new Error('区间的上限至少比下限大0.01'))
      }
      callback()
    }
    let validateP = (rule, value, callback) => {
      console.log('validateP', value)
      if (!value) {
        return callback(new Error('请输入区间概率'))
      } else if (isNaN(value)) {
        return callback(new Error('请输入数字'))
      } else if (parseFloat(this.model.p1) + parseFloat(this.model.p2) >= 1.0) {
        return callback(new Error('输入的概率之和不能大于1'))
      }
      callback()
    }
    return {
      loading: false,
      model: {
        newUser: 5,
        helperNum: 2,
        x1: 0,
        x2: 0,
        x3: 0,
        x4: 0,
        p1: 0,
        p2: 0,
        p3: 1
      },
      rules: {
        x1: [
          { required: true, validator: validateX1, trigger: 'blur' }
        ],
        x2: [
          { required: true, validator: validateX2, trigger: 'blur' }
        ],
        x3: [
          { required: true, validator: validateX3, trigger: 'blur' }
        ],
        x4: [
          { required: true, validator: validateX4, trigger: 'blur' }
        ],
        p1: [
          { required: true, validator: validateP, trigger: 'blur' }
        ],
        p2: [
          { required: true, validator: validateP, trigger: 'blur' }
        ],
        p3: [
          { required: true, validator: validateP, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    calProbP1 (val) {
      this.model.p1 = parseFloat(val).toFixed(2)
      this.model.p3 = (1 - this.model.p1 - this.model.p2).toFixed(2)
    },
    calProbP2 (val) {
      this.model.p2 = parseFloat(val).toFixed(2)
      this.model.p3 = (1 - this.model.p1 - this.model.p2).toFixed(2)
    },
    numToFixedX1 (val) {
      this.model.x1 = parseFloat(val).toFixed(2)
    },
    numToFixedX2 (val) {
      this.model.x2 = parseFloat(val).toFixed(2)
    },
    numToFixedX3 (val) {
      this.model.x3 = parseFloat(val).toFixed(2)
    },
    numToFixedX4 (val) {
      this.model.x4 = parseFloat(val).toFixed(2)
    },
    save () {
      let that = this
      this.$refs.settingForm.validate((valid) => {
        if (valid) {
          that.loading = true
          that.$axios.post('/insider/settings/', {
            instances: [{
              func: 'set_scan_incoming_param',
              params: {
                newUser: 5,
                helperNum: 2,
                x1: deformatPrice(that.model.x1),
                x2: deformatPrice(that.model.x2),
                x3: deformatPrice(that.model.x3),
                x4: deformatPrice(that.model.x4),
                p1: parseFloat(that.model.p1),
                p2: parseFloat(that.model.p2),
                p3: parseFloat(that.model.p3)
              }
            }]
          })
            .then(res => {
              console.log(res.data)
              if (res.data[0].code === 200) {
                that.$message.success('设置成功')
              } else {
                that.$message.error('设置失败')
              }
              that.loading = false
            })
        } else {
          that.$message.error('请填写所有项目')
        }
      })
    },
    handleMerchantChange (uuid) {
      this.brand = []
      let that = this
      this.merchant.forEach(item => {
        if (item.uuid === uuid) {
          that.brand = item.brand
        }
      })
      this.model.brand = ''
    },
    getData () {
      let that = this
      this.$axios.post('/insider/settings/', {
        instances: [{
          func: 'get_current_scan_incoming_param',
          params: {}
        }]
      })
        .then(res => {
          console.log('get_current_scan_incoming_param', res.data)
          if (res.data.length >= 1 && res.data[0].code === 200) {
            let value = res.data[0].value
            that.model = {
              newUser: 5,
              helperNum: 2,
              x1: formatPrice(value.x1),
              x2: formatPrice(value.x2),
              x3: formatPrice(value.x3),
              x4: formatPrice(value.x4),
              p1: value.p1,
              p2: value.p2,
              p3: value.p3
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
