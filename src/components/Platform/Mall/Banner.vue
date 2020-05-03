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
        <div style="word-break: break-all;">{{ item.path }}</div>
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
      @close="onDialogClose"
      center>
      <el-form ref="Form" :model="form" :rules="rules">
        <el-form-item label="跳转路径(请填写SPU的uuid，可不填)">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item :label="type === 'HOME' ? '请上传banner（尺寸要求750*350）' : '请上传banner（尺寸要求700*350）'" prop="picture">
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

export default {
  name: 'MallBanner',
  components: {
    ImgSingleUpload,
    ImgSingleCropperUpload
  },
  data () {
    return {
      loading: false,
      list: [],
      // dialog
      dialogVisible: false,
      dialogIsAdd: true,
      dialogTargetId: -1,
      form: {
        path: '',
        picture: ''
      },
      rules: {
        path: [
          { required: true, message: '请输入跳转路径', trigger: 'blur' }
        ],
        picture: [
          { required: true, message: '请上传banner', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'HOME'
    }
  },
  watch: {
    type: function () {
      this.getData()
    }
  },
  methods: {
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/recommend_banner/?type=' + this.type)
        .then(res => {
          that.list = res.data
        })
        .finally(() => {
          that.loading = false
        })
    },
    onAdd () {
      this.form.path = ''
      this.form.picture = ''
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    onEdit (item) {
      this.dialogTargetId = item.id
      this.form.path = item.path
      this.form.picture = item.picture
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    onSubmit () {
      const that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          that.$refs.picture.confirmChanges()
          if (that.dialogIsAdd) {
            that.loading = true
            that.$axios.post('/insider/recommend_banner/', {
              picture: that.form.picture,
              path: that.form.path,
              type: that.type
            }).then(res => {
              that.getData()
            }).catch(() => {
              that.loading = false
            })
          } else {
            that.loading = true
            that.$axios.patch('/insider/recommend_banner/' + that.dialogTargetId + '/', {
              picture: that.form.picture,
              path: that.form.path
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
      this.$confirm('确认要删除这个 banner 吗？跳转路径(SPU的uuid)：' + item.path, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.loading = true
        that.$axios.delete('/insider/recommend_banner/' + item.id + '/')
          .then(res => {
            that.getData()
          })
          .catch(() => {
            that.loading = false
          })
      })
    },
    onDialogClose () {
      this.$refs.picture.cancelChanges()
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
