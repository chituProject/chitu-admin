<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;" v-can:edit="'Gift'">
        <el-button v-if="edit" type="primary" size="medium" @click="submit">保存</el-button>
        <el-button v-else type="primary" size="medium" @click="editGoods">编辑</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <div style="position:fixed;background-color:#fff;right:20px;bottom:20px;border-radius:50%;padding:30px 20px;box-shadow: 0px 0px 19px 0px rgba(205, 203, 203, 0.35);z-index:100;" v-if="model.mini_program">
          <img :src="model.mini_program" style="width:125px;height:125px;">
          <div style="font-size:14px;color:#393939;margin:20px 35px 0px 35px">扫码查看商品预览</div>
        </div>
        <el-form ref="spuForm" :model="model_new" :rules="rules" class="demo-table-expand" label-width="120px" label-position="left">
          <div class="title">基本信息</div>
          <div style=" width: 100%; display: grid; grid-template-columns: repeat( 2, 1fr ); grid-column-gap: 10px;">
            <el-form-item label="所属商家" prop="merchant" v-show="edit">
              <el-select v-model="model_new.merchant" @change="handleMerchantChange" placeholder="点击选择商家" style="width: 100%;">
                <el-option
                  v-for="item in merchant"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属商家" v-show="!edit">
              <span>{{model.merchant.name}}</span>
            </el-form-item>
            <el-form-item label="所属品牌" prop="brand" v-show="edit">
              <el-select v-model="model_new.brand" placeholder="点击选择品牌" style="width: 100%;">
                <el-option
                  v-for="item in brand"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属品牌" v-show="!edit">
              <span>{{model.brand.name}}</span>
            </el-form-item>
            <el-form-item label="商品标题" prop="title" v-show="edit">
              <el-input v-model="model_new.title" clearable placeholder="请输入商品标题"></el-input>
            </el-form-item>
            <el-form-item label="商品标题" v-show="!edit">
              <span>{{model.title}}</span>
            </el-form-item>
            <el-form-item label="完整标题" prop="full_title" v-show="edit">
              <el-input v-model="model_new.full_title" clearable placeholder="请输入商品完整标题"></el-input>
            </el-form-item>
            <el-form-item label="完整标题" v-show="!edit">
              <span>{{model.full_title}}</span>
            </el-form-item>
            <el-form-item label="SKU型号" prop="specification" v-show="edit">
              <el-input v-model="model_new.specification" clearable placeholder="请输入商品的SKU型号名称"></el-input>
            </el-form-item>
            <el-form-item label="SKU型号" v-show="!edit">
              <span>{{model.specification}}</span>
            </el-form-item>
            <el-form-item label="售价(元)" prop="price" v-show="edit">
              <el-input type="number" v-model.number="model_new.price" clearable placeholder="请输入商品售价"></el-input>
            </el-form-item>
            <el-form-item label="售价(元)" v-show="!edit">
              <span>{{formatPrice(model.price)}}</span>
            </el-form-item>
            <el-form-item label="供货价(元)" prop="cost" v-show="edit">
              <el-input type="number" v-model.number="model_new.cost" clearable placeholder="请输入商品供货价"></el-input>
            </el-form-item>
            <el-form-item label="供货价(元)" v-show="!edit">
              <span>{{formatPrice(model.cost)}}</span>
            </el-form-item>
            <el-form-item label="发货仓库" prop="delivery_stock" style="flex: 1" v-show="edit">
              <el-select
                v-model="model_new.delivery_stock"
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
            <el-form-item label="发货仓库" v-show="!edit">
              <span>{{model.delivery_stock && model.delivery_stock.length > 0 ? (model.delivery_stock[0].area + ' ' + model.delivery_stock[0].address) : ''}}</span>
            </el-form-item>
            <el-form-item label="发货快递" prop="default_express" v-show="edit">
              <el-select v-model="model_new.default_express" filterable placeholder="点击选择快递" style="width: 100%;">
                <el-option
                  v-for="(item, j) in express"
                  :key="j"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货快递" v-show="!edit">
              <span>{{model.default_express}}</span>
            </el-form-item>
            <el-form-item label="发货时间(天)" prop="delivery_time" v-show="edit">
              <el-input type="number" v-model.number="model_new.delivery_time" clearable placeholder="请输入发货时间"></el-input>
            </el-form-item>
            <el-form-item label="发货时间(天)" v-show="!edit">
              <span>{{model.delivery_time}}</span>
            </el-form-item>
            <el-form-item label="商品描述" prop="description" v-show="edit">
              <el-input v-model="model_new.description" type="textarea" :rows="2" placeholder="请输入商品的使用场景描述，要求生动有趣吸引人"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" v-show="!edit">
              <span>{{model.description}}</span>
            </el-form-item>
          </div>
          <div class="divider"></div>
          <div class="title">商品图片</div>
          <el-form-item label-width="0" prop="sku_pic">
            <div>
              <span class="required" v-if="edit">*</span>
              <span class="pic-label">SKU图：</span>
              <span class="pic-info">（只要1张，尺寸大小要求340*340）</span>
            </div>
            <img-single-cropper-upload
              v-if="edit"
              ref="sku_pic"
              style="margin-top: 20px"
              :uuid="model_new.uuid"
              root="gift_goods"
              path="sku_pic"
              :widthLimit="340"
              :heightLimit="340"
              accept="image/png"
              v-model="model_new.sku_pic">
            </img-single-cropper-upload>
            <img-single-upload
              v-else
              style="margin-top: 20px"
              :editable="edit"
              v-model="model.sku_pic">
            </img-single-upload>
          </el-form-item>
          <el-form-item label-width="0" prop="banner_pictures">
            <div>
              <span class="required" v-if="edit">*</span>
              <span class="pic-label">横幅图片：</span>
              <span class="pic-info">（详情页轮播图：1～6张，尺寸大小要求750*700px，第一张请上传透明底图）</span>
            </div>
            <img-list-cropper-upload
              v-if="edit"
              ref="banner_pictures"
              style="margin-top: 20px"
              :uuid="model_new.uuid"
              root="gift_goods"
              path="banner_pictures"
              :widthLimit="750"
              :heightLimit="700"
              :limit="6"
              v-model="model_new.banner_pictures">
            </img-list-cropper-upload>
            <img-list-upload
              v-else
              style="margin-top: 20px"
              :editable="edit"
              v-model="model.banner_pictures">
            </img-list-upload>
          </el-form-item>
          <el-form-item label-width="0" prop="graphic_text">
            <div>
              <span class="required" v-if="edit">*</span>
              <span class="pic-label">产品故事：</span>
              <span class="pic-info">（产品故事展示图：图片宽度要求750px）</span>
            </div>
            <img-list-upload
              v-if="edit"
              ref="graphic_text"
              style="margin-top: 20px"
              :uuid="model_new.uuid"
              root="gift_goods"
              path="graphic_text"
              :widthLimit="750"
              v-model="model_new.graphic_text">
            </img-list-upload>
            <img-list-upload
              v-else
              style="margin-top: 20px"
              :editable="edit"
              v-model="model.graphic_text">
            </img-list-upload>
          </el-form-item>
          <div class="divider"></div>
          <div class="title">详细参数
            <el-button v-if="edit" class="add-param" type="default" @click="addParam" icon="el-icon-plus">添加参数</el-button>
          </div>
          <template v-if="edit">
            <div v-for="(dd, index) in model_new.detail_paras" :key="index" style="width: 50%; display: inline-block">
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
                v-if="model_new.detail_paras.length > 1">
                <i class="el-icon-error" @click.prevent="removeParam(dd)" style="color: #aaaaaa;"></i>
              </el-form-item>
            </div>
          </template>
          <div v-else>
            <el-table
              stripe
              :data="model.detail_paras"
              style="width: 100%">
              <el-table-column
                prop="key"
                align="center"
                label="参数名称">
              </el-table-column>
              <el-table-column
                prop="value"
                align="center"
                label="参数值">
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { deepCopy, deformatPrice, formatPrice } from '@/assets/util'
import ImgListUpload from '@/components/ImgListUpload'
import ImgListCropperUpload from '@/components/ImgListCropperUpload'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'
import Express from '%/express.json'

