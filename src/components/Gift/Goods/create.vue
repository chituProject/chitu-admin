<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="submit">保存</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form ref="spuForm" :model="model" :rules="rules" class="demo-table-expand" label-width="120px" label-position="left">
          <div class="title">基本信息</div>
          <div style=" width: 100%; display: grid; grid-template-columns: repeat( 2, 1fr ); grid-column-gap: 10px;">
            <el-form-item label="所属商家" prop="merchant">
              <el-select v-model="model.merchant" @change="handleMerchantChange" placeholder="点击选择商家" style="width: 100%;">
                <el-option
                  v-for="item in merchant"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属品牌" prop="brand">
              <el-select v-model="model.brand" placeholder="点击选择品牌" style="width: 100%;">
                <el-option
                  v-for="item in brand"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品标题" prop="title">
              <el-input v-model="model.title" clearable placeholder="请输入商品标题"></el-input>
            </el-form-item>
            <el-form-item label="完整标题" prop="full_title">
              <el-input v-model="model.full_title" clearable placeholder="请输入商品完整标题"></el-input>
            </el-form-item>
            <el-form-item label="SKU型号" prop="specification">
              <el-input v-model="model.specification" clearable placeholder="请输入商品的SKU型号名称"></el-input>
            </el-form-item>
            <el-form-item label="售价(元)" prop="price">
              <el-input type="number" v-model.number="model.price" clearable placeholder="请输入商品售价"></el-input>
            </el-form-item>
            <el-form-item label="供货价(元)" prop="cost">
              <el-input type="number" v-model.number="model.cost" clearable placeholder="请输入商品供货价"></el-input>
            </el-form-item>
            <el-form-item label="发货仓库" prop="delivery_stock" style="flex: 1">
              <el-select
                v-model="model.delivery_stock"
                filterable
                :loading="stock_loading"
                style="width: 100%"
                placeholder="点击选择发货仓库">
                <el-option
                  v-for="(item, j) in stocks"
                  :key="j"
                  :label="item.area + ' ' + item.address"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货快递" prop="default_express">
              <el-select v-model="model.default_express" filterable placeholder="点击选择快递" style="width: 100%;">
                <el-option
                  v-for="(item, j) in express"
                  :key="j"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货时间(天)" prop="delivery_time">
              <el-input type="number" v-model.number="model.delivery_time" clearable placeholder="请输入发货时间"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
              <el-input v-model="model.description" type="textarea" :rows="2" placeholder="请输入商品的使用场景描述，要求生动有趣吸引人"></el-input>
            </el-form-item>
          </div>
          <div class="divider"></div>
          <div class="title">商品图片</div>
          <el-form-item label-width="0" prop="sku_pic">
            <div>
              <span class="required">*</span>
              <span class="pic-label">SKU图：</span>
              <span>（只要1张，尺寸大小要求340*340）</span>
            </div>
            <img-single-cropper-upload
              ref="sku_pic"
              style="margin-top: 20px"
              :uuid="model.uuid"
              root="gift_goods"
              path="sku_pic"
              :widthLimit="340"
              :heightLimit="340"
              accept="png"
              v-model="model.sku_pic">
            </img-single-cropper-upload>
          </el-form-item>
          <el-form-item label-width="0" prop="banner_pictures">
            <div>
              <span class="required">*</span>
              <span class="pic-label">横幅图片：</span>
              <span class="pic-info">（详情页轮播图：1～6张，尺寸大小要求750*700px，第一张请上传透明底图）</span>
            </div>
            <img-list-cropper-upload
              ref="banner_pictures"
              style="margin-top: 20px"
              :uuid="model.uuid"
              root="gift_goods"
              path="banner_pictures"
              :widthLimit="750"
              :heightLimit="700"
              :limit="6"
              v-model="model.banner_pictures">
            </img-list-cropper-upload>
          </el-form-item>
          <el-form-item label-width="0" prop="graphic_text">
            <div>
              <span class="required">*</span>
              <span class="pic-label">产品故事：</span>
              <span class="pic-info">（产品故事展示图：图片宽度要求750px）</span>
            </div>
            <img-list-upload
              ref="graphic_text"
              style="margin-top: 20px"
              :uuid="model.uuid"
              root="gift_goods"
              path="graphic_text"
              :widthLimit="750"
              v-model="model.graphic_text">
            </img-list-upload>
          </el-form-item>
          <div class="divider"></div>
          <div class="title">详细参数
            <el-button class="add-param" type="default" @click="addParam" icon="el-icon-plus">添加参数</el-button>
          </div>
          <div v-for="(dd, index) in model.detail_paras" :key="index" style="width: 50%; display: inline-block">
            <el-form-item
              :label="'详细参数 ' + (index + 1)"
              :prop="'detail_paras.' + index + '.key'"
              :rules="{ required: true, message: '请填写详细参数', trigger: 'blur' }"
              style="width: 250px; display: inline-block">
              <el-input style="width: auto" v-model="dd.key" placeholder="请输入参数名称"></el-input>
            </el-form-item>
            <el-form-item
              label-width="0"
              :prop="'detail_paras.' + index + '.value'"
              :rules="{ required: true, message: '请填写详细参数', trigger: 'blur' }"
              style="width: auto; margin-left: 10px; display: inline-block">
              <el-input v-model="dd.value" placeholder="请输入参数值"></el-input>
            </el-form-item>
            <el-form-item
              label-width="0"
              style="width: auto; margin-left: 10px; display: inline-block"
              v-if="model.detail_paras.length > 1">
              <i class="el-icon-error" @click.prevent="removeParam(dd)" style="color: #aaaaaa;"></i>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { deepCopy, deformatPrice } from '@/assets/util'
