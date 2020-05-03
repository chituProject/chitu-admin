<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="$router.go(-1)">返回</el-button>
      <div style="float: right;">
        <el-button size="medium" @click.stop="addEarnest" plain class="action_button">修改诚意金</el-button>
        <el-button size="medium" @click.stop="changeWithdrawalPeriod" plain class="action_button">修改提现周期</el-button>
        <router-link class="action_button" :to="'/scene/detail/' + this.uuid + '/edit'"><el-button class="blue_button_filled" size="medium">编辑</el-button></router-link>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="店铺名">
            <span>{{model.name}}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{status[model.status]}}</span>
          </el-form-item>
          <el-form-item label="是否活跃">
            <span>{{model.is_active ? '是' : '否'}}</span>
          </el-form-item>
          <el-form-item label="所有人姓名">
            <span>{{model.username}}</span>
          </el-form-item>
          <el-form-item label="手机号码">
            <span>{{model.phone}}</span>
          </el-form-item>
          <el-form-item label="身份证号码">
            <span>{{model.idcard}}</span>
          </el-form-item>
          <el-form-item label="工商营业执照号">
            <span>{{model.license}}</span>
          </el-form-item>
          <el-form-item label="店铺地址">
            <span>{{model.area + ' ' + model.address}}</span>
          </el-form-item>
          <el-form-item label="提现周期">
            <span>{{model.withdraw_period}}天</span>
          </el-form-item>
          <el-form-item label="免单金">
            <span>{{(model.withdrawable_offpay / 100).toFixed(2)}}元</span>
          </el-form-item>
          <el-form-item label="诚意金">
            <span>{{(model.withdrawable_earnest / 100).toFixed(2)}}元</span>
          </el-form-item>
          <el-form-item label="可提现返利">
            <span>{{(model.withdrawable_rebate / 100).toFixed(2)}}元</span>
          </el-form-item>
          <el-form-item label="提现中">
            <span>{{(model.withdrawing_amount / 100).toFixed(2)}}元</span>
          </el-form-item>
          <el-form-item label="不可提现">
            <span>{{(model.unwithdrawable_amount / 100).toFixed(2)}}元</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-container">
        <el-form class="demo-table-expand-2" label-width="130px" label-position="left">
          <el-form-item label="工商营业执照照片">
            <img-single-upload
              :editable="false"
              :customSize="true"
              :value="model.license_picture">
            </img-single-upload>
          </el-form-item>
          <el-form-item label="店铺门头照片">
            <img-single-upload
              :editable="false"
              :customSize="true"
              :value="model.facade_picture">
            </img-single-upload>
          </el-form-item>
          <el-form-item label="微信头像">
            <img-single-upload
              :editable="false"
              :customSize="true"
              :value="model.user ? model.user.wechat_avatar_url : ''">
            </img-single-upload>
          </el-form-item>
          <el-form-item label="身份证正面">
            <img-single-upload
              :editable="false"
              :customSize="true"
              :value="model.idcard_front">
            </img-single-upload>
          </el-form-item>
          <el-form-item label="身份证背面">
            <img-single-upload
              :editable="false"
              :customSize="true"
              :value="model.idcard_back">
            </img-single-upload>
          </el-form-item>
          <el-form-item label="线下场景二维码">
            <canvas id="qrcode_canvas" width="1039" height="1559" style="width: 100%;"></canvas>
          </el-form-item>
          <el-form-item label="绑定二维码" style="margin-bottom: 0">
            <img-single-upload
              :editable="false"
              :customSize="true"
              :value="model.bind_QRcode">
            </img-single-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import ImgSingleUpload from '@/components/ImgSingleUpload'
import constants from '@/assets/constants'
export default {
  name: 'SceneDetail',
  components: {
    ImgSingleUpload
  },
  data () {
    return {
      loading: false,
      model: null,
      status: constants.SCENE_STATUS
    }
  },
  props: {
    uuid: {
      type: String
    }
  },
  methods: {
    getDetail () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/reseller/' + this.uuid + '/')
        .then(res => {
          that.model = res.data
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
    addEarnest () {
      const that = this
      this.$prompt('请填写需要增加的诚意金（如果是减少，金额前面加“-”号，单位：元）', '修改诚意金', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^-?(([1-9]\d*)|\d)(\.\d{1,2})?$/,
        inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        that.loading = true
        that.$axios.post('/insider/reseller/' + that.model.uuid + '/add_earnest/', {
          amount: value * 100
        }).then(() => {
          that.loading = false
          that.getDetail()
        }).catch((e) => {
          that.loading = false
        })
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
        that.$axios.patch('/insider/reseller/' + that.uuid + '/', {
          withdraw_period: value
        }).then((res) => {
          that.model = res.data
        }).finally(() => {
          that.loading = false
        })
      }).catch(() => {})
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style scoped>

  .card-container {
    padding: 20px
  }
  .filter-container {
    padding: 12px;
  }
  .demo-table-expand {
    width: 100%;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    margin-top: 5px;
    width: 50%;
    min-width: 200px;
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
  .el-form-item img {
    width: 100%;
    max-width: 240px;
  }
  .action_button + .action_button {
    margin-left: 10px;
  }

</style>
