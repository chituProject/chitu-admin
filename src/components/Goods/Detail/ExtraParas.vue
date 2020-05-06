<template>
  <div style="padding-top: 40px;">
    <div class="title">额外参数（`extra_paras`）
      <el-button v-if="edit" class="add-param" type="default" @click="addParam" icon="el-icon-plus">添加参数</el-button>
    </div>
    <template v-if="edit">
      <div v-for="(dd, index) in modelNew" :key="index" style="width: 50%; display: inline-block">
        <el-form-item
          :label="'详细参数 ' + (index + 1)"
          :rules="{ required: true, message: '请填写详细参数', trigger: 'blur' }"
          style="width: 250px; display: inline-block">
          <el-input style="width: auto" :value="dd.key" @input="valueChange($event, index, 'key')" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item
          label-width="0"
          :rules="{ required: true, message: '请填写详细参数', trigger: 'blur' }"
          style="width: auto; margin-left: 10px; display: inline-block">
          <el-input :value="dd.value" @input="valueChange($event, index, 'value')" placeholder="请输入参数值"></el-input>
        </el-form-item>
        <el-form-item
          label-width="0"
          style="width: auto; margin-left: 10px; display: inline-block"
          v-if="modelNew.length >= 1">
          <i class="el-icon-error" @click.prevent="removeParam(dd)" style="color: #aaaaaa;"></i>
        </el-form-item>
      </div>
    </template>
    <div v-else>
      <el-table
        stripe
        :data="toArray(value)"
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
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modelNew: []
    }
  },
  mounted () {
    this.modelNew = this.toArray(this.value)
  },
  methods: {
    toArray (obj) {
      return Object.entries(obj).map(([key, value]) => ({key, value}))
    },
    toObject (arr) {
      const objArr = arr.map(i => ({[i.key]: i.value}))
      return Object.assign({}, ...objArr)
    },
    addParam () {
      this.modelNew.push({key: '', value: ''})
    },
    removeParam (item) {
      this.$confirm('确认删除此参数？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var index = this.modelNew.indexOf(item)
        if (index >= 0) {
          this.modelNew.splice(index, 1)
          this.$emit('change', this.toObject(this.modelNew))
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    },
    valueChange (value, index, key) {
      const item = this.modelNew[index]
      item[key] = value
      this.modelNew.splice(index, 1, item)
      this.$emit('change', this.toObject(this.modelNew))
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 20px !important;
  /*font-weight: bold;*/
  text-align: left;
  margin-top: 20px;
  margin-bottom: 40px;
}
.add-param {
  margin-left: 30px;
}
</style>
