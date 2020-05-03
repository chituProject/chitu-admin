<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="submit">保存</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div class="title">
        {{ uuid ? '编辑' : '新增' }}{{ type == 'ONLINE' ? '线上' : '线下' }}合伙人
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="130px" label-position="left">
        <div class="card-container">
          <div style="max-width: 650px; text-align: left">
            <div class="title">申请人信息</div>
            <el-form-item label="商户类型" prop="sicpay_type">
              <el-radio-group :disabled="!isAdd" v-model="form.sicpay_type">
                <el-radio label="PRIVATE">对私</el-radio>
                <el-radio label="PUBLIC">对公</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商户名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="所有人姓名" prop="username">
              <el-input :disabled="!isAdd" v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="邮件地址" prop="email">
              <el-input v-model="form.email" type="email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idcard">
              <el-input :disabled="!isAdd" v-model="form.idcard"></el-input>
            </el-form-item>
            <el-form-item label="联系人类型" prop="contact_type">
              <el-select :disabled="!isAdd" v-model="form.contact_type" placeholder="请选择">
                <el-option v-for="item in contactTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- 店铺信息 -->
            <div class="title">店铺信息</div>
            <el-form-item label="店铺经营类型" prop="category">
              <el-select v-model="form.category" placeholder="请选择">
                <el-option v-for="item in storeTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <div v-if="form.sicpay_type !== 'PRIVATE'">
              <el-form-item label="工商营业执照号" prop="license">
                <el-input :disabled="!isAdd" v-model="form.license"></el-input>
              </el-form-item>
              <el-form-item label="营业执照类型" prop="license_type">
                <el-select :disabled="!isAdd" v-model="form.license_type" placeholder="请选择">
                  <el-option v-for="item in licenseTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="营业执照期限" required>
                <el-col :span="11">
                  <el-form-item prop="license_begin">
                    <el-date-picker :disabled="!isAdd" type="date" placeholder="请选择开始日期" v-model="form.license_begin" value-format="yyyyMMdd"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="license_end">
                    <el-date-picker :disabled="!isAdd" type="date" placeholder="请选择结束日期" v-model="form.license_end" value-format="yyyyMMdd"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="营业执照经营范围" prop="license_range" required>
                <el-input :disabled="!isAdd" type="textarea" v-model="form.license_range"></el-input>
              </el-form-item>
            </div>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="店铺地址" prop="area">
                  <el-cascader
                    expand-trigger="hover"
                    size="large"
                    filterable
                    v-if="isAdd"
                    :options="allRegions"
                    v-model="form.area">
                  </el-cascader>
                  <el-input v-else disabled v-model="form.area"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="0" prop="address">
                  <el-input :disabled="!isAdd" v-model="form.address"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="地址类型" prop="address_type">
              <el-select :disabled="!isAdd" v-model="form.address_type" placeholder="请选择">
                <el-option v-for="item in addrTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude"></el-input>
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude"></el-input>
            </el-form-item>
            <qqmap :latitude.sync="form.latitude" :longitude.sync="form.longitude"></qqmap>
            <div class="title">默认提现银行卡</div>
            <el-form-item label="提现方式" prop="payment_type">
              <el-radio-group :disabled="!isAdd" v-model="form.payment_type">
                <el-radio label="AUTO">自动提现</el-radio>
                <el-radio label="MANUAL">手动提现</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="银行名" prop="default_card_bank">
              <el-select :disabled="!isAdd" v-model="form.default_card_bank" placeholder="请选择">
                <el-option v-for="item in bankTypeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="银行卡号" prop="default_card_no">
              <el-input :disabled="!isAdd" v-model="form.default_card_no" type="number"></el-input>
            </el-form-item>
            <el-form-item label="银行卡开户人" prop="username" v-if="form.sicpay_type === 'PRIVATE'">
              <el-input :disabled="!isAdd" v-model="form.username"></el-input>
              <div v-if="form.sicpay_type === 'PRIVATE'" style="margin-bottom: 22px; margin-left: 130px;">
                对私账户开户人需与申请人相同
              </div>
            </el-form-item>
            <el-form-item label="银行卡开户人" prop="default_card_name" v-else>
              <el-input :disabled="!isAdd" v-model="form.default_card_name"></el-input>
            </el-form-item>
            <el-form-item label="提现周期（天）" prop="withdraw_period">
              <el-input :disabled="!isAdd" v-model.number="form.withdraw_period"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="card-container">
          <!-- 对私、对公都需要 -->
          <el-form-item prop="logo" label="商标">
            <img-single-upload
              ref="logo"
              :uuid="uuid"
              root="reseller"
              path="logo"
              v-model="form['logo']">
            </img-single-upload>
          </el-form-item>
          <el-form-item v-for="(val, key) in pictureCaptions.shared" :key="key" :prop="key"
                        :label="pictureCaptions.shared[key]" :rules="{
                        required: true, message: '请上传图片', trigger: 'change'}"
          >
            <img-single-upload
              :ref="key"
              :uuid="uuid"
              root="reseller"
              :path="key"
              :editable="isAdd"
              v-model="form[key]">
            </img-single-upload>
          </el-form-item>
          <div v-if="form.sicpay_type === 'PRIVATE'">
            <el-form-item v-for="(val, key) in pictureCaptions.private" :key="key" :prop="key"
                          :label="pictureCaptions.private[key]" :rules="{
                          required: true, message: '请上传图片', trigger: 'change'}"
            >
              <img-single-upload
                :ref="key"
                :uuid="uuid"
                root="reseller"
                :path="key"
                :editable="isAdd"
                v-model="form[key]">
              </img-single-upload>
            </el-form-item>
          </div>
          <div v-if="form.sicpay_type === 'PUBLIC'">
            <el-form-item v-for="(val, key) in pictureCaptions.public" :key="key" :prop="key"
                          :label="pictureCaptions.public[key]"  :rules="{
                          required: true, message: '请上传图片', trigger: 'change'}"
            >
              <img-single-upload
                :ref="key"
                :uuid="uuid"
                root="reseller"
                :path="key"
                :editable="isAdd"
                v-model="form[key]">
              </img-single-upload>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import UUID from 'uuid-js'
