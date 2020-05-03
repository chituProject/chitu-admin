<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button class="blue_button_filled" size="medium" v-if="form.spu" @click="goSpu">编辑SPU</el-button>
        <el-button type="primary" size="medium" @click="submit" :disabled="disabledButton">保存</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-form ref="form" :model="form" :rules="rules" class="demo-table-expand" label-width="120px" label-position="left">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品 SPU 编号" prop="spu_id">
                <el-input v-model.number="form.spu_id" @input="form.sku_id = null"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择 SKU 编号" prop="sku_id">
                <el-select v-model="form.sku_id">
                  <el-option v-for="item of sku" :key="item.id" :label="item.id" :value="item.id">
                    <div @click="change(item)">
                      <span style="font-size: 13px">{{ item.id }}</span>
                      <span style="float: right;font-size: 13px">{{ status[item.shelf_status] }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="所属主页" prop=“homepage”>
                <el-select v-model="form.homepage">
                  <el-option v-for="time of times" :key="time.id"
                             :label="time.start + ' - ' + time.end" :value="time.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="抢购时间段" prop=“time”>
                <el-select v-model="form.time">
                  <el-option v-for="time of times" :key="time.id"
                             :label="`${time.start_at} - ${time.end_at} (主页${time.homepage})`" :value="time.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抢购数量" prop=“rush_number”>
                <el-input type="number" v-model.number="form.rush_number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抢购价格" prop=“rush_price”>
                <el-input type="number" v-model.number="form.rush_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="赠送免单金" prop=“rush_offpay_limit”>
                <el-input type="number" v-model.number="form.rush_offpay_limit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <spu :spu="form.spu_id" :sku="form.sku_id" v-if="form.spu_id" @sku="sku = $event" @spu="onChange"></spu>
    </div>
  </div>
</template>

<script>
import SPUDetail from './spu'
import constants from '@/assets/constants'

export default {
  components: {
    spu: SPUDetail
  },
  data () {
    return {
      loading: false,
      form: {
        spu_id: '',
        sku_id: null,
        time: null,
        rush_number: '',
        rush_price: '',
        rush_offpay_limit: ''
      },
      status: constants.SHELF_STATUS,
      sku: [],
      times: [{
        id: 0,
        start_at: '00:00',
        end_at: '08:00'
      }, {
        id: 1,
        start_at: '08:00',
        end_at: '20:00'
      }],
      rules: {
        spu_id: [
          {required: true, message: '请填写SPU编号', trigger: 'blur'}
        ],
        sku_id: [
          {required: true, message: '请选择SKU编号', trigger: 'blur'}
        ],
        time: [
          {required: true, message: '请选择抢购时间段', trigger: 'change'}
        ],
        rush_price: [
          {required: true, message: '请填写抢购价格', trigger: 'blur'},
          {
            validator (rule, value, callback) {
              var reg = /^-?\d{1,5}(?:\.\d{1,3})?$/
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('请输入大于零小于十万不超过三位小数的数字'))
              }
            },
            trigger: 'blur'
          }
        ],
        rush_number: [
          {required: true, message: '请填写抢购数量', trigger: 'blur'},
          {
            validator (rule, value, callback) {
              if (Number.isInteger(Number(value)) && Number(value) > 0) {
                callback()
              } else {
                callback(new Error('请输入一个正整数'))
              }
            },
            trigger: 'blur'
          }
        ],
        rush_offpay_limit: [
          {required: true, message: '请填写抢购反免单金数额', trigger: 'blur'},
          {
            validator (rule, value, callback) {
              var reg = /^-?\d{1,5}(?:\.\d{1,3})?$/
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('请输入大于零小于十万不超过三位小数的数字'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      disabledButton: false
    }
  },
  mounted () {
    this.getTimes()
  },
  methods: {
    onChange (item) {
      if (!item) return
      if (item.shelf_status !== 'ON') {
        this.disabledButton = true
        this.$message.error('该商品状态未上架！')
        return
      }
      this.disabledButton = false
    },
    change (item) {
      if (!item) return
      if (item.shelf_status !== 'ON') {
        this.disabledButton = true
        this.$message.error('选择已上架sku！')
        return
      }
      this.disabledButton = false
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message.error('请填写所有信息！')
          return
        }
        const params = {
          ...this.form,
          rush_price: this.form.rush_price * 100,
          rush_offpay_limit: this.form.rush_offpay_limit * 100
        }
        this.$axios.post('/insider/goods_rush/', params)
          .then(() => {
            this.goBack()
          })
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    goSpu () {
      window.open(window.location.origin + '/#/goods/detail/' + this.form.spu)
    },
    async getTimes () {
      this.loading = true
      try {
        const res = await this.$axios.get(`/insider/homepage_rush_time/`)
        this.times = res.data
        // this.times.map(item => this.$axios.get('/insider/homepage_item/'))
      } catch (e) {
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .el-input {
    width: 200px;
  }
  .demo-table-expand {
    padding: 20px;
  }
</style>
