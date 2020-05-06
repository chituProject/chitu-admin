<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button size="medium" @click="notPassed">审核不通过</el-button>
        <el-button v-if="end" size="medium" @click="confirmVerify(1)">审核通过</el-button>
        <el-button type="primary" v-else-if="model&&skus.length>0" size="medium" @click="nextStep">继续审核SKU</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <!-- 查看/编辑SPU -->
      <div v-if="edit === 'spu'">
        <div class="card-container">
          <el-form :model="model" :rules="rules" class="demo-table-expand" label-width="100px" label-position="left">
            <div class="title">基本信息</div>
            <div class="spu-table">
              <el-form-item label="SPU">
                <span>{{model.id}}</span>
              </el-form-item>
              <el-form-item label="SPU状态">
                <span>{{getStatus(model.shelf_status)}}</span>
              </el-form-item>
              <el-form-item label="供应商" prop="merchant">
                <el-select v-model="model.merchant.uuid" @change="handleMerchantChange">
                  <el-option
                    v-for="item in merchant"
                    :key="item.uuid"
                    :label="item.name"
                    :value="item.uuid">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="model.brand.id">
                  <el-option
                    v-for="item in brand"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属品类" prop="category_third">
                <span v-for="(category, i) in model.category_third" :key="i">
                  <span v-if="i !== 0">，</span>
                  {{getCategoryLabel(category)}}
                </span>
                <i class="iconfont clickable" @click="setCategory">&#xe61e;</i>
              </el-form-item>
              <el-form-item label="产品标签" prop="tags">
                <editable-tag-list v-model="model.tags" type="success" :limit="3"/>
              </el-form-item>
              <el-form-item label="适合性别" prop="for_gender">
                <el-radio-group v-model="model.for_gender">
                  <el-radio :label="0">全</el-radio>
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="商品标题" prop="title">
                <el-input v-model="model.title" clearable></el-input>
              </el-form-item>
              <el-form-item label="完整标题" prop="full_title">
                <el-input v-model="model.full_title" clearable></el-input>
              </el-form-item>
              <el-form-item label="SKU型号类型" prop="meta_specification">
                <editable-tag-list v-model="model.meta_specification" type="success" :limit="3"/>
              </el-form-item>
              <el-form-item label="默认SKU" prop="default_sku">
                <el-select v-model="model.default_sku">
                  <el-option
                    v-for="item in model.sku"
                    :key="item.id"
                    :label="item.specification"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品描述" prop="description">
                <el-input v-model="model.description" type="textarea" :rows="4"></el-input>
              </el-form-item>
            </div>
            <div class="divider"></div>
            <div class="title">商品图片</div>
            <el-form-item style="width: 100%;" prop="main_picture" label-width="0">
              <div>
                <span class="required">*</span>
                <span class="pic-label">瀑布流主图：</span>
                <span class="pic-info">（封面图片：1张，尺寸大小要求500*500，请上传透明底PNG格式的图片）</span>
              </div>
              <img-single-upload
                ref="main_picture"
                style="margin-top: 20px"
                :uuid="model.uuid"
                root="goods"
                path="main_picture"
                :widthLimit="500"
                :heightLimit="500"
                accept="image/png"
                :editable="true"
                v-model="model.main_picture">
              </img-single-upload>
            </el-form-item>
            <!-- <el-form-item style="width: 100%;" prop="index_picture" label-width="0">
              <div>
                <span class="required">*</span>
                <span class="pic-label">首页banner图：</span>
                <span class="pic-info">（封面图片：1张，尺寸大小要求710*320，请上传透明底PNG格式的图片）</span>
              </div>
              <img-single-upload
                ref="index_picture"
                style="margin-top: 20px"
                :uuid="model.uuid"
                root="goods"
                path="index_picture"
                :widthLimit="710"
                :heightLimit="320"
                accept="image/png"
                :editable="true"
                v-model="model.index_picture">
              </img-single-upload>
            </el-form-item> -->
            <el-form-item style="width: 100%;" prop="banner_pictures" label-width="0">
              <div>
                <span class="required">*</span>
                <span class="pic-label">横幅图片：</span>
                <span class="pic-info">（详情页轮播图：1～6张，尺寸大小要求750*700，第一张请上传透明底图）</span>
              </div>
              <img-list-upload
                ref="banner_pictures"
                style="margin-top: 20px"
                :uuid="model.uuid"
                root="goods"
                path="banner_pictures"
                :widthLimit="750"
                :heightLimit="700"
                :limit="6"
                :editable="true"
                v-model="model.banner_pictures">
              </img-list-upload>
            </el-form-item>
            <el-form-item style="width: 100%;" prop="graphic_text" label-width="0">
              <div>
                <span class="required">*</span>
                <span class="pic-label">产品故事：</span>
                <span class="pic-info">（产品故事展示图：图片宽度要求750px）</span>
              </div>
              <img-list-upload
                ref="graphic_text"
                style="margin-top: 20px"
                :uuid="model.uuid"
                root="goods"
                path="graphic_text"
                :widthLimit="750"
                :editable="true"
                v-model="model.graphic_text">
              </img-list-upload>
            </el-form-item>
            <el-form-item style="width: 100%;" prop="after_sales" label-width="0">
              <div>
                <span class="required">*</span>
                <span class="pic-label">售后无忧：</span>
                <span class="pic-info">（售后展示图：1～3张，图片宽度要求1080px）</span>
              </div>
              <img-list-upload
                ref="after_sales"
                style="margin-top: 20px"
                :uuid="model.uuid"
                root="goods"
                path="after_sales"
                :widthLimit="1080"
                :limit="3"
                :editable="true"
                v-model="model.after_sales">
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
      <!-- END 查看/编辑SPU -->
      <!-- 查看/编辑SKU -->
      <div class="card-container" v-else>
        <el-form class="demo-table-expand" label-width="100px" label-position="left">
          <div class="sku-table">
            <el-form-item label="SKU">
              <span>{{model.id}}-{{sku_new.id}}</span>
            </el-form-item>
            <el-form-item label="SKU状态">
              <span>{{getStatus(sku_new.shelf_status)}}</span>
            </el-form-item>
            <el-form-item
              v-for="(spec, j) in model.meta_specification"
              :key="j"
              :label="spec"
              :prop="'specification.' + j"
              :rules="{ required: true, message: '请填写' + spec, trigger: 'blur' }">
              <el-input v-model="sku_new.specification[j]" clearable :placeholder="'请填写' + spec"></el-input>
            </el-form-item>
            <el-form-item label="供货价(元)">
              <el-input type="number" v-model="sku_new.cost_tmp" clearable></el-input>
            </el-form-item>
            <div style="display: flex">
              <el-form-item label="发货地点" prop="delivery_stock" style="flex: 1">
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
            <el-form-item label="发货时间(天)">
              <el-input v-model="sku_new.delivery_time" clearable></el-input>
            </el-form-item>
            <el-form-item label="运费(元)">
              <el-input type="number" v-model="sku_new.shipment_fee_tmp" clearable></el-input>
            </el-form-item>
            <el-form-item label="默认快递">
              <el-select v-model="sku_new.default_express" filterable placeholder="请选择">
                <el-option
                  v-for="(item, j) in express"
                  :key="j"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市场价(元)">
              <el-input type="number" v-model="sku_new.primitive_price_tmp" clearable></el-input>
            </el-form-item>
            <el-form-item label="促销价(元)">
              <el-input type="number" v-model="sku_new.price_tmp" clearable></el-input>
            </el-form-item>
            <el-form-item label="场景-返利(元)">
              <el-input type="number" v-model="sku_new.rebate_tmp" clearable></el-input>
            </el-form-item>
            <el-form-item label="免单金(元)">
              <el-input type="number" v-model="sku_new.offpay_limit_tmp" clearable></el-input>
            </el-form-item>
          </div>
          <el-form-item style="width: 100%" prop="sku_pic" label-width="0">
            <div>
              <span class="pic-label">SKU图：</span>
              <span class="pic-info">（封面图片：1张，尺寸大小要求340*340）</span>
            </div>
            <img-single-upload
              ref="sku_picture"
              style="margin-top: 20px"
              :uuid="sku_new.uuid"
              root="sku"
              path="main"
              :widthLimit="340"
              :heightLimit="340"
              :editable="true"
              v-model="sku_new.sku_pic">
            </img-single-upload>
          </el-form-item>
        </el-form>
      </div>
      <!-- END 查看/编辑SKU -->
    </div>
    <category-selector ref="categorySelector" @categoryConfirm="setCategoryConfirm"></category-selector>
  </div>
