<template>
  <div>
    <el-tag
      :key="tag"
      v-for="tag in value"
      :closable="!fixed"
      :type="type"
      :disable-transitions="false"
      @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      style="width: 80px"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
    </el-input>
    <el-button v-else-if="!fixed && value.length < limit" class="button-new-tag" size="small" @click="showInput">+ {{addText}}</el-button>
  </div>
</template>

<script>
export default {
  name: 'EditableTagList',
  data () {
    return {
      inputVisible: false,
      inputValue: ''
    }
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      },
      required: true
    },
    addText: {
      type: String,
      default: '新增'
    },
    type: {
      type: String,
      default: 'success'
    },
    limit: {
      type: Number,
      default: 2147483647
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose (tag) {
      this.value.splice(this.value.indexOf(tag), 1)
      this.$emit('input', this.value)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.value.push(inputValue)
        this.$emit('input', this.value)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-tag + .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .el-tag + .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
