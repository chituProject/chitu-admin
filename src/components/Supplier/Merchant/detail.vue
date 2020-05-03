<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <template v-if="isAudit">
          <el-button plain size="medium" v-can:edit="'Supplier'" @click.stop="auditYes()" class="action_button">审核通过</el-button>
          <el-button plain size="medium" v-can:edit="'Supplier'" @click.stop="auditNo()" class="action_button">审核不通过</el-button>
        </template>
        <template v-else>
          <router-link v-can:edit="'Supplier'" :to="'/supplier/merchant/'+ uuid + '/withdrawal'" class="action_button"><el-button plain size="medium">提现记录</el-button></router-link>
          <el-button v-can:edit="'Supplier'" plain size="medium" @click.stop="changeWithdrawalPeriod" class="action_button">提现周期修改</el-button>
        </template>
        <router-link v-can:edit="'Supplier'" :to="'/supplier/merchant/' + uuid + '/edit'" class="action_button"><el-button class="blue_button_filled" size="medium">资料修改</el-button></router-link>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-card shadow="never" class="card">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="title">商家信息</div>
              <el-form class="form" label-width="160px" label-position="left">
                <el-form-item label="商家ID">
                  <span>{{model.uuid}}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>{{status[model.status]}}</span>
                </el-form-item>
                <el-form-item label="商家名称">
                  <span>{{model.name}}</span>
                </el-form-item>
                <el-form-item label="统一社会信用代码">
                  <span>{{model.credit_code}}</span>
                </el-form-item>
                <el-form-item label="主营类目">
                  <span>{{model.main_category}}</span>
                </el-form-item>
                <el-form-item label="商家地址">
                  <span>{{model.address}}</span>
                </el-form-item>
                <el-form-item label="商家地址类型">
                  <span>{{selectToLabel(model.address_type, 'address_type')}}</span>
                </el-form-item>
                <el-form-item label="商家位置(经度)">
                  <span>{{model.latitude}}</span>
                </el-form-item>
                <el-form-item label="商家位置(纬度)">
                  <span>{{model.longitude}}</span>
                </el-form-item>
                <el-form-item label-width="0">
                  <qqmap :latitude="model.latitude" :longitude="model.longitude" :zoom="15" disabled style="height: 200px"></qqmap>
                </el-form-item>
                <el-form-item label="营业执照类型">
                  <span>{{selectToLabel(model.license_type, 'license_type')}}</span>
                </el-form-item>
                <el-form-item label="营业执照期限">
                  <span>{{model.license_begin  | toDate }}</span> - <span>{{model.license_end  | toDate }}</span>
                </el-form-item>
                <el-form-item label="营业执照经营范围">
                  <span>{{model.license_range}}</span>
                </el-form-item>
              </el-form>
              <div class="title">联系人信息</div>
              <el-form class="form" label-width="160px" label-position="left">
                <el-form-item label="联系人姓名">
                  <span>{{model.contact_name}}</span>
                </el-form-item>
                <el-form-item label="联系人职位">
                  <span>{{model.contact_position}}</span>
                </el-form-item>
                <el-form-item label="联系人电话">
                  <span>{{model.contact_tel}}</span>
                </el-form-item>
                <el-form-item label="联系人邮件">
                  <span>{{model.contact_email}}</span>
                </el-form-item>
                <el-form-item label="联系人身份证号">
                  <span>{{model.contact_id_no}}</span>
                </el-form-item>
                <el-form-item label="联系人类型">
                  <span>{{selectToLabel(model.contact_type, 'contact_type')}}</span>
                </el-form-item>
              </el-form>
              <div class="title">银行卡信息</div>
              <el-form class="form" label-width="160px" label-position="left">
                <el-form-item label="银行名">
                  <span>{{model.default_card_bank}}</span>
                </el-form-item>
                <el-form-item label="提现卡号">
                  <span>{{model.default_card_no}}</span>
                </el-form-item>
                <el-form-item label="开户人">
                  <span>{{model.default_card_name}}</span>
                </el-form-item>
              </el-form>
              <div class="title">资金安全</div>
              <el-form class="form" label-width="160px" label-position="left">
                <el-form-item label="提现周期">
                  <span>{{model.withdraw_period}}天</span>
                </el-form-item>
                <el-form-item label="累计提现金额">
                  <span>{{(model.history_withdrawal / 100).toFixed(2)}}元</span>
                </el-form-item>
                <el-form-item label="可提现金额">
                  <span>{{(model.withdrawable_incoming / 100).toFixed(2)}}元</span>
                </el-form-item>
                <el-form-item label="不可提现金额">
                  <span>{{(model.unwithdrawable_amount / 100).toFixed(2)}}元</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form label-width="160px" label-position="left">
                <el-form-item label="联系人身份证正面">
                  <img-single-upload
                    :editable="false"
                    :customSize="true"
                    style="width: 360px; float: left;"
                    :value="model.contact_id_card_front">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="联系人身份证反面">
                  <img-single-upload
                    :editable="false"
                    :customSize="true"
                    style="width: 360px; float: left;"
                    :value="model.contact_id_card_back">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="商家LOGO">
                  <img-single-upload
                    :editable="false"
                    :customSize="true"
                    style="width: 120px; float: left;"
                    :value="model.logo">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="资质许可证：">
                  <img-single-upload
                    :editable="false"
                    :customSize="true"
                    style="width: 240px; float: left;"
                    :value="model.qualification_permit">
                  </img-single-upload>
                </el-form-item>
                <el-form-item v-for="picture in pictures" :key="picture" :label="pictureCaptions.public[picture]">
                  <img-single-upload
                    :editable="false"
                    :customSize="true"
                    style="width: 240px; float: left;"
                    :value="model[picture]">
                  </img-single-upload>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import ImgSingleUpload from '@/components/ImgSingleUpload'
