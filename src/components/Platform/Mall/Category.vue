<template>
  <div class="content-table" v-loading="loading">
    <el-card
      :body-style="{ padding: '0px' }"
      v-for="(item, index) in list"
      :key="index"
      shadow="never">
      <img-single-upload
        :editable="false"
        :customSize="true"
        class="image"
        v-model="item.category_first.logo">
      </img-single-upload>
      <div style="padding: 14px; text-align: left">
        <div style="word-break: break-all;">{{ item.category_first.name }}</div>
        <div class="bottom" v-can:edit="'Platform'">
          <el-button type="text" class="button" @click.stop="onDelete(item)">删除</el-button>
          <el-button type="text" class="button" @click.stop="onEdit(item)">编辑</el-button>
        </div>
      </div>
    </el-card>
    <div class="uploader-add-icon-wrapper" @click.stop="onAdd" v-can:edit="'Platform'">
      <i class="el-icon-plus uploader-add-icon"></i>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" :model="form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="选择品类" prop="category">
          <el-select v-model="form.category" style="width: 100%">
            <el-option
              v-for="item in allCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click.stop="onSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImgSingleUpload from '@/components/ImgSingleUpload'

export default {
  name: 'MallCategory',
  components: {
    ImgSingleUpload
  },
  data () {
    return {
      loading: false,
      list: [],
      allCategories: [],
      // dialog
      dialogVisible: false,
      dialogIsAdd: true,
      dialogTargetId: -1,
      form: {
        category: ''
      },
      rules: {
        category: [
          { required: true, message: '请选择品类', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/recommend_category/')
        .then(res => {
          that.list = res.data
        })
        .finally(() => {
          that.loading = false
        })
    },
    getAllCategories () {
      let that = this
      this.$axios.get('/insider/category_first/')
        .then(res => {
          that.allCategories = res.data
        })
    },
    onAdd () {
      this.form.category = ''
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    onEdit (item) {
      this.dialogTargetId = item.id
      this.form.category = item.category_first.id
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    onSubmit () {
      const that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          if (that.dialogIsAdd) {
            that.loading = true
            that.$axios.post('/insider/recommend_category/', {
              category_first: that.form.category
            }).then(res => {
              that.getData()
            }).catch(() => {
              that.loading = false
            })
          } else {
            that.loading = true
            that.$axios.patch('/insider/recommend_category/' + that.dialogTargetId + '/', {
              category_first: that.form.category
            }).then(res => {
              that.getData()
            }).catch(() => {
              that.loading = false
            })
          }
          that.dialogVisible = false
        }
      })
    },
    onDelete (item) {
      const that = this
      this.$confirm('确认要删除推荐品类【' + item.category_first.name + '】吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.loading = true
        that.$axios.delete('/insider/recommend_category/' + item.id + '/')
          .then(res => {
            that.getData()
          })
          .catch(() => {
            that.loading = false
          })
      })
    }
  },
  created () {
    this.getData()
    this.getAllCategories()
  }
}
</script>

<style scoped>
  .content-table {
    width: 100%;
    display: grid;
    grid-template-columns: repeat( auto-fill, minmax(200px, 1fr) );
    grid-gap: 10px;
  }
  .image {
    width: 100%;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    flex-direction: row-reverse;
  }
  .button {
    margin: 0 0 0 10px;
    padding: 0;
  }
  .uploader-add-icon-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 200px;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 6px;
    cursor: pointer;
  }
  .uploader-add-icon-wrapper:hover {
    border-color: #f26250;
  }
  .uploader-add-icon {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 28px;
    height: 28px;
    font-size: 28px;
    color: #8c939d;
    overflow: hidden;
    margin: auto;
  }
</style>
