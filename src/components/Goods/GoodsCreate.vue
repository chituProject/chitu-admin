<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="createGoodsConfirm">保存并新增SKU</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form ref="spuForm" :model="model" :rules="rules" class="demo-table-expand" label-width="100px" label-position="left">
          <div class="title">基本信息</div>
          <div class="spu-table">
            <el-form-item label="供应商" prop="merchant">
              <el-select v-model="model.merchant" @change="handleMerchantChange">
                <el-option
                  v-for="item in merchant"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="model.brand">
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
            <el-form-item label="商品类型" prop="goods_type">
              <el-select v-model="model.goods_type">
                <el-option
                  v-for="item in type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
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
              <span>（封面图片：1张，尺寸大小要求500*500px，请上传透明底png格式的图片）</span>
            </div>
            <img-single-cropper-upload
              ref="main_picture"
              style="margin-top: 20px"
              :uuid="model.uuid"
              root="goods"
              path="main_picture"
              :widthLimit="500"
              :heightLimit="500"
              accept="png"
              v-model="model.main_picture">
            </img-single-cropper-upload>
          </el-form-item>
          <!-- <el-form-item style="width: 100%;" prop="index_picture" label-width="0">
            <div>
              <span class="required">*</span>
              <span class="pic-label">首页banner图：</span>
              <span>（封面图片：1张，尺寸大小要求710*320px，请上传透明底png格式的图片）</span>
            </div>
            <img-single-cropper-upload
              style="margin-top: 20px"
              ref="index_picture"
              :uuid="model.uuid"
              root="goods"
              path="index_picture"
              :widthLimit="710"
              :heightLimit="320"
              accept="png"
              v-model="model.index_picture">
            </img-single-cropper-upload>
          </el-form-item> -->
          <el-form-item style="width: 100%;" prop="banner_pictures" label-width="0">
            <div>
              <span class="required">*</span>
              <span class="pic-label">横幅图片：</span>
              <span class="pic-info">（详情页轮播图：1～6张，尺寸大小要求750*700px，第一张请上传透明底图）</span>
            </div>
            <img-list-cropper-upload
              ref="banner_pictures"
              style="margin-top: 20px"
              :uuid="model.uuid"
              root="goods"
              path="banner_pictures"
              :widthLimit="750"
              :heightLimit="700"
              :limit="6"
              v-model="model.banner_pictures">
            </img-list-cropper-upload>
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
    <category-selector ref="categorySelector" @categoryConfirm="setCategoryConfirm"></category-selector>
  </div>
</template>

<script>
import { deepCopy } from '@/assets/util'
import UUID from 'uuid-js'
import ImgListUpload from '@/components/ImgListUpload'
import ImgListCropperUpload from '@/components/ImgListCropperUpload'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'
import CategorySelector from '@/components/CategorySelector'
import EditableTagList from '@/components/EditableTagList'

export default {
  name: 'GoodsCreate',
  components: {
    ImgListUpload,
    ImgListCropperUpload,
    ImgSingleUpload,
    ImgSingleCropperUpload,
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
      type: [
        {
          id: 'ONLINE',
          name: '线上商品'
        },
        {
          id: 'LIFE',
          name: '免单生活'
        },
        {
          id: 'SICORDER',
          name: '怡亚通商品'
        }
      ],
      model: {
        goods_type: '',
        uuid: '',
        title: '',
        full_title: '',
        // waterfall_title: '',
        description: '',
        main_picture: '',
        // index_picture: '',
        banner_pictures: [],
        graphic_text: [],
        after_sales: [],
        tags: [],
        meta_specification: ['型号'],
        category_third: [],
        for_gender: 0,
        merchant: '',
        brand: '',
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
      dialogImageUrl: '',
      dialogVisible: false,
      brand: [],
      rules: {
        merchant: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '请选择品牌', trigger: 'blur' }
        ],
        goods_type: [
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '商品标题限10字以内', trigger: 'blur', max: 10 }
        ],
        full_title: [
          { required: true, message: '请输入完整标题', trigger: 'blur' }
        ],
        // waterfall_title: [
        //   { required: true, message: '瀑布流标题限18字以内', trigger: 'blur', max: 18 }
        // ],
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
      }
    }
  },
  computed: {
    merchant () {
      return this.$store.state.merchant
    },
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    createGoodsConfirm () {
      let that = this
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          that.deletePicConfirm()
          that.loading = true
          that.$axios.post('/insider/goods/', that.encodeForm(that.model))
            .then(res => {
              console.log(res.data)
              that.$router.push('/goods/add/' + res.data.id + '/sku?merchant=' + that.model.merchant)
            })
            .catch(error => {
              console.log(error)
              that.$message.error('保存失败')
            })
            .finally(() => {
              that.loading = false
            })
        } else {
          that.$message.error('请填写所有项目')
        }
      })
    },
    encodeForm (form) {
      let tmpForm = deepCopy(form)
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
    deletePicConfirm () {
      this.$refs.main_picture.confirmChanges()
      // this.$refs.index_picture.confirmChanges()
      this.$refs.banner_pictures.confirmChanges()
      this.$refs.graphic_text.confirmChanges()
      this.$refs.after_sales.confirmChanges()
    },
    handleMerchantChange (uuid) {
      console.log(uuid)
      this.brand = []
      let that = this
      this.merchant.forEach(item => {
        if (item.uuid === uuid) {
          that.brand = item.brand
        }
      })
      this.model.brand = ''
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
    this.model.uuid = UUID.create(1).hex
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
  .spu-table {
    width: 100%;
    display: grid;
    grid-template-columns: repeat( 2, 1fr );
    grid-column-gap: 10px;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    padding-bottom: 20px;
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
