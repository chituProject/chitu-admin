<template>
  <div class="main-col" v-loading="loading">
    <div class="offpay-life-category-wrapper">
      <div
        class="offpay-life-category"
        :class="goodChosen === item.id ? 'offpay-life-category-chosen' : ''"
        v-for="(item, index) in categories"
        :key="index"
        @click.stop="onClickCategory(item.id)">
        {{ item.name }}
      </div>
    </div>
    <div style="text-align: right; padding-right: 10px">
      <el-button type="primary" size="medium" icon="el-icon-plus" @click.stop="addGood" v-can:edit="'Platform'">新增类别</el-button>
    </div>
    <div class="card-container">
      <el-table
        ref="table0"
        stripe
        :data="goodList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="title"
          label="类别">
        </el-table-column>
        <el-table-column
          align="center"
          label="图标">
          <template slot-scope="scope"><img :src="scope.row.main_picture" style="width: 50px; height: 50px"></template>
        </el-table-column>
        <el-table-column
          align="center"
          v-if="$can('edit', 'Platform')"
          label="操作">
          <template slot-scope="scope">
            <i class="iconfont category-card-icon" v-if="scope.row.shelf_status === 'ON'" @click.stop="toggleGoodVisibility(scope.row)">&#xe60c;</i>
            <i class="iconfont category-card-icon" v-if="scope.row.shelf_status === 'OFF'" @click.stop="toggleGoodVisibility(scope.row)">&#xe68d;</i>
            <i class="iconfont category-card-icon" @click.stop="editGood(scope.row)">&#xe62c;</i>
            <i class="iconfont category-card-icon" @click.stop="deleteGood(scope.row)">&#xe63d;</i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: right; padding-right: 10px">
      <el-button type="primary" size="medium" icon="el-icon-plus" @click.stop="addSku" v-can:edit="'Platform'">新增类别</el-button>
    </div>
    <div class="card-container">
      <el-table
        ref="table1"
        stripe
        :data="itemList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="title"
          label="选项类别">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sku"
          label="选项名称">
        </el-table-column>
        <el-table-column
          align="center"
          label="售价">
          <template slot-scope="scope">{{ formatPrice(scope.row.cost) }}元</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button :disabled="!$can('edit', 'Platform')" class="blue_button_filled" icon="el-icon-edit" circle @click.stop="editSku(scope.row)"></el-button>
            <el-button :disabled="!$can('edit', 'Platform')" type="primary" icon="el-icon-delete" circle @click.stop="deleteSku(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="goodDialogVisible"
      @close="onDialogClose"
      center>
      <el-form ref="goodForm" :model="goodForm" :rules="goodRules" label-width="120px" label-position="left">
        <el-form-item label="品类ID" prop="id" v-if="goodForm.id">
          <span>{{goodForm.id}}</span>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="goodForm.name"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="merchant">
          <el-select v-model="goodForm.merchant" @change="handleMerchantChange">
            <el-option
              v-for="item in merchant"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="goodForm.brand">
            <el-option
              v-for="item in brand"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="logo">
          <img-single-upload
            ref="logo"
            :uuid="'' + goodChosen"
            root="category"
            path="logo"
            :customSize="true"
            style="width: 80px"
            v-model="goodForm.logo">
          </img-single-upload>
        </el-form-item>
        <el-form-item label="SKU型号类型" prop="meta_specification">
          <editable-tag-list v-model="goodForm.meta_specification" type="success" :limit="3"/>
        </el-form-item>
        <div style="margin-bottom: 20px">
          <div style="float: left; width: 120px">详细参数</div>
          <el-button class="add-param" type="default" @click="addParam" icon="el-icon-plus">添加参数</el-button>
        </div>
        <div v-for="(dd, index) in goodForm.extra_paras" :key="index" style="width: 100%; display: flex;">
          <el-form-item
            :label="'参数 ' + (index + 1)"
            :prop="'extra_paras.' + index + '.key'"
            :rules="{ required: true, message: '请填写参数', trigger: 'blur' }"
            style="width: 250px; display: inline-block">
            <el-input style="width: auto" v-model="dd.key" placeholder="请输入参数名称"></el-input>
          </el-form-item>
          <el-form-item
            label-width="0"
            :prop="'extra_paras.' + index + '.value'"
            :rules="{ required: true, message: '请填写参数', trigger: 'blur' }"
            style="width: auto; margin-left: 10px; display: inline-block; flex: 1">
            <el-input v-model="dd.value" :placeholder="goodForm.extra_paras[index].hint ? goodForm.extra_paras[index].hint : '请输入参数值'"></el-input>
          </el-form-item>
          <el-form-item
            label-width="0"
            style="width: auto; margin-left: 10px; display: inline-block">
            <i class="el-icon-error" @click.prevent="removeParam(dd)" style="color: #aaaaaa;"></i>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="goodDialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click.stop="submitGoodForm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="skuDialogVisible"
      center>
      <el-form ref="skuForm" :model="skuForm" :rules="skuRules" label-width="80px" label-position="left">
        <el-form-item label="ID" prop="id" v-if="skuForm.id">
          <span>{{skuForm.id}}</span>
        </el-form-item>
        <el-form-item label="选项标题" v-if="skuForm.id">
          <span>{{skuForm.title}}</span>
        </el-form-item>
        <el-form-item label="选项标题" prop="goodId" v-else>
          <el-select
            v-model="skuForm.goodId"
            style="width: 100%"
            placeholder="请选择">
            <el-option
              v-for="(item, j) in goodList"
              :key="j"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项名称" prop="sku">
          <el-input v-model="skuForm.sku"></el-input>
        </el-form-item>
        <el-form-item label="售价" prop="cost">
          <el-input v-model.number="skuForm.cost"></el-input>
        </el-form-item>
        <div style="margin-bottom: 20px">
          <div style="float: left; width: 80px">详细参数</div>
          <el-button class="add-param" type="default" @click="addSKUParam" icon="el-icon-plus">添加参数</el-button>
        </div>
        <div v-for="(dd, index) in skuForm.extra_options" :key="index" style="width: 100%; display: flex;">
          <el-form-item
            :label="'参数 ' + (index + 1)"
            :prop="'extra_options.' + index + '.key'"
            :rules="{ required: true, message: '请填写参数', trigger: 'blur' }"
            style="width: 250px; display: inline-block">
            <el-input style="width: auto" v-model="dd.key" placeholder="请输入参数名称"></el-input>
          </el-form-item>
          <el-form-item
            label-width="0"
            :prop="'extra_options.' + index + '.value'"
            :rules="{ required: true, message: '请填写参数', trigger: 'blur' }"
            style="width: auto; margin-left: 10px; display: inline-block; flex: 1">
            <el-input v-model="dd.value" :placeholder="skuForm.extra_options[index].hint ? skuForm.extra_options[index].hint : '请输入参数值'"></el-input>
          </el-form-item>
          <el-form-item
            label-width="0"
            style="width: auto; margin-left: 10px; display: inline-block">
            <i class="el-icon-error" @click.prevent="removeSKUParam(dd)" style="color: #aaaaaa;"></i>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="skuDialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click.stop="submitSkuForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatTime, formatPrice, deepCopy } from '@/assets/util'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import config from '@/config'
