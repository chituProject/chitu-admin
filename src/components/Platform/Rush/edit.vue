<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="submit">保存</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-form ref="form" :model="form" :rules="rules" class="demo-table-expand" label-width="120px" label-position="left">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品 SPU 编号">
                <el-input disabled :value="form.spu_id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品 SKU 编号">
                <el-input disabled :value="form.sku_id"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
      <spu :spu="form.spu_id" :sku="form.sku_id" v-if="form.spu_id"></spu>
    </div>
  </div>
</template>

<script>
import SPUDetail from './spu'

export default {
  components: {
    spu: SPUDetail
  },
  props: ['id'],
  data () {
    return {
      loading: false,
      form: {
        time: null,
        rush_number: '',
        rush_price: '',
        rush_offpay_limit: ''
      },
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
      }
    }
  },
  mounted () {
    this.getTimes()
    this.fetchData()
    this.$watch('id', () => { this.fetchData() })
  },
  methods: {
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
        this.$axios.patch(`/insider/goods_rush/${this.id}/`, params)
          .then(() => {
            this.goBack()
          })
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    fetchData () {
      if (!this.id) return
      this.$axios.get(`/insider/goods_rush/${this.id}/`)
        .then(res => {
          this.form = {
            ...res.data,
            rush_price: res.data.rush_price / 100,
            time: res.data.time.id
          }
        })
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