import UUID from 'uuid-js'
import ImgListUpload from '@/components/ImgListUpload'
import ImgListCropperUpload from '@/components/ImgListCropperUpload'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'
import Express from '%/express.json'

export default {
  name: 'GiftGoodsCreate',
  components: {
    ImgListUpload,
    ImgSingleUpload,
    ImgListCropperUpload,
    ImgSingleCropperUpload
  },
  data () {
    return {
      loading: false,
      model: {
        uuid: '',
        // 商品信息
        merchant: '',
        brand: '',
        title: '',
        full_title: '',
        specification: '',
        price: '',
        cost: '',
        delivery_stock: '',
        default_express: '',
        delivery_time: '',
        description: '',
        // 商品图片
        sku_pic: '',
        banner_pictures: [],
        graphic_text: [],
        // 详细参数
        detail_paras: [
          {
            key: '',
            value: ''
          },
          {
            key: '',
            value: ''
          }
        ]
      },
      brand: [],
      rules: {
        merchant: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '请选择品牌', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '商品标题限10字以内', trigger: 'blur', max: 10 }
        ],
        full_title: [
          { required: true, message: '请输入完整标题', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品售价', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入商品售价', trigger: 'blur' }
        ],
        specification: [
          { required: true, message: '请输入商品型号', trigger: 'blur' }
        ],
        default_express: [
          { required: true, message: '请输入默认快递', trigger: 'blur' }
        ],
        delivery_time: [
          { required: true, message: '请输入发货时间', trigger: 'blur' }
        ],
        delivery_stock: [
          { required: true, message: '请选择发货仓库', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入产品描述', trigger: 'blur' }
        ],
        sku_pic: [
          { required: true, message: '请上传SKU图', trigger: 'blur' }
        ],
        banner_pictures: [
          { required: true, message: '请上传横幅图片', trigger: 'blur' }
        ],
        graphic_text: [
          { required: true, message: '请上传产品故事', trigger: 'blur' }
        ]
      },
      // stock
      stock_loading: false,
      stocks: [],
      // express
      express: Express
    }
  },
  computed: {
    merchant () {
      return this.$store.state.merchant
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    submit () {
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          this.confirmPicChanges()
          this.loading = true
          this.$axios.post('/gift_insider/gift_goods/', this.encodeForm(this.model))
            .then(res => {
              console.log(res.data)
              this.goBack()
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$message.error('请填写所有项目')
        }
      })
    },
    getStocks (merchantId) {
      let that = this
      that.stock_loading = true
      this.$axios.get('/insider/stock/?merchant=' + merchantId)
        .then(res => {
          that.stocks = res.data
        })
        .finally(() => {
          that.stock_loading = false
        })
    },
    encodeForm (form) {
      let tmpForm = deepCopy(form)
      let tmpParas = deepCopy(form.detail_paras)
      tmpForm.detail_paras = {}
      for (let index in tmpParas) {
        tmpForm.detail_paras[tmpParas[index].key] = tmpParas[index].value
      }
      tmpForm.price = deformatPrice(form.price)
      tmpForm.cost = deformatPrice(form.cost)
      tmpForm.delivery_stock = [form.delivery_stock]
      return tmpForm
    },
    confirmPicChanges () {
      this.$refs.sku_pic.confirmChanges()
      this.$refs.banner_pictures.confirmChanges()
      this.$refs.graphic_text.confirmChanges()
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
      this.getStocks(uuid)
    },
    removeParam (item) {
      this.$confirm('确认删除此参数？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        var index = this.model.detail_paras.indexOf(item)
        if (index !== -1) {
          this.model.detail_paras.splice(index, 1)
        }
      })
    },
    addParam () {
      this.model.detail_paras.push({
        key: '',
        value: ''
      })
    }
  },
  created () {
    this.model.uuid = UUID.create(1).hex
    let that = this
    this.$axios.get('/insider/goods/merchant/')
      .then(res2 => {
        that.$store.commit('SET_MERCHANT', res2.data)
      })
      .catch(err => {
        console.log(err)
        that.$message.warning('暂时无法获取供应商列表')
      })
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
    font-size: 20px;
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
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    padding-bottom: 20px;
  }
  /*.el-form-item .el-form-item__content {*/
    /*width: 200px !important;*/
  /*}*/
  .main-pic {
    text-align: left;
    display: block;
    margin: 20px;
  }
  .pic-label {
    /*font-weight: bold;*/
  }
  .pic-info {
    color: #9b9b9b;
  }
  .pic-img {
    height: 140px;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }
  .pic-img div {
    display:inline-block;
    box-sizing: border-box;
    height: 100px;
    margin: 20px;
    text-align: center;
  }
  .pic-img img {
    height: 100px;
    border: 1px solid rgb(239,237,237);
  }
  .button-close {
    font-size: 20px;
    margin: -10px -10px;
    position: absolute;
  }
  .button-close:hover {
    cursor: pointer;
    -webkit-transform: scale(0.9,0.9);
    -moz-transform: scale(0.9,0.9);
    -o-transform: scale(0.9,0.9);
    transform: scale(0.9,0.9);
  }
  .tags {
    margin-right: 10px;
    width: 30%;
    position: relative;
  }
  .tags .el-input{
    width: 80px !important;
    /*margin-right: 8px;*/
  }
  .clickable {
    margin-left: 10px;
  }
  .clickable:hover {
    cursor: pointer;
  }
  .add-param {
    margin-left: 30px;
  }
</style>
