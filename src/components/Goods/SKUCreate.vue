<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button size="medium" @click="createSKUConfirm(0)">保存</el-button>
        <el-button type="primary" size="medium" @click="createSKUConfirm(1)">保存并新增SKU</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-form ref="skuForm" :model="sku_new" :rules="rules" class="demo-table-expand" label-width="120px" label-position="left">
          <div class="sku-table">
            <el-form-item
              v-for="(spec, index) in goods_meta_specification"
              :key="spec"
              :label="spec"
              :prop="'specification.' + index"
              :rules="{ required: true, message: '请填写' + spec, trigger: 'blur' }">
              <el-input v-model="sku_new.specification[index]" clearable :placeholder="'请填写' + spec"></el-input>
            </el-form-item>
            <el-form-item label="供货价(元)" prop="cost">
              <el-input type="number" v-model.number="sku_new.cost" clearable></el-input>
            </el-form-item>
            <div style="display: flex">
              <el-form-item label="发货仓库" prop="delivery_stock" style="flex: 1">
                <el-select
                  v-model="sku_new.delivery_stock"
                  filterable
                  :loading="stock_loading"
                  style="width: 100%"
                  placeholder="请选择">
                  <el-option
                    v-for="(item, j) in stocks"
                    :key="j"
                    :label="item.area + ' ' + item.address"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-checkbox v-model="sku_new.is_individual_delivery" style="margin-left: 20px; margin-top: 12px">独立仓库</el-checkbox>
            </div>
            <el-form-item label="发货时间(天)" prop="delivery_time">
              <el-input type="number" v-model.number="sku_new.delivery_time" clearable></el-input>
            </el-form-item>
            <el-form-item label="运费(元)" prop="shipment_fee">
              <el-input type="number" v-model.number="sku_new.shipment_fee" clearable></el-input>
            </el-form-item>
            <el-form-item label="默认快递" prop="default_express">
              <el-select
                v-model="sku_new.default_express"
                filterable
                style="width: 100%"
                placeholder="请选择">
                <el-option
                  v-for="(item, j) in express"
                  :key="j"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市场价(元)" prop="primitive_price">
              <el-input type="number" v-model.number="sku_new.primitive_price" clearable></el-input>
            </el-form-item>
            <el-form-item label="促销价(元)" prop="price">
              <el-input type="number" v-model.number="sku_new.price" clearable></el-input>
            </el-form-item>
            <el-form-item label="场景返利(元)" prop="rebate">
              <el-input type="number" v-model.number="sku_new.rebate" clearable></el-input>
            </el-form-item>
            <el-form-item label="免单金(元)" prop="offpay_limit">
              <el-input type="number" v-model.number="sku_new.offpay_limit" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="绑定分成(元)" prop="bind_offpay">
              <el-input type="number" v-model.number="sku_new.bind_offpay" clearable></el-input>
            </el-form-item>
            <el-form-item label="推荐分成(元)" prop="recommend_offpay">
              <el-input type="number" v-model.number="sku_new.recommend_offpay" clearable></el-input>
            </el-form-item> -->
          </div>
          <el-form-item style="width: 100%" prop="sku_pic">
            <div style="margin-left: -120px">
              <span class="required">*</span>
              <span class="pic-label">SKU图：</span>
              <span class="pic-info">（封面图片：1张，尺寸大小要求340*340）</span>
            </div>
            <img-single-cropper-upload
              ref="sku_picture"
              style="margin-top: 20px;margin-left: -120px"
              :uuid="sku_new.uuid"
              root="sku"
              path="main"
              :widthLimit="340"
              :heightLimit="340"
              v-model="sku_new.sku_pic">
            </img-single-cropper-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { deformatPrice, deepCopy } from '@/assets/util'
import UUID from 'uuid-js'
import ImgUpload from '@/components/ImgUpload'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'
import { regionData } from 'element-china-area-data'
import Express from '%/express.json'

