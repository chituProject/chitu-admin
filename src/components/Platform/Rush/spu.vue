<template>
  <div>
    <div class="card-container" v-if="spu && model">
      <el-form class="demo-table-expand" label-width="100px" label-position="left" :loading="loading">
        <div class="title">SPU基本信息</div>
        <div class="spu-table">
          <el-form-item label="SPU">
            <span>{{model.id}}</span>
          </el-form-item>
          <el-form-item label="SPU状态">
            <span>{{status[model.shelf_status]}}</span>
          </el-form-item>
          <el-form-item label="供应商" >
            <span>{{model.merchant==null?"":model.merchant.name}}</span>
          </el-form-item>
          <el-form-item label="品牌" >
            <span>{{model.brand==null?"":model.brand.name}}</span>
          </el-form-item>
          <el-form-item  label="所属品类">
            <span v-for="(category, i) in model.category_third" :key="i">
              <span v-if="i !== 0">，</span>
              {{ category }}
            </span>
          </el-form-item>
          <el-form-item label="产品标签" >
            <editable-tag-list v-model="model.tags" type="success" :limit="3" fixed/>
          </el-form-item>
          <el-form-item label="适合性别" >
            <span v-if="model.for_gender===0">全</span>
            <span v-else-if="model.for_gender===1">男</span>
            <span v-else>女</span>
          </el-form-item>
          <el-form-item label="商品标题" >
            <span>{{model.title}}</span>
          </el-form-item>
          <el-form-item label="完整标题" >
            <span>{{model.full_title}}</span>
          </el-form-item>
          <el-form-item label="SKU型号类型" prop="meta_specification">
            <editable-tag-list v-model="model.meta_specification" type="success" :limit="3" fixed/>
          </el-form-item>
          <el-form-item label="默认SKU">
            <span>{{ model.default_sku || "未创建默认SKU"}}</span>
          </el-form-item>
          <el-form-item label="产品描述" >
            <span>{{model.description}}</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="card-container" v-if="sku && item && spu && model">
      <el-form class="demo-table-expand" label-width="100px" label-position="left" :loading="loading">
        <div class="title" v-if="sku">SKU基本信息</div>
        <div class="sku-table">
          <el-form-item label="SKU">
            <span>{{model.id}}-{{item.id}}</span>
          </el-form-item>
          <el-form-item label="SKU状态">
            <span>{{status[item.shelf_status]}}</span>
          </el-form-item>
          <el-form-item
            v-for="(spec, j) in model.meta_specification"
            :key="j+100000"
            :label="spec">
            <span>{{item.specification[j]}}</span>
          </el-form-item>
          <el-form-item label="供货价(元)" >
            <span>{{ item.cost | formatPrice }}</span>
          </el-form-item>
          <el-form-item label="发货地点" >
            <span v-if="item.delivery_stock_data && item.delivery_stock_data.length > 0">{{item.delivery_stock_data[0].area}} {{item.delivery_stock_data[0].address}}{{item.is_individual_delivery ? '（独立仓库）' : ''}}</span>
          </el-form-item>
          <el-form-item label="发货时间(天)" >
            <span>{{item.delivery_time}}</span>
          </el-form-item>
          <el-form-item label="运费(元)" >
            <span>{{item.shipment_fee | formatPrice}}</span>
          </el-form-item>
          <el-form-item label="默认快递" >
            <span>{{item.default_express}}</span>
          </el-form-item>
          <template v-if="item.goods_type === 'SICORDER'">
            <el-form-item label="第三方市场价(元)" >
              <span>{{item.market_price | formatPrice}}</span>
            </el-form-item>
            <el-form-item label="第三方建议零售价(元)" >
              <span>{{item.retail_price | formatPrice}}</span>
            </el-form-item>
          </template>
          <el-form-item label="市场价(元)" >
            <span>{{item.primitive_price | formatPrice}}</span>
          </el-form-item>
          <el-form-item label="促销价(元)" >
            <span>{{item.price | formatPrice}}</span>
          </el-form-item>
          <el-form-item label="场景-返利(元)" >
            <span>{{item.rebate | formatPrice}}</span>
          </el-form-item>
          <el-form-item label="免单金(元)" >
            <span>{{item.offpay_limit | formatPrice}}</span>
          </el-form-item>
          <el-form-item label="绑定分成(元)" >
            <span>{{item.bind_offpay | formatPrice}}</span>
          </el-form-item>
          <el-row>
            <el-form-item label="SKU图" prop="sku_pic">
              <img-single-upload
                :uuid="item.uuid"
                root="sku"
                path="main"
                :editable="false"
                v-model="item.sku_pic">
              </img-single-upload>
            </el-form-item>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { deepCopy } from '@/assets/util'
import constants from '@/assets/constants'
import ImgListUpload from '@/components/ImgListUpload'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import EditableTagList from '@/components/EditableTagList'

export default {
  components: {
    ImgListUpload,
    ImgSingleUpload,
    EditableTagList
  },
  props: {
    spu: {
      type: Number,
      required: false
    },
    sku: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      loading: false,
      // spu
      model: null,
      // sku
      item: null,
      status: constants.SHELF_STATUS
    }
  },
  mounted () {
    this.fetchData()
    this.$watch('spu', debounce(() => { this.fetchData() }, 1000))
    this.$watch('sku', () => { this.setSKU() })
    this.$watch('model', () => { this.setSKU() })
  },
  methods: {
    fetchData () {
      if (!this.spu) return
      this.loading = true
      this.$axios.get('/insider/goods/' + this.spu + '/')
        .then(res => {
          this.$emit('spu', res.data)
          this.model = this.decodeForm(res.data)
          if (this.model.sku) this.$emit('sku', this.model.sku)
        })
        .catch(() => {
          this.$message.error('找不到该SPU!')
        })
        .finally(() => {
          this.loading = false
        })
    },
    decodeForm (form) {
      const tmpForm = deepCopy(form)
      tmpForm.category_third = (form.category_third || []).map(i => i.name)
      if (tmpForm.sku) {
        for (let i = 0; i < tmpForm.sku.length; i++) {
          if (!tmpForm.sku[i].specification.startsWith('[')) {
          // sku 型号旧数据处理
            tmpForm.sku[i].specification = [tmpForm.sku[i].specification]
          } else {
          // sku 型号新数据处理
            tmpForm.sku[i].specification = JSON.parse(tmpForm.sku[i].specification)
          }
        }
      }
      return tmpForm
    },
    setSKU () {
      if (!this.model || !this.spu || !this.sku) return
      this.item = this.model.sku.find(item => item.id === this.sku)
      if (!this.item) {
        this.$message.error(`找不到SPU ID为${this.spu}, SKU ID为${this.sku}的商品！`)
      }
    }
  }
}
</script>

<style scoped>
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