import EditableTagList from '@/components/EditableTagList'

export default {
  name: 'offpaylife',
  components: {
    ImgSingleUpload, EditableTagList
  },
  data () {
    return {
      loading: false,
      brand: [],
      goodChosen: 0,
      categories: [],
      goodList2: [],
      goodList: [],
      // list
      itemList: [],
      // dialog
      goodDialogVisible: false,
      goodDialogTargetId: -1,
      goodDialogIsAdd: false,
      goodRules: {
        merchant: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '请选择品牌', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传图标', trigger: 'change' }
        ],
        meta_specification: [
          { required: true, message: '请设定 SKU 型号类型', trigger: 'blur' }
        ]
      },
      goodForm: {
        id: '',
        name: '',
        logo: '',
        extra_paras: [],
        merchant: '',
        brand: '',
        meta_specification: []
      },
      // sku
      skuDialogVisible: false,
      skuDialogTargetId: -1,
      skuDialogIsAdd: false,
      skuRules: {
        sku: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        goodId: [
          { required: true, message: '请选择类别', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入售价', trigger: 'blur' }
        ]
      },
      skuForm: {
        goodId: '',
        id: '',
        title: '',
        sku: '',
        cost: '',
        extra_options: []
      },
      saveSuccess: false
    }
  },
  computed: {
    merchant () {
      return this.$store.state.merchant
    }
  },
  methods: {
    formatTime,
    formatPrice,
    onClickCategory (id) {
      this.goodChosen = id
      this.getData()
    },
    handleMerchantChange (uuid) {
      this.brand = []
      let that = this
      console.log('handleMerchantChange', this.merchant)
      this.merchant.forEach(item => {
        if (item.uuid === uuid) {
          that.brand = item.brand
        }
      })
      this.goodForm.brand = ''
    },
    getData () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/goods/?category_third=' + this.goodChosen)
        .then(res => {
          console.log('getData', res.data.results)
          that.goodList = res.data.results
          that.getItemList()
        })
        .finally(() => {
          that.loading = false
        })
    },
    getItemList () {
      let promiseList = []
      this.goodList.forEach(good => {
        promiseList.push(this.$axios.get('/insider/goods/' + good.id + '/'))
      })
      Promise.all(promiseList).then(response => {
        console.log('getItemList', response)
        let tmpList = []
        response.forEach(res => {
          res.data.sku.forEach(sku => {
            tmpList.push({
              goodsId: sku.goods,
              id: sku.id,
              title: res.data.title,
              sku: JSON.parse(sku.specification)[0],
              cost: sku.cost,
              extra_options: sku.extra_options
            })
          })
        })
        this.itemList = tmpList
      })
    },
    addGood () {
      this.goodForm.name = ''
      this.goodForm.logo = ''
      this.goodForm.meta_specification = []
      this.goodForm.extra_paras = [
        {
          key: 'business_id',
          value: '',
          hint: 'hf/yk/hy'
        },
        {
          key: 'recharge_no',
          value: '',
          hint: '填写required或者-1之类的，表示需要从用户获得'
        },
        {
          key: 'recharge_type',
          value: '',
          hint: '中石化101，中石油102，话费201(互娱请删除此字段)'
        }
      ]
      if (this.goodForm.id) {
        delete this.goodForm.id
      }
      if (this.$refs.goodForm) {
        this.$refs.goodForm.clearValidate()
      }
      this.goodDialogIsAdd = true
      this.goodDialogVisible = true
      this.saveSuccess = false
    },
    editGood (item) {
      console.log('editGood', item)
      this.saveSuccess = false
      this.goodDialogTargetId = item.id
      if (this.$refs.goodForm) {
        this.$refs.goodForm.clearValidate()
      }
      this.goodForm.id = item.id
      this.goodForm.name = item.title
      if (item.merchant != null && item.brand != null) {
        this.goodForm.merchant = item.merchant.uuid
        this.handleMerchantChange(this.goodForm.merchant)
        this.goodForm.brand = item.brand.id
      }
      this.goodForm.logo = item.main_picture
      this.goodForm.meta_specification = item.meta_specification
      this.goodForm.extra_paras = this.decodeExtraParas(item.extra_paras)
      this.goodDialogIsAdd = false
      this.goodDialogVisible = true
    },
    deleteGood (item) {
      let that = this
      this.$confirm('确定要删除这个类别吗?', '删除类别', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.loading = true
        this.$axios.delete('/insider/goods/' + item.id + '/')
          .then(res => {
            that.getData()
          })
          .finally(() => {
            that.loading = false
          })
      })
    },
    groundGood (item, action) {
      let that = this
      that.loading = true
      this.$axios.post('/insider/goods/' + item.id + '/ground/', {
        action: action
      })
        .then(() => {
          that.getData()
        })
        .catch(error => {
          console.log(error)
          that.loading = false
        })
    },
    toggleGoodVisibility (item) {
      if (item.shelf_status === 'ON') {
        this.groundGood(item, 0)
      } else {
        this.groundGood(item, 1)
      }
    },
    removeParam (item) {
      this.$confirm('确认删除此参数？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        var index = this.goodForm.extra_paras.indexOf(item)
        if (index !== -1) {
          this.goodForm.extra_paras.splice(index, 1)
        }
      })
    },
    removeSKUParam (item) {
      this.$confirm('确认删除此参数？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        var index = this.skuForm.extra_options.indexOf(item)
        if (index !== -1) {
          this.skuForm.extra_options.splice(index, 1)
        }
      })
    },
    addParam () {
      this.goodForm.extra_paras.push({
        key: '',
        value: ''
      })
    },
    addSKUParam () {
      this.skuForm.extra_options.push({
        key: '',
        value: ''
      })
    },
    encodeForm (form) {
      let tmpForm = deepCopy(form)
      let tmpParas = deepCopy(form.extra_paras)
      tmpForm.extra_paras = {}
      for (let index in tmpParas) {
        tmpForm.extra_paras[tmpParas[index].key] = tmpParas[index].value
      }
      return tmpForm
    },
    encodeSKUForm (form) {
      let tmpForm = deepCopy(form)
      let tmpParas = deepCopy(form.extra_options)
      tmpForm.extra_options = {}
      for (let index in tmpParas) {
        tmpForm.extra_options[tmpParas[index].key] = tmpParas[index].value
      }
      console.log(tmpForm.extra_options)
      tmpForm.extra_options = JSON.stringify(tmpForm.extra_options)
      console.log(tmpForm.extra_options)
      return tmpForm
    },
    decodeExtraParas (extraParas) {
      let tmpParas = []
      console.log(extraParas)
      for (let key in extraParas) {
        tmpParas.push({
          key: key,
          value: extraParas[key]
        })
      }
      console.log(tmpParas)
      return tmpParas
    },
    submitGoodForm () {
      let that = this
      this.$refs.goodForm.validate((valid) => {
        if (valid) {
          console.log(that.goodDialogIsAdd)
          if (that.goodDialogIsAdd) {
            that.loading = true
            that.$axios.post('/insider/goods/', that.encodeForm({
              merchant: that.goodForm.merchant,
              brand: that.goodForm.brand,
              title: that.goodForm.name,
              main_picture: that.goodForm.logo,
              category_third: [that.goodChosen],
              extra_paras: that.goodForm.extra_paras,
              full_title: that.goodForm.name,
              description: that.goodForm.name,
              tags: [that.goodForm.name],
              banner_pictures: [],
              goods_type: 'LIFE',
              meta_specification: that.goodForm.meta_specification,
              after_sales: [that.goodForm.logo],
              graphic_text: []
            })).then(res => {
              console.log(res.data)
              that.getData()
            }).finally(() => {
              that.loading = false
              that.goodDialogVisible = false
            })
          } else {
            that.$axios.patch('/insider/goods/' + that.goodForm.id + '/', that.encodeForm({
              merchant: that.goodForm.merchant,
              brand: that.goodForm.brand,
              title: that.goodForm.name,
              main_picture: that.goodForm.logo,
              extra_paras: that.goodForm.extra_paras
            })).then(() => {
              that.$message.success('保存成功')
              that.saveSuccess = true
              that.getData()
            }).catch(() => {
              that.$message.error('保存失败')
            }).finally(() => {
              that.loading = false
              that.goodDialogVisible = false
            })
          }
        } else {
          this.$message.error('请填写所有项目')
        }
      })
    },
    onDialogClose () {
      if (!this.saveSuccess) {
        this.$refs.logo.cancelChanges()
      }
    },
    addSku () {
      this.skuForm.title = ''
      this.skuForm.sku = ''
      this.skuForm.cost = ''
      this.skuForm.extra_options = []
      if (this.skuForm.id) {
        delete this.skuForm.id
      }
      if (this.$refs.skuForm) {
        this.$refs.skuForm.clearValidate()
      }
      this.skuDialogIsAdd = true
      this.skuDialogVisible = true
    },
    editSku (item) {
      window.open(window.location.origin + '/#/goods/detail/' + item.goodsId)
    },
    deleteSku (item) {
      let that = this
      this.$confirm('确定要删除这个选项吗?', '删除选项', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.loading = true
        this.$axios.delete('/insider/sku/' + item.id + '/')
          .then(res => {
            that.getItemList()
          })
          .finally(() => {
            that.loading = false
          })
      })
    },
    submitSkuForm () {
      let that = this
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          if (that.skuDialogIsAdd) {
            that.loading = true
            that.$axios.post('/insider/sku/', that.encodeSKUForm({
              goods: that.skuForm.goodId,
              specification: JSON.stringify([that.skuForm.sku]),
              cost: that.skuForm.cost * 100,
              price: that.skuForm.cost * 100,
              sku_pic: 'mock',
              delivery_time: 0,
              default_express: '顺丰速运',
              extra_options: that.skuForm.extra_options
            })).then(res => {
              console.log(res.data)
              that.getItemList()
            }).finally(() => {
              that.loading = false
              that.skuDialogVisible = false
            })
          } else {
            that.$axios.patch('/insider/sku/' + that.skuForm.id + '/', that.encodeSKUForm({
              specification: JSON.stringify([that.skuForm.sku]),
              cost: that.skuForm.cost * 100,
              price: that.skuForm.cost * 100,
              extra_options: that.skuForm.extra_options
            })).then(() => {
              that.$message.success('保存成功')
              that.getItemList()
            }).catch(() => {
              that.$message.error('保存失败')
            }).finally(() => {
              that.loading = false
              that.skuDialogVisible = false
            })
          }
        } else {
          this.$message.error('请填写所有项目')
        }
      })
    }
  },
  mounted () {
    this.categories = config.categories
    this.goodChosen = this.categories[0].id
    this.getData()
    if (!this.merchant) {
      let that = this
      this.$axios.get('/insider/goods/merchant/')
        .then(res => {
          that.$store.commit('SET_MERCHANT', res.data)
        })
        .catch(err => {
          console.log(err)
          that.$message.warning('暂时无法获取供应商列表')
        })
    }
  }
}
</script>

<style scoped>
  .offpay-life-category-wrapper {
    margin: 10px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat( 4, 1fr );
    grid-column-gap: 10px;
  }
  .offpay-life-category {
    text-align: center;
    height: 60px;
    line-height: 60px;
    background-color: white;
  }
  .offpay-life-category-chosen {
    border: 2px solid #f56250;
    color: #f56250;
    line-height: 56px;
  }
  .category-card-icon {
    margin: 0 10px;
    cursor: pointer;
  }
</style>
