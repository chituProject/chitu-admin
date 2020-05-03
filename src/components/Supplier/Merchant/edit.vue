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
        <el-card shadow="never" class="card">
          <el-form :model="form" :rules="rules" ref="form" class="demo-table-expand" label-width="140px" label-position="left">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="联系人姓名" prop="contact_name">
                  <el-input v-model="form.contact_name"></el-input>
                </el-form-item>
                <el-form-item label="联系人身份证号" prop="contact_id_no">
                  <el-input type="text" id="contact_id_no" v-model="form.contact_id_no" clearable></el-input>
                </el-form-item>
                <el-form-item label="联系人邮箱" prop="contact_email">
                  <el-input type="email" id="contact_email" v-model="form.contact_email" clearable></el-input>
                </el-form-item>
                <el-form-item label="联系人电话" prop="contact_tel">
                  <el-input type="number" id="contact_tel" v-model="form.contact_tel" clearable></el-input>
                </el-form-item>
                <el-form-item label="联系人职位" prop="contact_position">
                  <el-input v-model="form.contact_position"></el-input>
                </el-form-item>
                <el-form-item label="联系人类型" prop="contact_type">
                  <el-select v-model="form.contact_type" placeholder="请选择">
                    <el-option v-for="item in contactTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="商家名称" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="统一社会信用代码" prop="credit_code">
                  <el-input v-model="form.credit_code"></el-input>
                </el-form-item>
                <el-form-item label="主营类目" prop="main_category">
                  <el-select v-model="form.main_category" placeholder="请选择">
                    <el-option
                      v-for="item in mainCategory"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="营业执照类型" prop="license_type">
                  <el-select v-model="form.license_type" placeholder="请选择">
                    <el-option v-for="item in licenseTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="营业执照开始日期" prop="license_begin">
                  <el-date-picker type="date" placeholder="请选择日期" v-model="form.license_begin" value-format="yyyyMMdd"></el-date-picker>
                </el-form-item>
                <el-form-item label="营业执照结束日期" prop="license_end">
                  <el-date-picker type="date" placeholder="请选择日期" v-model="form.license_end" value-format="yyyyMMdd"></el-date-picker>
                </el-form-item>
                <el-form-item label="营业执照经营范围" prop="license_range">
                  <el-input v-model="form.license_range"></el-input>
                </el-form-item>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="企业地点" prop="area">
                      <el-cascader
                        style="width: 100%"
                        expand-trigger="hover"
                        size="large"
                        filterable
                        :options="allRegions"
                        v-model="form.area">
                      </el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label-width="0" prop="address">
                      <el-input v-model="form.address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="企业位置">
                  <el-row type="flex" justify="space-between">
                    <el-col :span="11">
                      <el-form-item label-width="0" prop="latitude">
                        <el-input v-model="form.latitude" placeholder="经度"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label-width="0" prop="longitude">
                        <el-input v-model="form.longitude" placeholder="纬度"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label-width="0">
                  <qqmap :latitude.sync="form.latitude" :longitude.sync="form.longitude"></qqmap>
                </el-form-item>
                <el-form-item label="地址类型" prop="address_type">
                  <el-select v-model="form.address_type" placeholder="请选择">
                    <el-option v-for="item in addrTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="银行名" prop="default_card_bank">
                  <el-select v-model="form.default_card_bank" placeholder="请选择">
                    <el-option v-for="item in bankTypeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="银行卡号" prop="default_card_no">
                  <el-input v-model="form.default_card_no" type="number"></el-input>
                </el-form-item>
                <el-form-item label="银行卡开户人">
                  <el-input v-model="form.default_card_name"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="联系人身份证正面" prop="contact_id_card_front">
                  <img-single-upload
                    ref="contact_id_card_front"
                    :uuid="uuid"
                    root="merchant"
                    path="contact_id_card_front"
                    :customSize="true"
                    style="width: 360px; float: left;"
                    v-model="form.contact_id_card_front">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="联系人身份证反面" prop="contact_id_card_back">
                  <img-single-upload
                    ref="contact_id_card_back"
                    :uuid="uuid"
                    root="merchant"
                    path="contact_id_card_back"
                    :customSize="true"
                    style="width: 360px; float: left;"
                    v-model="form.contact_id_card_back">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="商家LOGO" prop="logo">
                  <img-single-upload
                    ref="logo"
                    :uuid="uuid"
                    root="merchant"
                    path="logo"
                    :customSize="true"
                    style="width: 160px; float: left;"
                    v-model="form.logo">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="资质许可证" prop="qualification_permit">
                  <img-single-upload
                    ref="qualification_permit"
                    :uuid="uuid"
                    root="merchant"
                    path="qualification_permit"
                    :customSize="true"
                    style="width: 240px; float: left;"
                    v-model="form.qualification_permit">
                  </img-single-upload>
                </el-form-item>
                <el-form-item v-for="(val, key) in pictureCaptions.public" :key="key" :prop="key"
                              :label="pictureCaptions.public[key]"  :rules="{
                              required: true, message: '请上传图片', trigger: 'blur'}"
                >
                  <img-single-upload
                    :ref="key"
                    :uuid="form.uuid"
                    root="merchant"
                    :path="key"
                    :customSize="true"
                    v-model="form[key]">
                  </img-single-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import ImgSingleUpload from '@/components/ImgSingleUpload'
