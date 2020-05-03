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
        v-model="item.picture">
      </img-single-upload>
      <div style="padding: 14px; text-align: left">
        <div style="word-break: break-all;">{{ item.title }}</div>
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
      width="80%"
      @close="onDialogClose"
      append-to-body
      center>
      <el-form ref="Form" :model="form" :rules="rules" label-width="200px" label-position="left">
        <el-form-item label="ID" prop="id" v-if="form.id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item prop="picture">
          <span slot="label">Banner图<br>{{type === 'HOME' ? '（尺寸要求750*350）' : '请上传banner（尺寸要求700*350）'}}</span>
          <img-single-cropper-upload
            ref="picture"
            uuid="banner"
            root="recommend"
            path="home"
            :widthLimit="type === 'HOME' ? 750 : 700"
            :heightLimit="type === 'HOME' ? 350 : 350"
            style="margin-top: 50px"
            v-model="form.picture">
          </img-single-cropper-upload>
        </el-form-item>
        <el-form-item label="商品项（id）" prop="goods_list">
          <editable-tag-list v-model="form.goods_list" type="success"/>
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
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'
import EditableTagList from '@/components/EditableTagList'
import { deepCopy } from '@/assets/util'

export default {
  name: 'JumpPage',
  components: {
    ImgSingleUpload,
    EditableTagList,
    ImgSingleCropperUpload
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      dialogIsAdd: true,
      dialogTargetId: -1,
      list: [],
      tmp_delete: [],
      form: {
        title: '',
        picture: '',
        goods_list: []
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        goods_list: [
          { type: 'array', required: true, message: '请输入商品项', trigger: 'blur' }
        ],
        picture: [
          { required: true, message: '请上传banner', trigger: 'change' }
        ]
      },
      path_type: false
    }
  },
  props: {
    type: {
      default: 'HOME'
    }
  },
  methods: {
    onAdd () {
      this.form.title = ''
      this.form.picture = ''
      this.form.goods_list = []
      if (this.form.id) {
        delete this.form.id
      }
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    onEdit (item) {
      this.dialogTargetId = item.id
      this.form = deepCopy(item)
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    onSubmit () {
      const that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          that.$refs.picture.confirmChanges()
          if (that.dialogIsAdd) {
            that.$axios.post('/insider/homepage_jump_page/', that.form)
              .then(() => {
                that.$message.success('添加成功')
                that.getData()
              })
          } else {
            that.$axios.patch('/insider/homepage_jump_page/' + that.dialogTargetId + '/', that.form)
              .then(() => {
                that.$message.success('添加成功')
                that.getData()
              })
          }
          that.dialogVisible = false
        }
      })
    },
    onDelete (item) {
      const that = this
      this.$confirm('确认要删除这个跳转页面吗？标题：' + item.title, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.$axios.delete('/insider/homepage_jump_page/' + item.id + '/')
          .then(() => {
            that.$message.success('删除成功')
            that.getData()
          })
          .catch(err => {
            console.log(err)
            that.$message.err('删除失败')
          })
      }).catch(err => {
        console.log(err)
      })
    },
    onDialogClose () {
      this.$refs.picture.cancelChanges()
    },
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/homepage_jump_page/')
        .then(res => {
          console.log(res.data)
          that.list = res.data
        })
        .finally(() => {
          that.loading = false
        })
    }
  },
  created () {
    this.getData()
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