</template>

<script>
import { formatPrice, deformatPrice, deepCopy } from '@/assets/util'
import constants from '@/assets/constants.js'
import ImgListUpload from '@/components/ImgListUpload'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import { Message } from 'element-ui'
import Express from '%/express.json'
import CategorySelector from '@/components/CategorySelector'
import EditableTagList from '@/components/EditableTagList'

export default {
  name: 'GoodsVerify',
  components: {
    ImgListUpload,
    ImgSingleUpload,
    CategorySelector,
    EditableTagList
  },
  data () {
    let validateTags = (rule, value, callback) => {
      console.log(value)
      if (value.length === 0) {
        callback(new Error('请输入产品标签'))
        return
      }
      for (let i = 0; i < value.length; i++) {
        if (value[i] === '') {
          callback(new Error('请输入产品标签'))
          return
        } else if (value[i].length > 31) {
          callback(new Error('产品标签不能多于31个字'))
          return
        }
      }
      callback()
    }
    return {
      loading: false,
      activeName: '',
      model: {
        title: '',
        full_title: '',
        description: '',
        main_picture: '',
        // index_picture: '',
        banner_pictures: [],
        graphic_text: [],
        detail_paras: [],
        after_sales: [],
        tags: [],
        meta_specification: [],
        category_third: [],
        default_sku: '',
        for_gender: 0,
        merchant: {},
        brand: {}
      },
      skuIndex: 0,
      sku_new: {},
      edit: 'spu',
      end: false,
      dialogImageUrl: '',
      dialogVisible: false,
      brand: [],
      express: Express,
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
        // waterfall_title: [
        //   { required: true, message: '瀑布流标题限18字以内', trigger: 'blur', max: 18 }
        // ],
        full_title: [
          { required: true, message: '请输入完整标题', trigger: 'blur' }
        ],
        for_gender: [
          { required: true, message: '请选择适合性别', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入产品描述', trigger: 'blur' }
        ],
        tags: [
          { required: true, validator: validateTags, trigger: 'blur' }
        ],
        meta_specification: [
          { required: true, message: '请设定 SKU 型号类型', trigger: 'blur' }
        ],
        default_sku: [
          { required: true, message: '请选择默认SKU', trigger: 'blur' }
        ],
        category_third: [
          { required: true, message: '请选择品类', type: 'array' }
        ],
        main_picture: [
          { required: true, message: '请上传瀑布流主图', trigger: 'blur' }
        ],
        // index_picture: [
        //   { required: true, message: '请上传首页banner图', trigger: 'blur' }
        // ],
        banner_pictures: [
          { required: true, message: '请上传横幅图片', trigger: 'blur' }
        ],
        graphic_text: [
          { required: true, message: '请上传产品故事', trigger: 'blur' }
        ],
        after_sales: [
          { required: true, message: '请上传售后无忧', trigger: 'blur' }
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
  computed: {
    merchant () {
      return this.$store.state.merchant
    },
    skus () {
      if (this.model.sku) {
        return this.model.sku
      } else {
        return []
      }
    },
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getSPUDetail () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/goods/' + this.id + '/')
        .then(res => {
          that.model = that.decodeForm(res.data)
          that.handleMerchantChange(that.model.merchant.uuid)
        })
        .finally(() => {
          that.loading = false
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
    getStatus (status) {
      return constants.SHELF_STATUS[status]
    },
    format () {
      this.sku_new.price_tmp = formatPrice(this.sku_new.price)
      this.sku_new.primitive_price_tmp = formatPrice(this.sku_new.primitive_price)
      this.sku_new.offpay_limit_tmp = formatPrice(this.sku_new.offpay_limit)
      this.sku_new.rebate_tmp = formatPrice(this.sku_new.rebate)
      this.sku_new.cost_tmp = formatPrice(this.sku_new.cost)
      this.sku_new.shipment_fee_tmp = formatPrice(this.sku_new.shipment_fee)
      if (this.sku_new.delivery_stock_data && this.sku_new.delivery_stock_data.length > 0) {
        this.sku_new.delivery_stock = this.sku_new.delivery_stock_data[0].id
      }
      this.sku_new = deepCopy(this.sku_new)
    },
    deformat () {
      this.sku_new.price = deformatPrice(this.sku_new.price_tmp)
      this.sku_new.primitive_price = deformatPrice(this.sku_new.primitive_price_tmp)
      this.sku_new.offpay_limit = deformatPrice(this.sku_new.offpay_limit_tmp)
      this.sku_new.rebate = deformatPrice(this.sku_new.rebate_tmp)
      this.sku_new.cost = deformatPrice(this.sku_new.cost_tmp)
      this.sku_new.shipment_fee = deformatPrice(this.sku_new.shipment_fee_tmp)
      this.sku_new.delivery_stock = [this.sku_new.delivery_stock]
    },
    encodeForm (form) {
      let tmpForm = deepCopy(form)
      tmpForm.merchant = tmpForm.merchant.uuid
      tmpForm.brand = tmpForm.brand.id
      delete tmpForm.mini_program

      let tmpParas = deepCopy(form.detail_paras)
      tmpForm.detail_paras = {}
      console.log('encode', tmpParas)
      for (let index in tmpParas) {
        console.log('encode', tmpParas[index])
        tmpForm.detail_paras[tmpParas[index].key] = tmpParas[index].value
      }
      console.log('encode', tmpForm)
      return tmpForm
    },
    encodeSKUForm (form) {
      let tmpForm = deepCopy(form)
      delete tmpForm.mini_program
      delete tmpForm.is_default
      tmpForm.specification = JSON.stringify(tmpForm.specification)
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
      let tmpCategory = deepCopy(form.category_third)
      tmpForm.category_third = []
      for (let i = 0; i < tmpCategory.length; i++) {
        tmpForm.category_third.push(tmpCategory[i].id)
      }
      for (let i = 0; i < tmpForm.sku.length; i++) {
        if (!tmpForm.sku[i].specification.startsWith('[')) {
          // sku 型号旧数据处理
          tmpForm.sku[i].specification = [tmpForm.sku[i].specification]
        } else {
          // sku 型号新数据处理
          tmpForm.sku[i].specification = JSON.parse(tmpForm.sku[i].specification)
        }
      }
      return tmpForm
    },
    nextStep () {
      this.confirmPicChange()
      if (this.edit === 'spu') {
        this.$axios.patch('/insider/goods/' + this.model.id + '/', this.encodeForm(this.model))
          .then(res => {
            console.log(res.data)
          })
      } else {
        this.deformat()
        this.$axios.patch('/insider/sku/' + this.sku_new.id + '/', this.encodeSKUForm(this.sku_new))
          .then(res => {
            console.log(res.data)
          })
      }
      this.edit = 'sku'
      this.sku_new = deepCopy(this.skus[this.skuIndex])
      this.format()
      this.skuIndex += 1
      if (this.skuIndex >= this.skus.length) {
        this.end = true
      }
    },
    notPassed () {
      this.$prompt('请填写原因', '审核不通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        inputType: 'textarea',
        inputValidator: item => {
          return item !== null
        },
        inputErrorMessage: '请填写审核不通过原因'
      }).then(({ value }) => {
        console.log(value)
        this.confirmVerify(0, value)
      })
    },
    confirmVerify (action, reason) {
      this.confirmPicChange()
      if (this.edit === 'sku') {
        this.deformat()
        let parm = deepCopy(this.sku_new)
        delete parm.mini_program
        delete parm.is_default
        console.log(JSON.stringify(parm))
        this.$axios.patch('/insider/sku/' + parm.id + '/', this.encodeSKUForm(parm))
          .then(res => {
            console.log(res.data)
          })
      }
      let that = this
      let data = {
        goods: this.model.id,
        action: action
      }
      if (reason) {
        data.reason = reason
      }
      this.$axios.post('/insider/verification/', data)
        .then(() => {
          Message.success('提交成功')
          that.goBack()
        })
        .catch(error => {
          console.log(error)
          Message.error('提交失败')
        })
    },
    handleMerchantChange (uuid) {
      this.brand = []
      let that = this
      this.merchant.forEach(item => {
        if (item.uuid === uuid) {
          that.brand = item.brand
        }
      })
      // this.model.brand.id = ''
      that.getStocks(that.model.merchant.uuid)
    },
    confirmPicChange () {
      if (this.edit === 'spu') {
        this.$refs.main_picture.confirmChanges()
        // this.$refs.index_picture.confirmChanges()
        this.$refs.banner_pictures.confirmChanges()
        this.$refs.graphic_text.confirmChanges()
        this.$refs.after_sales.confirmChanges()
      } else {
        this.$refs.sku_picture.confirmChanges()
      }
    },
    cancelPicChange () {
      if (this.edit === 'spu') {
        this.$refs.main_picture.cancelChanges()
        // this.$refs.index_picture.confirmChanges()
        this.$refs.banner_pictures.cancelChanges()
        this.$refs.graphic_text.cancelChanges()
        this.$refs.after_sales.cancelChanges()
      } else {
        this.$refs.sku_picture.cancelChanges()
      }
    },
    removeParam (item) {
      this.$confirm('确认删除此参数？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
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
    },
    getCategoryLabel (id) {
      let label = ''
      this.categories.forEach(item => {
        if (item.id === id) {
          label = item.name
        }
      })
      return label
    },
    setCategory () {
      this.$refs.categorySelector.open(this.model.category_third)
    },
    setCategoryConfirm (checked) {
      this.$set(this.model, 'category_third', checked)
    }
  },
  created () {
    this.getSPUDetail()
  }
}
</script>

<style scoped>
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
  .filter-container {
    padding: 12px;
  }
  .demo-table-expand {
    margin: 0px 20px 20px;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    padding-bottom: 20px;
  }
  .spu-table {
    width: 100%;
    display: grid;
    grid-template-columns: repeat( 2, 1fr );
    grid-column-gap: 10px;
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
  /*.el-form-item .el-form-item__content {*/
    /*width: 100% !important;*/
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
  .title {
    font-size: 20px;
    /*font-weight: bold;*/
    text-align: left;
    margin-top: 20px;
    margin-bottom: 40px;
  }
</style>
