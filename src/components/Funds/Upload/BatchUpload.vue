<template>
  <div class="main-col">
    <div class="filter-container">
      <label for="file" class="el-button search-button">
        <i class="el-icon-plus"></i>
        <span>上传文件</span>
      </label>
      <input id="file" type="file" @change="onFileChange" />
      <h3 class="filename">{{ fileName }}</h3>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-tabs v-model="currentSheet" type="card" v-if="hasData">
          <el-tab-pane v-for="key in sheetTabs" :key="key" :label="key" :disabled="disabled">
            <!-- 原始excel表格 -->
            <el-table ref="form" :data="tableModel" stripe>
              <el-table-column label="表格字段" prop="col">
              </el-table-column>
              <el-table-column label="样例数据" prop="example">
              </el-table-column>
            </el-table>
            <!-- 原始excel表格 END -->
            <!--
            <custom-keys :disabled="disabled" :sheet-columns="sheetColumns" :example="sheet[0]" @change="updateCustomForm"></custom-keys>
            自定义字段END -->
            <el-form inline>
              <el-form-item label="唯一识别键" required>
                <el-select v-model="primaryKey" :disabled="disabled" placeholder="请选择">
                  <el-option
                    v-for="option in sheetColumns"
                    :key="option"
                    :label="option"
                    :value="option"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="import-button"
                  :disabled="disabled || !primaryKey"
                  type="primary"
                  @click="onSubmit()"
                >
                  导入该表格
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <empty-page v-else></empty-page>
        <el-dialog :visible="disabled && !!message" :show-close="false" :title="message">
          <el-progress :percentage="percentage"></el-progress>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import CustomKeys from './CustomKeys'
import { parseFile, modifiedEval } from './options'

