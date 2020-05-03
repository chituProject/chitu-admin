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
        <div class="bottom" v-if="editable" v-can:edit="'Platform'">
          <el-button v-if="list.length > 1" type="text" class="button" @click.stop="onDelete(item)">删除</el-button>
          <el-button type="text" class="button" @click.stop="onEdit(item)">编辑</el-button>
        </div>
      </div>
    </el-card>
    <div class="uploader-add-icon-wrapper" v-can:edit="'Platform'" @click.stop="onAdd" v-if="list.length < limit">
      <i class="el-icon-plus uploader-add-icon"></i>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      @close="onDialogClose"
      append-to-body
      center>
      <el-form ref="Form" :model="form" :rules="rules">
        <el-switch
          v-model="path_type"
          active-text="跳转至商品"
          inactive-text="跳转至列表">
        </el-switch>
        <el-form-item :label="path_type ? '请输入要跳转商品的SPU' : '请输入跳转路径'" prop="path">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item :label="pageBanner ? '请上传banner（尺寸要求750*500）' : '请上传banner（尺寸要求750*370）'" prop="picture">
          <img-single-cropper-upload
            ref="picture"
            uuid="banner"
            root="recommend"
            path="home"
            :widthLimit="750"
            :heightLimit="pageBanner ? 500 : 370"
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
import axios from 'axios'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'

export default {
  name: 'PageBanner',
  components: {
    ImgSingleUpload,
    ImgSingleCropperUpload
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      dialogIsAdd: true,
      dialogTargetId: -1,
      tmp_delete: [],
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
      },
      path_type: false
    }
  },
  props: {
    list: {
      default: []
    },
    limit: {
      default: 100
    },
    editable: {
      default: true
    },
    homepage: {
      default: null
    },
    pageBanner: {
      default: true
    }
  },
  methods: {
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
      this.path_type = item.path_type === 'GOODS'
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    onSubmit () {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.$refs.picture.confirmChanges()
          if (this.dialogIsAdd) {
            this.list.push({
              picture: this.form.picture,
              path: this.form.path,
              path_type: this.path_type ? 'GOODS' : 'CATEGORY',
              is_new: true,
              homepage: this.homepage
            })
          } else {
            const itemIndex = this.list.findIndex(item => item.id === this.dialogTargetId)
            this.list.splice(itemIndex, 1, {
              picture: this.form.picture,
              path: this.form.path,
              path_type: this.path_type ? 'GOODS' : 'CATEGORY',
              changed: true
            })
          }
          this.dialogVisible = false
        }
      })
    },
    onDelete (item) {
      this.$confirm('确认要删除这个 banner 吗？跳转路径(SPU的uuid)：' + item.path, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.tmp_delete.push(item)
        const itemIndex = this.list.findIndex(i => i.id === item.id)
        this.list.splice(itemIndex, 1)
      }).catch(err => {
        console.log(err)
      })
    },
    save () {
      this.loading = true
      const deleteReq = (item) => this.$axios.delete(`/insider/homepage_banner_item/${item.id}/`)
      const postReq = (item) => this.$axios.post('/insider/homepage_banner_item/', item)
      const patchReq = (item) => this.$axios.patch('/insider/homepage_banner_item/' + item.id + '/', item)
      axios.all([
        ...this.tmp_delete.map(item => deleteReq(item)),
        ...this.list.filter(item => item.is_new).map(item => postReq(item)),
        ...this.list.filter(item => item.changed && !item.is_new).map(item => patchReq(item))
      ])
        .catch(() => {
          this.$message.error('保存Banner失败！')
        })
        .finally(() => {
          this.$emit('finish-save')
          this.loading = false
        })
    },
    onDialogClose () {
      this.$refs.picture.cancelChanges()
    }
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