import mainCategory from '%/data/main_category.json'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import {contactTypeList, addrTypeList, licenseTypeList, storeTypeList, pictureCaptions} from '@/assets/sicpay/options'
import { bankCode as bankTypeList } from '@/assets/sicpay/bankcode'
import { regionNameToAreaCode } from '@/assets/sicpay/geocode'
import QQMapVue from '@/components/QQMap'

export default {
  name: 'SupplierEdit',
  components: {
    ImgSingleUpload,
    'qqmap': QQMapVue
  },
  data () {
    return {
      loading: true,
      allRegions: regionData,
      mainCategory,
      form: {
        name: '',
        credit_code: '',
        main_category: '',
        contact_email: '',
        contact_type: '',
        area: [],
        address_type: '',
        detail_address: '',
        longitude: null,
        latitude: null,
        license: '',
        license_begin: '',
        license_range: '',
        license_end: '',
        license_type: '',
        contact_name: '',
        contact_position: '',
        contact_tel: '',
        contact_id_no: '',
        default_card_no: '',
        default_card_name: '',
        default_card_bank: '',

        contact_id_card_front: '',
        contact_id_card_back: '',
        logo: '',
        qualification_permit: '',

        license_picture: '',
        account_picture: '',
        store_picture: '',
        facade_picture: '',
        cashier_picture: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入商家名称', trigger: 'blur' }
        ],
        credit_code: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
        ],
        main_category: [
          { required: true, message: '请选择主营类目', trigger: 'blur' }
        ],
        area: [
          { type: 'array', required: true, message: '请选择地区', trigger: 'blur' }
        ],
        detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        contact_name: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        contact_position: [
          { required: true, message: '请输入联系人职位', trigger: 'blur' }
        ],
        contact_email: [
          { required: true, message: '请输入联系邮箱', trigger: 'blur' }
        ],
        contact_tel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        contact_id_no: [
          { required: true, message: '请输入联系人身份证号', trigger: 'blur' }
        ],
        contact_id_card_front: [
          { type: 'string', required: true, message: '请上传联系人身份证正面', trigger: 'change' }
        ],
        contact_id_card_back: [
          { type: 'string', required: true, message: '请上传联系人身份证反面', trigger: 'change' }
        ],
        default_card_no: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' }
        ],
        default_card_name: [
          { required: true, message: '请输入银行卡开户人姓名', trigger: 'blur' }
        ],
        default_card_bank: [
          { required: true, message: '请选择银行卡开户行', trigger: 'blur' }
        ],
        sicpay_type: [
          { required: true, message: '请选择商户类型', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传商家logo', trigger: 'change' }
        ],
        license: [
          { required: true, message: '请输入营业执照', trigger: 'blur' }
        ],
        license_type: [
          { required: true, message: '请选择营业执照类型', trigger: 'blur' }
        ],
        license_range: [
          { required: true, message: '请输入营业执照经营范围', trigger: 'blur' }
        ],
        license_begin: [
          { required: true, message: '请输入营业执照开始日期', trigger: 'blur' }
        ],
        license_end: [
          { required: true, message: '请输入营业执照结束日期', trigger: 'blur' }
        ],
        contact_type: [
          { required: true, message: '请选择联系人类型', trigger: 'blur' }
        ],
        address_type: [
          { required: true, message: '请选择地址类型', trigger: 'blur' }
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
    }
  },
  methods: {
    update (supplier) {
      Object.assign(this.form, supplier)
      this.form.area = this.t2c(supplier.area.split(' '))
      this.form.area_code = regionNameToAreaCode(supplier.area)
      this.form.address = supplier.detail_address
    },
    goBack () {
      this.$router.go(-1)
    },
    getDetail () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/merchant/' + this.uuid + '/')
        .then(res => {
          console.log(res.data)
          that.update(res.data)
          that.loading = false
        })
        .finally(() => {
          that.loading = false
        })
    },
    submit () {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true
          const areaText = that.c2t(that.form.area).join(' ')
          const params = {
            ...that.form,
            area: areaText,
            detail_address: that.form.address,
            sicpay_type: 'PUBLIC',
            area_code: regionNameToAreaCode(areaText),
            default_card_bank_code: (bankTypeList.find(i => i.name === that.form.default_card_bank) || {}).code
          }
          that.confirmPicChange()
          that.$axios.patch('/insider/merchant/' + that.uuid + '/', that.deleteEmptyString(params))
            .then(() => {
              this.$router.go(-1)
            }).finally(() => {
              that.loading = false
            })
        }
      })
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
    deleteEmptyString (ob) {
      for (var i in ob) {
        if (ob[i] === '') {
          delete ob[i]
        }
      }
      return ob
    },
    confirmPicChange () {
      const publicPics = Object.keys(this.pictureCaptions.public)
      publicPics.forEach(pic => this.$refs[pic][0].confirmChanges())
    },
    cancelPicChange () {
      const publicPics = Object.keys(this.pictureCaptions.public)
      publicPics.forEach(pic => {
        this.$refs[pic][0].cancelChanges()
        this.form[pic] = ''
      })
    }
  },
  mounted () {
    this.getDetail()
  },
  beforeDestroy () {
    console.log('destroyed')
    // confirmChanges 和 cancelChanges 只会执行一个，不需要特殊处理
    this.cancelPicChange()
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
  .el-form-item .el-input {
    max-width: 300px;
  }
  .el-form-item img {
    width: 50%;
  }
</style>