export default {
  name: 'SKUCreate',
  components: {
    ImgUpload,
    ImgSingleUpload,
    ImgSingleCropperUpload
  },
  data () {
    return {
      loading: false,
      activeName: '',
      edit: false,
      sku_new: {},
      model: {
        specification: [],
        sku_pic: '',
        primitive_price: '',
        price: '',
        offpay_limit: '',
        rebate: '',
        cost: '',
        bind_offpay: '',
        // recommend_offpay: '',
        delivery_time: '',
        delivery_stock: '',
        is_individual_delivery: false,
        default_express: '',
        shipment_fee: '',
        sales_volume: 0,
        goods: 0
      },
      goods_meta_specification: [],
      dialogImageUrl: '',
      dialogVisible: false,
      brand: [],
      allRegions: regionData,
      express: Express,
      rules: {
        specification: [
          { required: true, message: '请输入商品型号', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入促销价', trigger: 'blur' }
        ],
        offpay_limit: [
          { required: true, message: '请输入免单金', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入供货价', trigger: 'blur' }
        ],
        rebate: [
          { required: true, message: '请输入场景-返利', trigger: 'blur' }
        ],
        bind_offpay: [
          { required: true, message: '请输入绑定分成', trigger: 'blur' }
        ],
        // recommend_offpay: [
        //   { required: true, message: '请输入推荐分成', trigger: 'blur' }
        // ],
        shipment_fee: [
          { required: true, message: '请输入运费', trigger: 'blur' }
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
        sku_pic: [
          { required: true, message: '请上传SKU图' }
        ]
      },
      // stock
      stock_loading: false,
      stocks: []
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    reset (type) {
      if (type === 0) {
        this.sku_new = deepCopy(this.model)
      }
      this.sku_new.goods = this.id
      this.sku_new.uuid = UUID.create(1).hex
    },
    getGoodsDetail () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/goods/' + this.id + '/')
        .then(res => {
          that.goods_meta_specification = res.data.meta_specification
          that.sku_new.specification = []
          for (let i = 0; i < that.goods_meta_specification.length; i++) {
            that.sku_new.specification.push('')
          }
        })
        .finally(() => {
          that.loading = false
        })
    },
    formatForm (form) {
      let tmpForm = deepCopy(form)
      tmpForm.price = deformatPrice(this.sku_new.price)
      tmpForm.primitive_price = deformatPrice(this.sku_new.primitive_price)
      tmpForm.offpay_limit = deformatPrice(this.sku_new.offpay_limit)
      tmpForm.rebate = deformatPrice(this.sku_new.rebate)
      tmpForm.cost = deformatPrice(this.sku_new.cost)
      tmpForm.bind_offpay = deformatPrice(this.sku_new.bind_offpay)
      // tmpForm.recommend_offpay = deformatPrice(this.sku_new.recommend_offpay)
      tmpForm.shipment_fee = deformatPrice(this.sku_new.shipment_fee)
      tmpForm.delivery_stock = [this.sku_new.delivery_stock]
      tmpForm.specification = JSON.stringify(tmpForm.specification)
      return tmpForm
    },
    createSKUConfirm (action) {
      let that = this
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          that.loading = true
          this.$axios.post('/insider/sku/', that.formatForm(that.sku_new))
            .then(res => {
              console.log(res.data)
              that.deletePicConfirm()
              if (action === 0) {
                that.goBack()
              } else {
                this.$message.success('已保存！')
                that.reset(1)
              }
            })
            .finally(() => {
              that.loading = false
            })
        } else {
          this.$message.error('请填写所有项目')
        }
      })
    },
    deletePicConfirm () {
      this.$refs.sku_picture.confirmChanges()
    }
  },
  created () {
    this.reset(0)
    this.getGoodsDetail()
    let that = this
    that.stock_loading = true
    this.$axios.get('/insider/stock/?merchant=' + this.$route.query.merchant)
      .then(res => {
        that.stocks = res.data
      })
      .finally(() => {
        that.stock_loading = false
      })
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .demo-table-expand {
    margin: 0px 20px 20px;
    font-size: 0;
    text-align: left;
  }
  .sku-table {
    width: 100%;
    display: grid;
    grid-template-columns: repeat( 2, 1fr );
    grid-column-gap: 20px;
  }
  .demo-table-expand label {
    /*width: 90px;*/
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
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
</style>