import constants from '@/assets/constants'
import {contactTypeList, addrTypeList, licenseTypeList, storeTypeList, pictureCaptions} from '@/assets/sicpay/options'
import QQMapVue from '@/components/QQMap'

export default {
  name: 'SupplierDetail',
  components: {
    ImgSingleUpload,
    'qqmap': QQMapVue
  },
  filters: {
    toDate (value) {
      if (!value) return ''
      const y = value.substring(0, 4)
      const m = value.substring(4, 6)
      const d = value.substring(6, 8)
      return `${y}-${m}-${d}`
    }
  },
  data () {
    return {
      model: {},
      loading: false,
      status: constants.SCENE_STATUS,
      contactTypeList,
      addrTypeList,
      licenseTypeList,
      storeTypeList,
      pictureCaptions,
      pictures: ['license_picture', 'account_picture', 'store_picture', 'facade_picture', 'cashier_picture']
    }
  },
  computed: {
    isAudit: function () {
      return this.model && this.model.status && this.model.status === 'UNAUDITED'
    }
  },
  props: {
    uuid: {
      type: String
    }
  },
  methods: {
    goBack () {
      window.open('javascript:window.open("", "_self", "");window.close();', '_self')
    },
    getDetail () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/merchant/' + this.uuid + '/')
        .then(res => {
          console.log(res.data)
          that.model = res.data
        })
        .finally(() => {
          that.loading = false
        })
    },
    doAudit (action, reason) {
      const that = this
      let form = {}
      if (reason) {
        form = {
          action: action,
          reason: reason
        }
      } else {
        form = {
          action: action
        }
      }
      this.$axios.post('/insider/merchant/' + this.uuid + '/audit/', form).then(() => {
        that.goBack()
      })
    },
    auditNo () {
      const that = this
      this.$prompt('不通过原因', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        that.doAudit(0, value)
      }).catch(() => {})
    },
    auditYes () {
      const that = this
      this.$confirm('确认要审核通过吗?', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.doAudit(1, null)
      })
    },
    changeWithdrawalPeriod () {
      const that = this
      this.$prompt('请在下面输入新的提现周期，只有修改提现周期之后生成的订单才会按照新的提现周期计算', '提现周期修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+$/,
        inputErrorMessage: '请输入正整数'
      }).then(({ value }) => {
        that.loading = true
        that.$axios.patch('/insider/merchant/' + that.uuid + '/', {
          withdraw_period: value
        }).then((res) => {
          that.model = res.data
        }).finally(() => {
          that.loading = false
        })
      }).catch(() => {})
    },
    selectToLabel (value, type) {
      let list
      switch (type) {
        case 'contact_type': list = this.contactTypeList; break
        case 'address_type': list = this.addrTypeList; break
        case 'license_type': list = this.licenseTypeList; break
      }
      return (list.find(i => i.value === value) || {}).label
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    margin-top: 25px;
    margin-bottom: 10px;
    margin-left: 15px;
  }
  .form {
    text-align: left;
    margin-left: 15px;
  }
  .form .el-form-item {
    margin-bottom: 0;
  }
  .action_button + .action_button {
    margin-left: 10px;
  }
</style>
