<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="closeWindow">返回</el-button>
      <div style="float: right;" v-if="model">
        <el-button size="medium" type="primary" v-if="model.status === 'AUDITED'" v-can:edit="'Reseller'" @click="rebut(model)">废弃</el-button>
        <el-button size="medium" type="primary" v-else-if="model.status === 'AUDIT_FAILED'" v-can:edit="'Reseller'" @click="recover(model)">恢复</el-button>
        <div v-else style="display: flex;float: left;margin-right: 10px;">
          <el-button size="medium" type="primary"
                     v-can:edit.disable="'Reseller'"
                     @click="auditYes(model)">通过</el-button>
          <el-button size="medium" type="primary"
                     v-can:edit.disable="'Reseller'"
                     @click="auditNo(model)">不通过</el-button>
        </div>
        <el-button size="medium" @click="edit" v-can:edit="'Reseller'" class="blue_button_filled">编辑</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="title">基本信息</div>
      <div class="card-container">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form class="demo-table-expand" label-width="120px" label-position="left">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="商户合伙人ID">
                    <span>{{ uuid }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <h3 class="subtitle">联系人信息</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="商户合伙人名称">
                    <span>{{model.name}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合伙人微信昵称">
                    <span>{{ model.user && model.user.wechat_nickname }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所有人姓名">
                    <span>{{model.username}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="身份证号码">
                    <span>{{model.idcard}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号码">
                    <span>{{model.phone}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮件地址">
                    <span>{{model.email}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系人类型">
                    <span>{{findItem('contactTypeList', model.contact_type).label}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <h3 class="subtitle">店铺信息</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="店铺经营类型">
                    <span>{{findItem('storeTypeList', model.category).label}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工商营业执照号">
                    <span>{{model.license}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="营业执照类型">
                    <span>{{findItem('licenseTypeList', model.license_type).label}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="营业执照期限">
                    <span>{{model.license_begin | formatDate}}</span> - <span>{{model.license_end | formatDate}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="营业执照范围">
                    <span>{{ model.license_range }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <h3 class="subtitle">银行信息</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="银行名">
                    <span>{{ model.default_card_bank }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="银行卡号">
                    <span>{{ model.default_card_no }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开户人">
                    <span>{{ model.default_card_name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="提现周期">
                    <span>{{model.withdraw_period}}天</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="线下收款金额">
                    <span>{{ model.amount_class.payment_amount | formatPriceFixed }}元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="累计收益">
                    <span>{{ model.amount_class.accumulated_profit | formatPriceFixed }}元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="已入账金额">
                    <span>{{ model.amount_class.recorded_amount | formatPriceFixed }}元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="待入账金额">
                    <span>{{ model.amount_class.unrecorded_amount | formatPriceFixed }}元</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-row>
              <h3 class="subtitle">店铺位置</h3>
              <qqmap :latitude="model.latitude" :longitude="model.longitude" :zoom="15" disabled style="height: 200px"></qqmap>
            </el-row>
            <el-row>
              <h3 class="subtitle">上下级合伙人</h3>
              <div v-if="model.superior_reseller && model.superior_reseller.length > 0">
                <div>
                  上级合伙人：
                  <img :src="model.superior_reseller[0].superior_reseller_wechat_avatar_url" style="width: 20px; height: 20px">
                  {{model.superior_reseller[0].superior_reseller_username}}
                </div>
                <div style="margin-top: 10px">
                  分成比例：{{model.superior_reseller[0].proportion}}%
                </div>
              </div>
              <div v-else-if="model.subordinate_reseller && model.subordinate_reseller.length > 0">
                <div style="display: flex; align-items: center">
                  下级合伙人：
                  <div v-for="(s, i) in model.subordinate_reseller" :key="i" v-if="i < 3" style="display: flex; flex-direction: column; align-items: center; margin-left: 4px">
                    <img :src="s.subordinate_reseller_wechat_avatar_url" style="width: 20px; height: 20px">
                    <div style="margin-top: 4px">{{s.subordinate_reseller_username}}</div>
                  </div>
                </div>
                <el-button size="medium" plain style="margin-top: 10px" @click="manageSuperior">管理下级合伙人</el-button>
              </div>
              <div v-else>
                <div>不存在上下级关系</div>
                <el-button size="medium" plain style="margin-top: 10px" v-can:edit="'Reseller'" @click="addSuperior">新增下级合伙人</el-button>
              </div>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="text-align: right">
          <el-button size="medium" plain @click="showPics = !showPics">查看图片资料</el-button>
        </el-row>
      </div>
      <div class="title" v-show="showPics">图片</div>
      <div class="card-container" v-show="showPics">
        <el-form class="demo-table-expand-2" label-width="130px" label-position="left">
          <el-form-item v-for="(val, key) in pictures.shared" :key="key" :prop="key"
                        :label="pictureCaptions.shared[key]" :rules="{
                        required: true, message: '请上传图片', trigger: 'blur'}"
          >
            <img-single-upload
              :editable="false"
              v-model="model[key]">
            </img-single-upload>
          </el-form-item>
          <template v-if="model.sicpay_type === 'PRIVATE'">
            <el-form-item v-for="(val, key) in pictures.private" :key="key" :prop="key"
                          :label="pictureCaptions.private[key]" :rules="{
                          required: true, message: '请上传图片', trigger: 'blur'}"
            >
              <img-single-upload
                :editable="false"
                v-model="model[key]">
              </img-single-upload>
            </el-form-item>
          </template>
          <template v-if="model.sicpay_type === 'PUBLIC'">
            <el-form-item v-for="(val, key) in pictures.public" :key="key" :prop="key"
                          :label="pictureCaptions.public[key]"  :rules="{
                          required: true, message: '请上传图片', trigger: 'blur'}"
            >
              <img-single-upload
                :editable="false"
                v-model="model[key]">
              </img-single-upload>
            </el-form-item>
          </template>
          <el-form-item label="微信头像">
            <img-single-upload
              :editable="false"
              :value="model.user ? model.user.wechat_avatar_url : ''">
            </img-single-upload>
          </el-form-item>
          <el-form-item label="线下场景二维码">
            <canvas id="qrcode_canvas" width="1039" height="1559" style="width: 100%;"></canvas>
          </el-form-item>
          <el-form-item label="绑定二维码" style="margin-bottom: 0">
            <img-single-upload
              :editable="false"
              :value="model.bind_QRcode">
            </img-single-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="title">绑定用户</div>
      <div class="card-container" style="text-align: left">
        <div v-if="model.bind_users.length > 0">
          <img v-for="(user, index) in model.bind_users" :key="index" :src="user.wechat_avatar_url" class="avatar">
        </div>
        <div v-else>
          无
        </div>
      </div>
      <template v-if="type === 'ONLINE'">
        <div class="title">订单</div>
        <online-order :id="uuid" class="card-container"></online-order>
      </template>
      <template v-if="type === 'OFFLINE'">
        <div class="title">线下收款</div>
        <offline-order :id="uuid" class="card-container"></offline-order>
      </template>
      <div class="title">提现记录</div>
      <withdraw :id="uuid" class="card-container"></withdraw>
    </div>
    <el-dialog
      title="废弃"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" size="small">
        <el-form-item>
          <span>请在下面输入这个场景名称，然后确定进行废弃！</span><br/>
          <span style="font-weight: bold;">场景名称：{{ scene_name_old }}</span>
        </el-form-item>
        <el-form-item>
          <el-input type="text" v-model="scene_name"></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button @click="dialogVisible = false" size="medium">取消</el-button>
          <el-button type="primary" @click="confirmRebut" size="medium" :disabled="isCorrect">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      title="新增下级合伙人"
      :visible.sync="addSuperiorDialogVisible"
      center>
      <el-form ref="AddSuperiorForm" size="small" :model="addSuperiorForm">
        <el-form-item label="商户合伙人ID" prop="subordinate_reseller">
          <el-input type="text" v-model="addSuperiorForm.subordinate_reseller"></el-input>
        </el-form-item>
        <el-form-item label="分成比例" prop="proportion">
          <el-input type="number" v-model.number="addSuperiorForm.proportion"></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button @click="addSuperiorDialogVisible = false" size="medium">取消</el-button>
          <el-button type="primary" @click="confirmAddSuperior" size="medium">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      title="管理下级合伙人"
      :visible.sync="manageSuperiorDialogVisible"
      v-loading="manageSuperiorLoading"
      center>
      <el-table
        stripe
        v-if="model"
        :data="model.subordinate_reseller"
        style="width: 100%">
        <el-table-column
          align="center"
          label="合伙人">
          <template slot-scope="scope">
            <img style="width: 20px; height: 20px" :src="scope.row.subordinate_reseller_wechat_avatar_url">
            <span style="margin-left: 10px;">{{scope.row.subordinate_reseller_username}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="合伙人分成">
          <templatte slot-scope="scope">
            <span>{{scope.row.proportion}}%</span>
          </templatte>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <templatte slot-scope="scope">
            <el-button type="text" @click="removeSuperior(scope.row)">移除关系</el-button>
          </templatte>
        </el-table-column>
      </el-table>
      <div style="text-align: center">
        <el-button size="medium" plain style="margin-top: 10px" @click="addSuperior">新增下级合伙人</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OnlineOrder from './OnlineOrder.vue'
import OfflineOrder from './OfflineOrder.vue'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import Withdraw from './Withdraw.vue'
import {contactTypeList, addrTypeList, licenseTypeList, storeTypeList, pictureCaptions} from '@/assets/sicpay/options'
import QQMapVue from '@/components/QQMap'

export default {
  name: 'ResellerOfficialDetail',
  components: {
    ImgSingleUpload,
    OnlineOrder,
    OfflineOrder,
    Withdraw,
    'qqmap': QQMapVue
  },
  props: {
    uuid: {
      type: String
    },
    type: {
      type: String
    }
  },
  filters: {
    formatDate (date) {
      if (!date) return
      const yyyy = date.slice(0, 4)
      const mm = date.slice(4, 6)
      const dd = date.slice(6, 8)
      return `${yyyy}/${mm}/${dd}`
    }
  },
  data () {
    return {
      loading: false,
      model: null,
      dialogVisible: false,
      scene_name: '',
      scene_name_old: '',
      showPics: false,
      manageSuperiorDialogVisible: false,
      manageSuperiorLoading: false,
      // add superior
      addSuperiorDialogVisible: false,
      addSuperiorForm: {
        subordinate_reseller: '',
        proportion: ''
      },
      addSuperiorRules: {
        subordinate_reseller: [
          { required: true, message: '请输入商户合伙人ID(必须与此商户同类型)', trigger: 'blur' }
        ],
        proportion: [
          { required: true, message: '请输入合伙人分成比例', trigger: 'blur' }
        ]
      },
      contactTypeList,
      addrTypeList,
      licenseTypeList,
      storeTypeList,
      pictureCaptions,

      pictures: {
        shared: {
          idcard_front: '',
          idcard_back: ''
        },
        public: {
        // 对公
          license_picture: '',
          account_picture: '',
          store_picture: '',
          facade_picture: '',
          cashier_picture: ''
        },
        private: {
          // 对私
          default_card_picture: ''
        }
      }
    }
  },
  computed: {
    isCorrect () {
      return !(this.model && this.scene_name === this.model.name)
    }
  },
  methods: {
    closeWindow () {
      window.open('javascript:window.open("", "_self", "");window.close();', '_self')
    },
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/reseller/' + this.uuid + '/')
        .then(res => {
          that.model = res.data
          console.log(that.model)
          that.$nextTick(function () {
            that.drawQRCode()
          })
        })
        .finally(() => {
          that.loading = false
        })
    },
    drawQRCode () {
      let that = this
      let canvas = document.getElementById('qrcode_canvas')
      console.log(canvas)
      let context = canvas.getContext('2d')
      let bg = new Image()
      let img = new Image()
      bg.src = '/static/img/qrcode_background.png'
      img.src = this.model.offline_QRcode
      bg.onload = function () {
        context.drawImage(bg, 0, 0, 1039, 1559)
        context.drawImage(img, 196, 537, 647, 647)
        context.font = 'bold 30px Arial'
        context.textAlign = 'center'
        context.fillStyle = '#e8604f'
        context.fillText(that.model.name, 519, 1532)
      }
      img.onload = function () {
        context.drawImage(bg, 0, 0, 1039, 1559)
        context.drawImage(img, 196, 537, 647, 647)
        context.font = 'bold 30px Arial'
        context.textAlign = 'center'
        context.fillStyle = '#e8604f'
        context.fillText(that.model.name, 519, 1532)
      }
    },
    rebut (item) {
      this.scene_name_old = item.name
      this.dialogVisible = true
    },
    recover (item) {
      console.log(item)
      this.$confirm('确认要恢复场景 ' + item.name + ' 吗?', '恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.doAudit(item, 1, '恢复')
      })
    },
    auditYes (item) {
      this.$confirm('确认要通过场景 ' + item.name + ' 审核吗?', '审核通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.doAudit(item, 1, '审核通过')
      })
    },
    auditNo (item) {
      this.$prompt('不通过原因', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入不通过原因'
      }).then(({ value }) => {
        this.doAudit(item, 0, value)
      }).catch(() => {})
    },
    doAudit (item, action, reason) {
      this.$axios.post('/insider/reseller/' + item.uuid + '/audit/', {
        action: action,
        reason: reason
      }).then(() => {
        this.getData()
        this.$message.success('操作成功')
      })
    },
    confirmRebut () {
      let that = this
      this.$axios.post('/insider/reseller/' + this.uuid + '/audit/', {
        action: 0,
        reason: '废弃'
      }).then(() => {
        that.getData()
        that.$message.success('操作成功')
        that.dialogVisible = false
      })
    },
    edit () {
      this.$router.push(`/reseller/${this.type}/edit/${this.uuid}`)
    },
    manageSuperior () {
      this.manageSuperiorDialogVisible = true
    },
    addSuperior () {
      this.addSuperiorDialogVisible = true
      this.addSuperiorForm.subordinate_reseller = ''
      this.addSuperiorForm.proportion = ''
      if (this.$refs.AddSuperiorForm) {
        this.$refs.AddSuperiorForm.clearValidate()
      }
    },
    confirmAddSuperior () {
      let that = this
      this.$refs.AddSuperiorForm.validate((valid) => {
        if (valid) {
          that.loading = true
          that.$axios.post('/insider/reseller_superior/', {
            superior_reseller: that.uuid,
            subordinate_reseller: that.addSuperiorForm.subordinate_reseller,
            proportion: that.addSuperiorForm.proportion
          }).then(() => {
            that.getData()
          }).finally(() => {
            that.addSuperiorDialogVisible = false
            that.loading = false
          })
        }
      })
    },
    removeSuperior (item) {
      const that = this
      this.$confirm('确认要移除与 ' + item.subordinate_reseller_username + ' 的关系吗?', '移除关系', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.manageSuperiorLoading = true
        that.$axios.delete(`/insider/reseller_superior/${item.id}/`)
          .then(() => {
            that.getData()
          }).finally(() => {
            that.manageSuperiorLoading = false
          })
      })
    },
    findItem (list, value) {
      let listItem = []
      switch (list) {
        case 'addrTypeList':
          listItem = this.addrTypeList
          break
        case 'contactTypeList':
          listItem = this.contactTypeList
          break
        case 'licenseTypeList':
          listItem = this.licenseTypeList
          break
        case 'storeTypeList':
          listItem = this.storeTypeList
          break
        default:
          break
      }
      return listItem.find(i => i.value === value) || {}
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
  .card-container {
    padding: 20px;
    position: relative;
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .demo-table-expand-2 {
    width: 100%;
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(300px, 1fr) );
    grid-column-gap: 10px;
  }
  .demo-table-expand-2 .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    margin-top: 5px;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    margin: 10px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    margin: 4px;
  }
  h3.subtitle {
    font-size: 16px;
    font-weight: bold;
  }
</style>
