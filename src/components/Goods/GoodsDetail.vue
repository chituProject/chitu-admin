<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <template v-if="model && activeName !== model.uuid && model.shelf_status === 'ON' ">
          <el-button v-if="sku_now.shelf_status === 'ON'" size="medium" @click="groundSKU(0)">下架当前SKU</el-button>
          <el-button v-else size="medium" @click="groundSKU(1)">上架当前SKU</el-button>
        </template>
        <el-button size="medium" v-can:edit="'Goods'" @click="addSKU">新增SKU</el-button>
        <el-button v-if="!edit" size="medium" v-can:edit="'Goods'" @click="editGoods" class="blue_button_filled">编辑</el-button>
        <el-button v-if="edit" size="medium" @click="editGoodsCancel">取消</el-button>
        <el-button v-if="edit" type="primary" v-can:edit="'Goods'" size="medium" @click="editGoodsConfirm">保存</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <!-- 查看/编辑SPU -->
          <div style="position:fixed;background-color:#fff;right:20px;bottom:20px;border-radius:50%;padding:30px 20px;box-shadow: 0px 0px 19px 0px rgba(205, 203, 203, 0.35);z-index:100;" v-show="!edit">
            <img :src="model.mini_program" style="width:125px;height:125px;">
            <div style="font-size:14px;color:#393939;margin:20px 35px 0px 35px">扫码查看商品预览</div>
          </div>
          <el-tab-pane :label="model.title" :name="model.uuid">
            <div>
              <el-form ref="spuForm" :model="model_new" :rules="rules" class="demo-table-expand" label-width="100px" label-position="left">
                <div class="title">基本信息</div>
                <div class="spu-table">
                  <el-form-item label="SPU">
                    <span>{{model.id}}</span>
                  </el-form-item>
                  <el-form-item label="SPU状态">
                    <span>{{status[model.shelf_status]}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="供应商" prop="merchant">
                    <el-select v-model="model_new.merchant.uuid" @change="handleMerchantChange">
                      <el-option
                        v-for="item in merchant"
                        :key="item.uuid"
                        :label="item.name"
                        :value="item.uuid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="供应商" v-show="!edit">
                    <span>{{model.merchant==null?"":model.merchant.name}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="品牌" prop="brand">
                    <el-select filterable v-model="model_new.brand.id">
                      <el-option
                        v-for="item in brand"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="品牌" v-show="!edit">
                    <span>{{model.brand==null?"":model.brand.name}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="所属品类" prop="category_third">
                    <span v-for="(category, i) in model_new.category_third" :key="i">
                      <span v-if="i !== 0">，</span>
                      {{getCategoryLabel(category)}}
                    </span>
                    <i class="iconfont clickable" @click="setCategory">&#xe61e;</i>
                  </el-form-item>
                  <el-form-item v-show="!edit" label="所属品类">
                    <span v-for="(category, i) in model.category_third" :key="i">
                      <span v-if="i !== 0">，</span>
                      {{getCategoryLabel(category)}}
                    </span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="商品类型" prop="goods_type">
                    <el-select v-model="model_new.goods_type">
                      <el-option
                        v-for="item in type"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-show="!edit" label="商品类型">
                    <span>{{getGoodsTypeLabel(model.goods_type)}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="产品标签" prop="tags">
                    <editable-tag-list v-model="model_new.tags" type="success" :limit="3"/>
                  </el-form-item>
                  <el-form-item label="产品标签" v-show="!edit">
                    <editable-tag-list v-model="model.tags" type="success" :limit="3" fixed/>
                  </el-form-item>
                  <el-form-item v-show="edit" label="适合性别" prop="for_gender">
                    <el-radio-group v-model="model_new.for_gender">
                      <el-radio :label="0">全</el-radio>
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="适合性别" v-show="!edit">
                    <span v-if="model.for_gender===0">全</span>
                    <span v-else-if="model.for_gender===1">男</span>
                    <span v-else>女</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="商品标题" prop="title">
                    <el-input v-model="model_new.title" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="商品标题" v-show="!edit">
                    <span>{{model.title}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="完整标题" prop="full_title">
                    <el-input v-model="model_new.full_title" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="完整标题" v-show="!edit">
                    <span>{{model.full_title}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="SKU型号类型" prop="meta_specification">
                    <editable-tag-list v-model="model_new.meta_specification" type="success" :limit="3"/>
                  </el-form-item>
                  <el-form-item label="SKU型号类型" v-show="!edit">
                    <editable-tag-list v-model="model.meta_specification" type="success" :limit="3" fixed/>
                  </el-form-item>
                  <el-form-item v-show="edit" label="默认SKU" prop="default_sku">
                    <el-select v-model="model_new.default_sku">
                      <el-option
                        v-for="item in model.sku"
                        :key="item.uuid"
                        :label="item.specification.join(' ')"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="默认SKU" v-show="!edit">
                    <span>{{def_sku ? def_sku.specification.join(' ') : "未创建默认SKU"}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="产品描述" prop="description">
                    <el-input v-model="model_new.description" type="textarea" :rows="4"></el-input>
                  </el-form-item>
                  <el-form-item label="产品描述" v-show="!edit">
                    <span>{{model.description}}</span>
                  </el-form-item>
                </div>
                <div class="divider"></div>
                <div class="title">商品图片</div>
                <el-form-item label-width="0" prop="main_picture">
                  <div>
                    <span class="pic-label">瀑布流主图：</span>
                    <span class="pic-info">（封面图片：1张，尺寸大小要求500*500，请上传透明底PNG格式的图片）</span>
                  </div>
                  <img-single-cropper-upload
                    ref="main_picture"
                    style="margin-top: 20px"
                    :uuid="model.uuid"
                    root="goods"
                    path="main_picture"
                    :editable="edit"
                    :widthLimit="500"
                    :heightLimit="500"
                    accept="png"
                    v-if="edit"
                    v-model="model_new.main_picture">
                  </img-single-cropper-upload>
                  <img-single-upload
                    style="margin-top: 20px"
                    :uuid="model.uuid"
                    root="goods"
                    path="main_picture"
                    :editable="edit"
                    v-else
                    v-model="model.main_picture">
                  </img-single-upload>
                </el-form-item>
                <!-- <el-form-item label-width="0" prop="index_picture">
                  <div>
                    <span class="pic-label">首页banner图：</span>
                    <span class="pic-info">（封面图片：1张，尺寸大小要求710*320，请上传透明底PNG格式的图片）</span>
                  </div>
                  <img-single-cropper-upload
                    ref="index_picture"
                    style="margin-top: 20px"
                    :uuid="model.uuid"
                    root="goods"
                    path="index_picture"
                    :editable="edit"
                    :widthLimit="710"
                    :heightLimit="320"
                    accept="image/png"
                    v-if="edit"
                    v-model="model_new.index_picture">
                  </img-single-cropper-upload>
                  <img-single-upload
                    style="margin-top: 20px"
                    :uuid="model.uuid"
                    root="goods"
                    path="index_picture"
                    :editable="edit"
                    v-else
                    v-model="model.index_picture">
                  </img-single-upload>
                </el-form-item> -->
                <el-form-item label-width="0" prop="banner_pictures">
                  <div>
                    <span class="pic-label">横幅图片：</span>
                    <span class="pic-info">（详情页轮播图：1～6张，尺寸大小要求750*700，第一张请上传透明底图）</span>
                  </div>
                  <img-list-cropper-upload
                    ref="banner_pictures"
                    style="margin-top: 20px"
                    :uuid="model.uuid"
                    root="goods"
                    path="banner_pictures"
                    :limit="6"
                    :editable="edit"
                    :widthLimit="750"
                    :heightLimit="700"
                    v-if="edit"
                    v-model="model_new.banner_pictures">
                  </img-list-cropper-upload>
                  <img-list-upload
                    style="margin-top: 20px"
                    :uuid="model.uuid"
                    root="goods"
                    path="banner_pictures"
                    :limit="4"
                    :editable="edit"
                    v-else
                    v-model="model.banner_pictures">
                  </img-list-upload>
                </el-form-item>
                <el-form-item label-width="0" prop="graphic_text">
                  <div>
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
                    :editable="edit"
                    v-if="edit"
                    v-model="model_new.graphic_text">
                  </img-list-upload>
                  <img-list-upload
                    style="margin-top: 20px"
                    :uuid="model.uuid"
                    root="goods"
                    path="graphic_text"
                    :limit="10"
                    :editable="edit"
                    v-else
                    v-model="model.graphic_text">
                  </img-list-upload>
                </el-form-item>
                <el-form-item label-width="0" prop="after_sales">
                  <div>
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
                    :editable="edit"
                    v-if="edit"
                    v-model="model_new.after_sales">
                  </img-list-upload>
                  <img-list-upload
                    style="margin-top: 20px"
                    :uuid="model.uuid"
                    root="goods"
                    path="after_sales"
                    :limit="3"
                    :editable="edit"
                    v-else
                    v-model="model.after_sales">
                  </img-list-upload>
                </el-form-item>
                <div class="divider"></div>
                <detail-paras :edit="edit" :value="model.detail_paras" @change="updateDetailParas"></detail-paras>
                <extra-paras :edit="edit" :value="model.extra_paras" @change="updateExtraParas"></extra-paras>
              </el-form>
            </div>
          </el-tab-pane>
          <!-- END 查看/编辑SPU -->
          <!-- 查看/编辑SKU -->
          <el-tab-pane
            v-if="model.sku.length"
            v-for="(item, index) in model.sku"
            :key="index"
            :label="item.specification.join(' ')"
            :name="item.uuid">
            <div>
              <el-form ref="skuForm" :model="sku_new" :rules="sku_rules" class="demo-table-expand" label-width="160px" label-position="left">
                <div class="sku-table">
                  <el-form-item label="SKU">
                    <span>{{model.id}}-{{item.id}}</span>
                  </el-form-item>
                  <el-form-item label="SKU状态">
                    <span>{{status[item.shelf_status]}}</span>
                  </el-form-item>
                  <el-form-item
                    v-show="edit"
                    v-for="(spec, j) in model.meta_specification"
                    :key="j"
                    :label="spec"
                    :prop="'specification.' + j"
                    :rules="{ required: true, message: '请填写' + spec, trigger: 'blur' }">
                    <el-input v-model="sku_new.specification[j]" clearable :placeholder="'请填写' + spec"></el-input>
                  </el-form-item>
                  <el-form-item
                    v-show="!edit"
                    v-for="(spec, j) in model.meta_specification"
                    :key="j+100000"
                    :label="spec">
                    <span>{{item.specification[j]}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="供货价(元)" prop="cost">
                    <el-input type="number" v-model="sku_new.cost" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="供货价(元)" v-show="!edit">
                    <span>{{formatPrice(item.cost)}}</span>
                  </el-form-item>
                  <div v-show="edit" style="display: flex">
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
                  <el-form-item label="发货地点" v-show="!edit">
                    <span v-if="item.delivery_stock_data && item.delivery_stock_data.length > 0">{{item.delivery_stock_data[0].area}} {{item.delivery_stock_data[0].address}}{{item.is_individual_delivery ? '（独立仓库）' : ''}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="发货时间(天)" prop="delivery_time">
                    <el-input v-model="sku_new.delivery_time" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="发货时间(天)" v-show="!edit">
                    <span>{{item.delivery_time}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="运费(元)" prop="shipment_fee">
                    <el-input type="number" v-model="sku_new.shipment_fee" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="运费(元)" v-show="!edit">
                    <span>{{formatPrice(item.shipment_fee)}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="默认快递" prop="default_express">
                    <!--<el-input v-if="edit" v-model="item.default_express" clearable></el-input>-->
                    <el-select v-model="sku_new.default_express" filterable placeholder="请选择">
                      <el-option
                        v-for="(item, j) in express"
                        :key="j"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="默认快递" v-show="!edit">
                    <span>{{item.default_express}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="库存" prop="inventory_count">
                    <el-input type="number" v-model.number="sku_new.inventory_count" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="库存" v-show="!edit">
                    <span>{{ item.inventory_count }}</span>
                  </el-form-item>
                  <template v-if="model.goods_type === 'SICORDER'">
                    <el-form-item v-show="edit" label="第三方市场价(元)" prop="market_price">
                      <el-input type="number" v-model.number="sku_new.market_price" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="第三方市场价(元)" v-show="!edit">
                      <span>{{formatPrice(item.market_price)}}</span>
                    </el-form-item>
                    <el-form-item v-show="edit" label="第三方建议零售价(元)" prop="retail_price">
                      <el-input type="number" v-model.number="sku_new.retail_price" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="第三方建议零售价(元)" v-show="!edit">
                      <span>{{formatPrice(item.retail_price)}}</span>
                    </el-form-item>
                  </template>
                  <el-form-item v-show="edit" label="市场价(元)" prop="primitive_price">
                    <el-input type="number" v-model.number="sku_new.primitive_price" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="市场价(元)" v-show="!edit">
                    <span>{{formatPrice(item.primitive_price)}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="促销价(元)" prop="price">
                    <el-input type="number" v-model.number="sku_new.price" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="促销价(元)" v-show="!edit">
                    <span>{{formatPrice(item.price)}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="场景-返利(元)" prop="rebate">
                    <el-input type="number" v-model.number="sku_new.rebate" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="场景-返利(元)" v-show="!edit">
                    <span>{{formatPrice(item.rebate)}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="免单金(元)" prop="offpay_limit">
                    <el-input type="number" v-model.number="sku_new.offpay_limit" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="免单金(元)" v-show="!edit">
                    <span>{{formatPrice(item.offpay_limit)}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="绑定分成(元)" prop="bind_offpay">
                    <el-input type="number" v-model.number="sku_new.bind_offpay" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="绑定分成(元)" v-show="!edit">
                    <span>{{formatPrice(item.bind_offpay)}}</span>
                  </el-form-item>
                  <!-- <el-form-item v-show="edit" label="推荐分成(元)" prop="recommend_offpay">
                    <el-input type="number" v-model.number="sku_new.recommend_offpay" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="推荐分成(元)" v-show="!edit">
                    <span>{{formatPrice(item.recommend_offpay)}}</span>
                  </el-form-item> -->
                </div>
                <el-form-item style="width: 100%" prop="sku_pic">
                  <div style="margin-left: -120px">
                    <span class="pic-label">SKU图：</span>
                    <span class="pic-info">（封面图片：1张，尺寸大小要求340*340）</span>
                  </div>
                  <img-single-cropper-upload
                    ref="sku_picture"
                    style="margin-top: 20px;margin-left: -120px"
                    :uuid="item.uuid"
                    root="sku"
                    path="main"
                    :editable="edit"
                    :widthLimit="340"
                    :heightLimit="340"
                    v-if="edit"
                    v-model="sku_new.sku_pic">
                  </img-single-cropper-upload>
                  <img-single-upload
                    style="margin-top: 20px;margin-left: -120px"
                    :uuid="item.uuid"
                    root="sku"
                    path="main"
                    :editable="edit"
                    v-else
                    v-model="item.sku_pic">
                  </img-single-upload>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <!-- END 查看/编辑SKU -->
        </el-tabs>
      </div>
    </div>
    <category-selector ref="categorySelector" @categoryConfirm="setCategoryConfirm"></category-selector>
  </div>
</template>

<script>
import { formatPrice, deepCopy, deformatPrice } from '@/assets/util'
import constants from '@/assets/constants'
import ImgListUpload from '@/components/ImgListUpload'
import ImgListCropperUpload from '@/components/ImgListCropperUpload'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'
import Express from '%/express.json'
import CategorySelector from '@/components/CategorySelector'
import EditableTagList from '@/components/EditableTagList'
import DetailParas from './Detail/DetailParas'
import ExtraParas from './Detail/ExtraParas'

export default {
  name: 'GoodsDetail',
  components: {
    ImgListUpload,
    ImgSingleUpload,
    CategorySelector,
    EditableTagList,
    ExtraParas,
    DetailParas,
    ImgListCropperUpload,
    ImgSingleCropperUpload
  },
  data () {
    // let validateTags = (rule, value, callback) => {
    //   console.log(value)
    //   if (value.length === 0) {
    //     callback(new Error('请输入产品标签'))
    //     return
    //   }
    //   for (let i = 0; i < value.length; i++) {
    //     if (value[i] === '') {
    //       callback(new Error('请输入产品标签'))
    //       return
    //     } else if (value[i].length > 31) {
    //       callback(new Error('产品标签不能多于31个字'))
    //       return
    //     }
    //   }
    //   callback()
    // }
    return {
      loading: false,
      edit: false,
      activeName: '',
      model: null,
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
      model_new: {
        uuid: '',
        title: '',
        full_title: '',
        // waterfall_title: '',
        description: '',
        main_picture: '',
        // index_picture: '',
        banner_pictures: [],
        graphic_text: [],
        detail_paras: [],
        after_sales: [],
        tags: [],
        goods_type: '',
        meta_specification: [],
        category_third: [],
        for_gender: 0,
        merchant: {},
        brand: {}
      },
      status: constants.SHELF_STATUS,
      sku_new: {
        specification: []
      },
      dialogImageUrl: '',
      dialogVisible: false,
      brand: [],
      // default_sku: '',
      express: Express,
      rules: {
        merchant: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ],
        goods_type: [
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '商品标题限32字以内', trigger: 'blur', max: 32 }
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
          // { required: true, validator: validateTags, trigger: 'blur' }
        ],
        meta_specification: [
          { required: true, message: '请设定 SKU 型号类型', trigger: 'blur' }
        ],
        default_sku: [
          { required: true, message: '请选择默认SKU', trigger: 'change' }
        ],
        category_third: [
          { required: true, type: 'array', message: '请选择品类' }
        ],
        main_picture: [
          { required: true, message: '请上传商品图片', trigger: 'blur' }
        ],
        // index_picture: [
        //   { required: true, message: '请上传首页banner图', trigger: 'blur' }
        // ],
        banner_pictures: [
          // { required: true, message: '请上传横幅图片', trigger: 'blur' }
        ],
        graphic_text: [
          // { required: true, message: '请上传产品故事', trigger: 'blur' }
        ],
        after_sales: [
          // { required: true, message: '请上传售后无忧', trigger: 'blur' }
        ]
      },
      sku_rules: {
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
  computed: {
    merchant () {
      return this.$store.state.merchant
    },
    def_sku () {
      let sku = null
      let that = this
      if (this.model.sku) {
        this.model.sku.forEach(item => {
          if (item.id === that.model.default_sku) {
            sku = item
          }
        })
      }
      return sku
    },
    sku_now () {
      if (!this.model) {
        return null
      } else if (this.activeName === this.model.uuid) {
        return null
      } else {
        let item = null
        let that = this
        this.model.sku.forEach(sku => {
          if (sku.uuid === that.activeName) {
            item = sku
          }
        })
        return item
      }
    },
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    formatPrice,
    updateExtraParas (value) {
      this.$set(this.model_new, 'extra_paras', value)
    },
    updateDetailParas (value) {
      this.$set(this.model_new, 'detail_paras', value)
    },
    getData () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/goods/merchant/')
        .then(res => {
          console.log(res.data)
          that.$store.commit('SET_MERCHANT', res.data)

          that.$axios.get('/insider/goods/' + that.id + '/')
            .then(res => {
              console.log('getData', res.data)
              that.model = that.decodeForm(res.data)
              if (!that.activeName) {
                that.activeName = that.model.uuid
              }
              if (that.model.merchant != null) {
                that.handleMerchantChange(that.model.merchant.uuid)
              }
            })
            .finally(() => {
              that.loading = false
            })
        })
        .catch(err => {
          console.log(err)
          that.$message.warning('无法获取品牌信息')
          that.loading = false
        })
    },
    getStocks (merchantId) {
      let that = this
      that.stock_loading = true
      this.$axios.get('/insider/stock/?merchant=' + merchantId)
        .then(res => {
          console.log(res.data)
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
      tmpForm.specification = JSON.stringify(tmpForm.specification)
      return tmpForm
    },
    decodeForm (form) {
      let tmpForm = deepCopy(form)
      let tmpParas = deepCopy(form.detail_paras)
      tmpForm.detail_paras = []
      for (let key in tmpParas) {
        if (tmpParas.hasOwnProperty(key)) {
          tmpForm.detail_paras.push({
            key: key,
            value: tmpParas[key]
          })
        }
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
    goBack () {
      if (this.edit) {
        this.editGoodsCancel()
      } else {
        window.open('javascript:window.open("", "_self", "");window.close();', '_self')
      }
    },
    closeWindow () {
      window.open('javascript:window.open("", "_self", "");window.close();', '_self')
    },
    handleClick (tab) {
      console.log(tab)
      this.edit = false
    },
    addSKU () {
      if (this.edit) {
        this.editGoodsCancel()
      }
      this.$router.push('/goods/add/' + this.id + '/sku?merchant=' + this.model.merchant.uuid)
    },
    format () {
      const prices = ['price', 'market_price', 'retail_price', 'primitive_price', 'offpay_limit', 'rebate', 'cost', 'bind_offpay', 'shipment_fee']
      for (const pr in prices) {
        let names = prices[pr]
        this.sku_new[names] = formatPrice(this.sku_new[names])
      }
      console.log(this.sku_new)
      if (this.sku_new.delivery_stock_data && this.sku_new.delivery_stock_data.length > 0) {
        this.sku_new.delivery_stock = this.sku_new.delivery_stock_data[0].id
      } else {
        this.sku_new.delivery_stock = this.stocks && this.stocks[0] ? this.stocks[0].id : null
      }
    },
    deformat () {
      const prices = ['price', 'market_price', 'retail_price', 'primitive_price', 'offpay_limit', 'rebate', 'cost', 'bind_offpay', 'shipment_fee']
      for (const pr in prices) {
        let names = prices[pr]
        this.sku_new[names] = deformatPrice(this.sku_new[names])
      }
      this.sku_new.delivery_stock = [this.sku_new.delivery_stock]
    },
    editGoods () {
      this.model_new = deepCopy(this.model)
      // this.default_sku = this.model_new.default_sku
      if (this.activeName === this.model.uuid) {
        if (this.model.merchant) {
          this.handleMerchantChange(this.model_new.merchant.uuid)
        }
        if (!this.model.brand) {
          this.model_new.brand = {id: ''}
        } else {
          this.model_new.brand.id = this.model.brand.id
        }
      } else {
        this.model.sku.forEach(item => {
          if (item.uuid === this.activeName) {
            this.sku_new = deepCopy(item)
          }
        })
        this.format()
      }
      this.edit = true
    },
    editGoodsConfirm () {
      if (this.activeName === this.model.uuid) {
        this.$refs.spuForm.validate((valid) => {
          if (valid) {
            this.$refs.main_picture.confirmChanges()
            // this.$refs.index_picture.confirmChanges()
            this.$refs.banner_pictures.confirmChanges()
            this.$refs.graphic_text.confirmChanges()
            this.$refs.after_sales.confirmChanges()
            this.handleEditConfirm({type: 0, data: this.model_new})
            this.edit = false
          }
        })
      } else {
        let targetIndex = -1
        for (let index = 0; index < this.model.sku.length; index++) {
          if (this.activeName === this.model.sku[index].uuid) {
            targetIndex = index
            break
          }
        }
        if (targetIndex === -1) {
          console.log('fatal error')
        }
        this.$refs.skuForm[targetIndex].validate((valid) => {
          if (valid) {
            this.$refs.sku_picture[targetIndex].confirmChanges()
            this.deformat()
            this.handleEditConfirm({type: 1, data: this.sku_new})
            this.edit = false
          }
        })
      }
    },
    handleEditConfirm (parm) {
      this.loading = true
      let that = this
      if (parm.type === 0) {
        parm.data.merchant = parm.data.merchant.uuid
        parm.data.brand = parm.data.brand.id
        this.$axios.patch('/insider/goods/' + parm.data.id + '/', this.encodeForm(parm.data))
          .then(res => {
            console.log(res.data)
            that.$message.success('保存成功')
            that.getData()
          })
          .catch(error => {
            console.log(error)
            that.$message.error('保存失败')
            that.loading = false
          })
      } else {
        parm.data.sku_id = parm.data.sku_id === '' ? 0 : parm.data.sku_id
        parm.data.spu_id = parm.data.spu_id === '' ? 0 : parm.data.spu_id
        this.$axios.patch('/insider/sku/' + parm.data.id + '/', this.encodeSKUForm(parm.data))
          .then(res => {
            console.log(res.data)
            that.$message.success('保存成功')
            that.getData()
          })
          .catch(error => {
            console.log(error)
            that.$message.error('保存失败')
            that.loading = false
          })
      }
    },
    editGoodsCancel () {
      this.$refs.main_picture.cancelChanges()
      // this.$refs.index_picture.cancelChanges()
      this.$refs.banner_pictures.cancelChanges()
      this.$refs.graphic_text.cancelChanges()
      this.$refs.after_sales.cancelChanges()
      if (this.$refs.sku_picture) {
        for (let index = 0; index < this.$refs.sku_picture.length; index++) {
          this.$refs.sku_picture[index].cancelChanges()
        }
      }
      this.edit = false
    },
    handleMerchantChange (uuid) {
      this.brand = []
      this.merchant.forEach(item => {
        if (item.uuid === uuid) {
          this.brand = item.brand
        }
      })
      if (this.model_new.brand) {
        this.model_new.brand.id = ''
      }
      this.getStocks(this.model.merchant.uuid)
    },
    groundSKU (action) {
      let that = this
      this.$axios.post('/insider/sku/' + this.sku_now.id + '/ground/', {
        action: action
      })
        .then(() => {
          that.sku_now.shelf_status = action ? 'ON' : 'OFF'
          that.$message.success((action ? '上架' : '下架') + '成功')
        })
        .catch(error => {
          console.log(error)
          that.$message.error((action ? '上架' : '下架') + '失败')
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
    getGoodsTypeLabel (id) {
      let label = ''
      this.type.forEach(item => {
        if (item.id === id) {
          label = item.name
        }
      })
      return label
    },
    setCategory () {
      this.$refs.categorySelector.open(this.model_new.category_third)
    },
    setCategoryConfirm (checked) {
      this.$set(this.model_new, 'category_third', checked)
    }
  },
  created () {
    if (this.$route.query.edit) {
      this.edit = true
    }
    this.getData()
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
/*.el-form-item .el-input {*/
  /*width: 300px !important;*/
/*}*/
.el-form-item .el-form-item__content {
  width: 100% !important;
}
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
  width: 100px !important;
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
  /*color: #E46256;*/
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
  margin-top: 60px;
}
</style>