export default {
  name: 'BatchUpload',
  components: {
    EmptyPage,
    CustomKeys
  },
  data () {
    return {
      // 还需要发送多少个请求，到0发送完毕，-1不需要发送
      sending: -1,
      disabled: false,
      // 上传信息
      message: '',
      percentage: 0,

      fileName: null,
      currentPage: 1,
      currentSheet: null,
      xlsx: {},
      // Excel预定义字段
      form: {},
      // 新增自定义字段
      customTableModel: [],

      primaryKey: null
    }
  },
  computed: {
    hasData () {
      return this.xlsx && Object.keys(this.xlsx).length
    },
    // 当前选中表格
    sheet () {
      if (!this.xlsx || this.currentSheet == null) return [{}]
      return this.xlsx[this.sheetTabs[+this.currentSheet]] || [{}]
    },
    // 所有表格名称
    sheetTabs () {
      return Object.keys(this.xlsx)
    },
    // 当前选中表格的表头字段
    sheetColumns () {
      if (!this.xlsx) return []
      return Object.keys(this.sheet[0])
    },
    tableModel () {
      const tab = `${this.sheetTabs[this.currentSheet]}`
      const firstEntryValues = Object.values(this.sheet[0])
      return this.sheetColumns.map((col, index) => ({
        col,
        example: firstEntryValues[index],
        type: `${tab}-${col}-type`,
        value: `${tab}-${col}-value`
      }))
    }
  },
  watch: {
    sending (val) {
      if (val === 0) {
        this.$message.success('上传完毕！')
        this.disabled = false
      }
    }
  },
  methods: {
    updateCustomForm (form) {
      this.customTableModel = form
    },
    async onFileChange (e) {
      this.disabled = true
      const files = e.target.files
      if (files && files[0]) {
        this.fileName = files[0].name
        this.xlsx = await parseFile(files[0])
        this.disabled = false
        this.initializeForm()
      }
    },
    async onSubmit () {
      this.disabled = true
      try {
        const errors = this.uploadErrors()
        if (!errors) {
          this.message = '数据预处理...'; this.percentage = 10
          this.message = '数据分割...'; this.percentage = 40
          const data = this.splitData()
          this.sending = data.length
          for (const d of data) {
            this.message = `发送${data.length}个数据块...`; this.percentage = 70
            const processed = await this.processSheet(d)
            this.sendData(processed)
          }
        } else {
          throw new Error(errors)
        }
      } catch (e) {
        this.$message.error(e.toString())
        this.sending = -1
        this.disabled = false
      }
    },
    uploadErrors () {
      const required = [ 'product_name', 'manager_name', 'month', 'net_value' ]
      const customKeys = this.customTableModel.map(i => i.value)
      const uploadKeys = Object.values(this.form).concat(customKeys)
      const errors = required.filter(key => !uploadKeys.includes(key))
      if (errors.length) {
        return '缺失字段：' + errors.toString()
      }
      return null
    },
    initializeForm () {
      if (!this.xlsx || !this.sheetTabs) return

      console.log('xlsx', this.xlsx)

      const rule = (col) => {
        console.log('col', col)
        const data = {type: '', value: ''}
        if (col.includes('基金名')) {
          data.type = 'General'
          data.value = 'product_name'
        } else if (col.match(/(经理|manager)/i)) {
          data.type = 'General'
          data.value = 'manager_name'
        } else if (col.match(/(日期|date)/i)) {
          data.type = 'yeji'
          data.value = 'month'
        } else if (col.match(/(净值|value)/i)) {
          data.type = 'yeji'
          data.value = 'net_value'
        }
        return data
      }

      this.sheetTabs.forEach(tab => {
        const sheet = this.xlsx[tab]
        if (!sheet) return
        const sheetCols = Object.keys(sheet[0])
        sheetCols.forEach(col => {
          const a = rule(col)
          this.$set(this.form, `${tab}-${col}-type`, a.type)
          this.$set(this.form, `${tab}-${col}-value`, a.value)
        })
      })
    },
    /**
     * 根据SPU主键拆分数据，每次最多传1000条SKU
     * @return Array<sheet>
     */
    splitData () {
      const splitSize = 500

      const splitFirst = (sheet) => {
        if (sheet.length <= splitSize) return {data: sheet, next: sheet.length}
        const primaryKeyValue = sheet[splitSize][this.primaryKey]
        const index = sheet.findIndex(i => i[this.primaryKey] === primaryKeyValue)
        if (!index) throw new Error(`看起来SPU太大了，已经超过${splitSize}! 分割数组：`, sheet)
        return {
          data: sheet.slice(0, index),
          next: index
        }
      }
      let index = 0
      let sheet = this.sheet
      const result = []
      while (index < this.sheet.length) {
        const res = splitFirst(sheet)
        if (res.data.length) {
          result.push(res.data)
        }
        index += res.next
        sheet = sheet.slice(res.next)
      }
      console.assert(result.reduce((acc, cur) => acc + cur.length, 0) === this.sheet.length, `解析错误，数据长度不匹配！`)
      return result
    },
    async processSheet (sheet) {
      const tab = this.sheetTabs[this.currentSheet]

      /**
       * 提取 SPU 的 meta_specification 和对应 SKU 的 specification
       * @param item 表格行对象
       * @returns [meta_specification, specification] 类型 [Array<string>, Array<string]
       */
      const extractMetaSpecification = (item) => {
        const specItem = Object.entries(item)
          .find(([key, value]) => this.form[`${tab}-${key}-value`] === 'meta_specification')
        if (!specItem) return []
        // "颜色：红，型号：XL" 的分割
        const specVal = specItem[1]
        const specTypeSplitter = /[，]/
        const specKvSplitter = /[：]/
        const specs = specVal
          .split(specTypeSplitter)
          .map(spec => spec.split(specKvSplitter))
          .map(spec => spec.length < 2 ? ['规格', '普通', ...spec] : spec)
        const metaSpecification = specs.map(i => i[0])
        const specification = specs.map(i => i[i.length - 1])
        return [metaSpecification, specification]
      }

      const extractCustomSpecs = (item, type) => {
        const customTable = this.customTableModel.filter(i => i.type && i.value && i.baseKey && i.fn && i.type === type)
        const values = Object.entries(item)
          .filter(([key, val]) => customTable.find(i => i.baseKey === key))
          .map(([key, val]) => {
            const model = customTable.find(i => i.baseKey === key)
            const _key = model.value
            const _val = modifiedEval(model.fn, val)
            return {[_key]: _val}
          })
        return Object.assign({}, ...values)
      }

      /**
       * 是否是空对象
       */
      const isEmpty = (item) => !item || !Object.keys(item).length

      // 获取 primaryKey: spuObject 字典
      const spuList = sheet.reduce((acc, cur) => {
        if (!acc[cur[this.primaryKey]]) {
          const spu = this.itemToProduct(cur, 'SPU')
          acc[cur[this.primaryKey]] = spu

          const customKeys = extractCustomSpecs(cur, 'SPU')
          if (!isEmpty(customKeys)) Object.assign(spu, customKeys)
          const extraParas = this.itemToProduct(cur, 'EXTRA')
          if (!isEmpty(extraParas)) spu['extra_paras'] = extraParas
        }
        return acc
      }, {})
      // 在字典 spuObject 中塞 skuObject
      sheet.forEach(cur => {
        const sku = this.itemToProduct(cur, 'SKU')
        const key = cur[this.primaryKey]
        if (!spuList[key] || isEmpty(sku)) return

        // eslint-disable-next-line no-unused-vars
        const [_, specification] = extractMetaSpecification(cur)
        if (specification) sku['specification'] = specification
        const customKeys = extractCustomSpecs(cur, 'SKU')
        if (!isEmpty(customKeys)) Object.assign(sku, customKeys)

        spuList[key].sku = spuList[key].sku || []
        spuList[key].sku.push(sku)
      })

      return Object.values(spuList)
    },
    async sendData (data) {
      this.$axios.post('/insider/goods_import', data)
        .finally(() => {
          this.sending -= 1
        })
    },
    // -------------------- UTILITY METHODS --------------------
    /**
     * 提取 SPU 或 SKU 或 CATEGORY 的字段，转换成 SPU 或 SKU 或 CATEGORY
     * @param item 表格行对象
     * @param type SKU | SPU | CATEGORY
     */
    itemToProduct (item, type) {
      const tab = this.sheetTabs[this.currentSheet]
      const values = Object.entries(item)
        .filter(([key, val]) => this.form[`${tab}-${key}-type`] === type)
        .filter(([key, val]) => this.form[`${tab}-${key}-value`] &&
          this.form[`${tab}-${key}-value`] !== 'meta_specification')
        .map(([key, val]) => ({[this.form[`${tab}-${key}-value`]]: val}))
      return Object.assign({}, ...values)
    },
    /**
     * 字符串比较（去空格）
     */
    stringEquals (s1, s2) {
      return s1 === s2 || s1.toString().trim() === s2.toString().trim()
    }
  }
}
</script>

<style scoped>
form {
  float: right;
  margin-top: 22px;
}
</style>
