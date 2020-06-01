<template>
  <div>
    <el-form inline>
      <el-button
        class="import-button"
        :disabled="disabled"
        type="primary"
        @click="addCustom()"
      >
        新增字段
      </el-button>
    </el-form>
    <!-- 新增字段 -->
    <el-table :data="customTableModel" stripe>
      <el-table-column label="基础已有字段">
        <template slot-scope="scope">
          <el-select :value="customTableModel[scope.$index]['baseKey']"
                     :disabled="disabled" placeholder="请选择"
                     @change="selectCustom($event, scope.$index, 'baseKey')"
          >
            <el-option
              v-for="option in sheetColumns"
              :key="option"
              :label="option"
              :value="option"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="样例数据" prop="example">
      </el-table-column>
      <el-table-column label="map规则">
        <template slot-scope="scope">
          (item) => {
          <!-- TODO: sandbox -->
          <el-input type="textarea" :disabled="disabled" autosize
                    :value="scope.row.fn" @input="mapCustom($event, scope.$index)">
          </el-input>
          }
        </template>
      </el-table-column>
      <el-table-column label="新字段类型">
        <template slot-scope="scope">
          <el-select
            clearable
            :disabled="disabled"
            :value="customTableModel[scope.$index]['type']"
            placeholder="请选择商品类型"
            @change="selectCustom($event, scope.$index, 'type')"
          >
            <el-option label="SPU" value="SPU"></el-option>
            <el-option label="SKU" value="SKU"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="新字段值">
        <template slot-scope="scope">
          <el-select
            clearable
            :value="customTableModel[scope.$index]['value']"
            placeholder="请选择字段"
            :disabled="!customTableModel[scope.$index]['type'] || disabled"
            @change="selectCustom($event, scope.$index, 'value')"
          >
            <template v-if="customTableModel[scope.$index]['type'] === 'SPU'">
              <el-option v-for="option in spuOptions" :key="option" :label="option" :value="option"></el-option>
            </template>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="50px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-close"
            circle
            @click="deleteCustom(scope.$index)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- 新增字段 END -->
  </div>
</template>

<script>
import { spuOptions, extraOptions, modifiedEval } from './options'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    sheetColumns: {
      type: Array
    },
    example: {
      type: Object
    }
  },
  data () {
    return {
      // 自定义字段
      customTableModel: [],

      spuOptions,
      extraOptions
    }
  },
  methods: {
    selectCustom (value, index, key) {
      const item = this.customTableModel[index]
      item[key] = value
      if (key === 'baseKey') {
        item['baseExample'] = this.example[value]
        item['type'] = ''; item['value'] = ''
        this.mapCustom('', index)
      }
      this.customTableModel.splice(index, 1, item)
      this.change()
    },
    addCustom () {
      this.customTableModel.push({baseKey: '', fn: '', example: '', baseExample: '', type: '', value: ''})
      this.change()
    },
    deleteCustom (index) {
      this.customTableModel.splice(index, 1)
      this.change()
    },
    mapCustom (value, index) {
      const trimmed = value.trim()
      const data = this.customTableModel[index]
      const example = data['baseExample']
      data['fn'] = value
      data['example'] = trimmed ? modifiedEval(trimmed, example) : example
      this.customTableModel.splice(index, 1, data)
      this.change()
    },
    change () {
      this.$emit('change', this.customTableModel)
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