export default {
  name: 'GiftGoodsDetail',
  components: {
    ImgListUpload,
    ImgSingleUpload,
    ImgListCropperUpload,
    ImgSingleCropperUpload
  },
  data () {
    return {
      loading: false,
      edit: false,
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
      model_new: {},
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
          { required: true, message: '请输入商品供货价', trigger: 'blur' }
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
  props: {
    id: {
      type: String
    }
  },
  methods: {
    formatPrice,
    goBack () {
      if (this.edit) {
        this.edit = false
      } else {
        // this.$router.go(-1)
        window.open('javascript:window.open("", "_self", "");window.close();', '_self')
      }
    },
    editGoods () {
      this.model_new = deepCopy(this.model)
      this.model_new.merchant = this.model_new.merchant.uuid
      this.handleMerchantChange(this.model_new.merchant)
      this.model_new.price = this.model.price / 100
      this.model_new.cost = this.model.cost / 100
      this.model_new.brand = this.model.brand.id
      this.model_new.delivery_stock = this.model.delivery_stock && this.model.delivery_stock.length > 0 ? this.model.delivery_stock[0].id : ''
      this.edit = true
    },
    getDetail () {
      let that = this
      this.loading = true
      this.$axios.get('/gift_insider/gift_goods/' + this.id + '/')
        .then(res => {
          console.log(res.data)
          that.model = that.decodeForm(res.data)
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          that.loading = false
        })
    },
    submit () {
      let that = this
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          that.confirmPicChanges()
          that.loading = true
          that.$axios.patch('/gift_insider/gift_goods/' + that.id + '/', that.encodeForm(that.model_new))
            .then(res => {
              console.log(res.data)
              that.edit = false
              that.getDetail()
            })
            .catch(error => {
              console.log(error)
              that.loading = false
            })
        } else {
          that.$message.error('请填写所有项目')
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
    decodeForm (form) {
      let tmpForm = deepCopy(form)
      let tmpParas = deepCopy(form.detail_paras)
      tmpForm.detail_paras = []
      for (let key in tmpParas) {
        tmpForm.detail_paras.push({
          key: key,
          value: tmpParas[key]
        })
      }
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
      this.model_new.brand = ''
      this.getStocks(uuid)
    },
    removeParam (item) {
      this.$confirm('确认删除此参数？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        var index = this.model_new.detail_paras.indexOf(item)
        if (index !== -1) {
          this.model_new.detail_paras.splice(index, 1)
        }
      })
    },
    addParam () {
      this.model_new.detail_paras.push({
        key: '',
        value: ''
      })
    }
  },
  created () {
    if (this.$route.query.edit) {
      this.edit = true
    }
    this.getDetail()
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