import {contactTypeList, addrTypeList, licenseTypeList, storeTypeList, pictureCaptions} from '@/assets/sicpay/options'
import { bankCode as bankTypeList } from '@/assets/sicpay/bankcode'
import { regionNameToAreaCode } from '@/assets/sicpay/geocode'
import QQMapVue from '@/components/QQMap'

export default {
  name: 'SceneAddEdit',
  components: {
    ImgSingleUpload,
    'qqmap': QQMapVue
  },
  data () {
    return {
      loading: false,
      isAdd: true,
      scene_uuid: null,
      form: {
        sicpay_type: '',
        name: '',
        username: '',
        phone: '',
        email: '',
        idcard: '',
        contact_type: '',
        license: '',
        license_type: '',
        license_begin: '',
        license_end: '',
        license_range: '',
        category: '',
        area: [],
        address: '',
        longitude: 116.23,
        latitude: 39.54,
        address_type: '',
        withdraw_period: 30,
        default_card_no: '',
        default_card_name: '',
        default_card_bank: '',
        payment_type: '',

        logo: '',
        idcard_front: '',
        idcard_back: '',
        license_picture: '',
        account_picture: '',
        store_picture: '',
        facade_picture: '',
        cashier_picture: '',
        default_card_picture: ''
      },
      allRegions: regionData,
      rules: {
        sicpay_type: [
          { required: true, message: '请选择商户类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入店铺名', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮件地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        contact_type: [
          { required: true, message: '请选择联系人类型', trigger: 'change' }
        ],
        license: [
          { required: true, message: '请输入营业执照', trigger: 'blur' }
        ],
        license_type: [
          { required: true, message: '请输入营业执照类型', trigger: 'change' }
        ],
        license_range: [
          { required: true, message: '请输入营业执照经营范围', trigger: 'blur' }
        ],
        license_begin: [
          { required: true, message: '请输入营业执照开始日期', trigger: 'change' }
        ],
        license_end: [
          { required: true, message: '请输入营业执照结束日期', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入店铺地址', trigger: 'blur' }
        ],
        address_type: [
          { required: true, message: '请选择地址类型', trigger: 'change' }
        ],
        default_card_bank: [
          { required: true, message: '请选择银行名', trigger: 'change' }
        ],
        default_card_no: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' }
        ],
        default_card_name: [
          { required: true, message: '请输入开户人姓名', trigger: 'blur' }
        ],
        payment_type: [
          { required: true, message: '请选择提现方式', trigger: 'change' }
        ],
        withdraw_period: [
          { required: true, message: '请输入提现周期', trigger: 'blur' }
        ]
      },
      contactTypeList,
      addrTypeList,
      licenseTypeList,
      storeTypeList,
      pictureCaptions,
      bankTypeList
    }
  },
  props: {
    uuid: {
      type: String
    },
    type: {
      type: String
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/reseller/' + this.uuid + '/')
        .then(res => {
          that.initForm(res.data)
        })
        .finally(() => {
          that.loading = false
        })
    },
    initForm (scene) {
      if (scene) {
        this.isAdd = false
        Object.assign(this.form, scene)
        this.form.area = scene.area
      } else {
        this.isAdd = true
        this.scene_uuid = UUID.create(1).hex
      }
    },
    onChangeSicpayType (type) {
      let imagesToDelete
      if (type !== 'PRIVATE') {
        imagesToDelete = Object.keys(this.pictureCaptions.private)
      }
      if (type !== 'PUBLIC') {
        imagesToDelete = Object.keys(this.pictureCaptions.public)
      }
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(key, this.form) && imagesToDelete.includes(key)) {
          this.$set(this.form, key, '')
        }
      }
    },
    submit () {
      const that = this
      if (this.form.sicpay_type === 'PRIVATE') {
        this.form.default_card_name = this.form.username
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true
          const areaText = this.isAdd ? this.c2t(that.form.area).join(' ') : this.form.area
          const params = {
            ...that.form,
            area: areaText,
            area_code: regionNameToAreaCode(areaText),
            default_card_bank_code: (bankTypeList.find(i => i.name === that.form.default_card_bank) || {}).code
          }
          that.confirmPicChange()
          if (!that.isAdd) {
            that.$axios.patch('/insider/reseller/' + that.uuid + '/', that.deleteEmptyString(params))
              .then(() => {
                that.goBack()
              }).finally(() => {
                that.loading = false
              })
          } else {
            that.$axios.post('/insider/reseller/', that.deleteEmptyString({
              type: that.type,
              uuid: that.scene_uuid,
              status: 'UNAUDITED',
              ...params
            })).then(() => {
              that.goBack()
            }).finally(() => {
              that.loading = false
            })
          }
        } else {
          this.$message.error('请填写所有项目!')
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
    },
    c2t (list) {
      const result = []
      result[0] = CodeToText[list[0]]
      result[1] = CodeToText[list[1]]
      result[2] = CodeToText[list[2]]
      return result
    },
    t2c (list) {
      try {
        const result = []
        result[0] = TextToCode[list[0]].code
        result[1] = TextToCode[list[0]][list[1]].code
        result[2] = TextToCode[list[0]][list[1]][list[2]].code
        return result
      } catch (e) {
        return []
      }
    },
    confirmPicChange () {
      const sharedPics = Object.keys(this.pictureCaptions.shared)
      const publicPics = Object.keys(this.pictureCaptions.public)
      const privatePics = Object.keys(this.pictureCaptions.private)
      sharedPics.forEach(pic => this.$refs[pic][0].confirmChanges())
      if (this.form.sicpay_type === 'PUBLIC') {
        publicPics.forEach(pic => this.$refs[pic][0].confirmChanges())
      }
      if (this.form.sicpay_type === 'PRIVATE') {
        privatePics.forEach(pic => this.$refs[pic][0].confirmChanges())
      }
    },
    cancelPicChange () {
      const sharedPics = Object.keys(this.pictureCaptions.shared)
      const publicPics = Object.keys(this.pictureCaptions.public)
      const privatePics = Object.keys(this.pictureCaptions.private)

      const cancel = (ref) => {
        if (!ref) return
        if (Array.isArray(ref)) {
          ref.forEach(i => i.cancelChanges())
        } else {
          ref.cancelChanges()
        }
      }

      sharedPics.forEach(pic => {
        cancel(this.$refs[pic])
        this.form[pic] = ''
      })
      if (this.form.sicpay_type === 'PUBLIC') {
        publicPics.forEach(pic => {
          cancel(this.$refs[pic])
          this.form[pic] = ''
        })
      }
      if (this.form.sicpay_type === 'PRIVATE') {
        privatePics.forEach(pic => {
          cancel(this.$refs[pic])
          this.form[pic] = ''
        })
      }
    }
  },
  created () {
    if (this.uuid) {
      this.getData()
    } else {
      this.initForm(null)
    }
  },
  // 若没有提交申请，在当前页面销毁之前删除上传过的图片
  // TODO 浏览器后退、直接关闭和刷新网页，beforeDestroy不会被调用
  beforeDestroy () {
    if (!this.submitted) {
      this.cancelPicChange()
    }
  }
}
</script>

<style scoped>

  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    margin: 10px;
  }
  .card-container {
    padding: 20px;
  }
  .filter-container {
    padding: 12px;
  }
  .date-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between
  }
</style>
