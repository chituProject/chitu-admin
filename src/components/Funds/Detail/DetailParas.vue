<template>
  <div style="padding-top: 40px;">
    <div class="title">
      {{title}}
      <el-button v-if="edit" class="add-param" type="default" @click="addParam" icon="el-icon-plus">添加参数</el-button>
    </div>
    <template v-if="edit">
      <div v-for="(dd, index) in modelNew" :key="index" style="width: 50%; display: inline-block">
        <el-form-item
          :label="`${title}参数${index + 1}`"
          :rules="{ required: true, message: `请填写${title}参数${index + 1}的名称`, trigger: 'blur' }"
          style="width: 350px; display: inline-block">
          <el-input style="width: auto" :value="dd.key" @input="valueChange($event, index, 'key')" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item
          label-width="0"
          :rules="{ required: true, message: `请填写${title}参数${index + 1}的内容`, trigger: 'blur' }"
          style="width: auto; margin-left: 10px; display: inline-block">
          <el-input :value="dd.value" placeholder="请输入参数值" @input="valueChange($event, index, 'value')"></el-input>
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
        :data="value"
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
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Array
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
  watch: {
    edit (val) {
      console.log(val)
    }
  },
  mounted () {
    this.modelNew = this.value
  },
  methods: {
    removeParam (item) {
      this.$confirm('确认删除此参数？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.modelNew.indexOf(item)
        if (index >= 0) {
          this.modelNew.splice(index, 1)
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    },
    addParam () {
      this.modelNew.push({key: '', value: ''})
    },
    valueChange (value, index, key) {
      const item = this.modelNew[index]
      item[key] = value
      this.modelNew.splice(index, 1, item)
      this.$emit('change', this.modelNew)
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 20px !important;
  /*font-weight: bold;*/
  text-align: left;
  margin-bottom: 40px;
}
.add-param {
  margin-left: 30px;
}
.el-icon-error {
  cursor: pointer;
}
</style>
