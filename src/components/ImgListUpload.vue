<template>
  <div>
    <el-upload
      action=""
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-error="handleError"
      :http-request="upload"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :before-remove="handleBeforeRemove"
      :before-upload="handleBeforeUpload"
      :accept="accept"
      :limit="limit"
      v-if="editable">
      <i class="el-icon-plus"></i>
    </el-upload>
    <template v-else>
      <div v-for="(url, index) in value" :key="index" class="uploader-img" @click="handlePreview(url)">
        <img :src="url" class="uploader-img">
        <i class="el-icon-zoom-in uploader-icon"></i>
      </div>
    </template>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog
      :visible.sync="progressDialogVisible"
      title="上传图片"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body>
      <div style="margin-bottom: 20px;"><i class="el-icon-loading"></i>您上传的图片太长了，正在自动帮您裁剪，请勿进行其他操作或关闭网页</div>
      <el-progress :percentage="percent"></el-progress>
    </el-dialog>
  </div>
</template>

<script>
import cos from '@/assets/cos'
import { Message } from 'element-ui'
import { randomStr } from '@/assets/util'

/**
 *  如果确认更改，调用 confirmChanges 删除该删的
 *  如果取消更改，调用 cancelChanges 删除新加的
 *  如果 editable 为 true，root、uuid、path 必须非空
 */
export default {
  name: 'ImgUpload',
  data: function () {
    return {
      Bucket: this.$config.Bucket,
      Region: this.$config.Region,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      tmpDeleteList: [],
      newlyAddedList: [],
      // progress
      progressDialogVisible: false,
      uploadingImg: null,
      uploadingIndex: -1,
      uploadingProgress: 0,
      cropSchemeList: []
    }
  },
  props: {
    root: {
      type: String
    },
    uuid: {
      type: String
    },
    path: {
      type: String
    },
    accept: {
      type: String,
      default: 'image/png,image/jpeg'
    },
    limit: {
      type: Number,
      default: 100
    },
    value: {
      type: Array,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    widthLimit: {
      type: Number,
      default: -1
    },
    heightLimit: {
      type: Number,
      default: -1
    },
    cropHeightWhenTooLarge: {
      type: Boolean,
      default: true
    },
    cropHeight: {
      type: Number,
      default: 1400
    },
    // 高度小于 cropHeight * cropHeightThreshold 的部分将直接上传，否则每 cropHeight 切一次
    cropHeightThreshold: {
      type: Number,
      default: 1.5
    }
  },
  computed: {
    percent: function () {
      if (this.uploadingIndex < 0) {
        return 0
      }
      let percent = Math.round((this.uploadingIndex * 100 + this.uploadingProgress) / this.cropSchemeList.length)
      return percent > 100 ? 100 : percent
    }
  },
  watch: {
    value (val) {
      // console.log('update value', val)
      const l = []
      for (let index = 0; index < val.length; index++) {
        l.push({
          url: val[index]
        })
      }
      this.fileList = l
      // console.log('update value', l)
    }
  },
  methods: {
    upload (event) {
      console.log(event.file)
      this.doUpload(event.file, event.file.type, event.onSuccess, event.onError, event.onProgress)
    },
    doUpload (fileOrBlob, fileType, onSuccess, onError, onProgress) {
      let key = '/' + this.root + '/' + this.uuid + '/' + this.path + '/' + randomStr(10)
      if (fileType === 'image/jpeg') {
        key = key + '.jpg'
      } else if (fileType === 'image/png') {
        key = key + '.png'
      } else {
        console.log('wrong type', fileType)
      }
      cos.sliceUploadFile({
        Bucket: this.Bucket,
        Region: this.Region,
        Headers: {
          'Host': this.$config.Bucket + '.cos.ap-guangzhou.myqcloud.com'
        },
        Key: key,
        FilePath: key,
        Body: fileOrBlob,
        onProgress: function (progressData) {
          progressData.percent *= 100
          onProgress(progressData)
        }
      }, function (err, data) {
        console.log('cos sliceUploadFile callBack:', err, data)
        if (err) {
          onError(err)
        } else {
          onSuccess(data)
        }
      })
    },
    updateFileList (l) {
      // console.log('update list', l)
      const newVal = []
      for (let index = 0; index < l.length; index++) {
        newVal.push(l[index].url)
      }
      // console.log('update list', newVal)
      this.$emit('input', newVal)
    },
    handleSuccess (response, file, fileList) {
      file.url = 'https://' + response.Location
      console.log('handleSuccess', response, file, fileList)
      this.newlyAddedList.push(file.url)
      this.updateFileList(fileList)
    },
    handleRemove (file, fileList) {
      // console.log('handleRemove', file, fileList)
      this.tmpDeleteList.push(file.url)
      this.updateFileList(fileList)
    },
    // TODO 删除没上传完成的图片可能会导致图片残留
    handleBeforeRemove (file, fileList) {
      if (file.url.startsWith('blob')) {
        return true
      }
      let that = this
      return new Promise(function (resolve, reject) {
        that.$confirm('你确定要删除这张图片吗', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          resolve()
        }).catch(() => {
          reject(new Error())
        })
      })
    },
    handleError (err, file, fileList) {
      Message.error(err)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePreview (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    handleExceed (files, fileList) {
      Message.warning('超出数量限制')
    },
    handleBeforeUpload (file) {
      // console.log('before upload', file)
      // console.log('Size Limit:', this.widthLimit, this.heightLimit)
      if (this.widthLimit > 0 || this.heightLimit > 0) {
        // 上传图片前处理函数
        let that = this
        return new Promise(function (resolve, reject) {
          let _URL = window.URL || window.webkitURL
          let image = new Image()
          image.onload = function () {
            console.log('Image Size:', image.width, image.height)
            let valid = (that.widthLimit <= 0 || image.width === that.widthLimit) && (that.heightLimit <= 0 || image.height === that.heightLimit)
            if (valid && that.needCrop(image.height)) {
              that.initCrop(image)
              that.calcCrop()
              that.nextCropStep()
              reject(new Error())
            } else {
              if (valid) {
                resolve()
              } else {
                Message.error('上传图片尺寸不符合!')
                reject(new Error())
              }
            }
          }
          image.src = _URL.createObjectURL(file)
        }).then(
          () => {
            return file
          },
          (e) => {
            return Promise.reject(e)
          }
        )
      } else {
        return true
      }
    },
    // TODO 这两个函数没法保证一定会被调用，如直接关闭网页、直接点击其他未做处理 tab 等
    confirmChanges () {
      const objects = []
      for (let index = 0; index < this.tmpDeleteList.length; index++) {
        let key = this.tmpDeleteList[index].replace('https://' + this.$config.Bucket + '.cos.ap-guangzhou.myqcloud.com/', '')
          .replace('http://' + this.$config.Bucket + '.cos.ap-guangzhou.myqcloud.com/', '')
        if (!key.startsWith('http')) {
          objects.push({
            Key: key
          })
        }
      }
      if (objects.length > 0) {
        cos.deleteMultipleObject({
          Bucket: this.$config.Bucket,
          Region: this.$config.Region,
          Objects: objects
        }, function (err, data) {
          console.log(err || data)
        })
      }
      this.tmpDeleteList = []
      this.newlyAddedList = []
    },
    // TODO 这两个函数没法保证一定会被调用，如直接关闭网页、直接点击其他未做处理 tab 等
    cancelChanges () {
      const objects = []
      for (let index = 0; index < this.newlyAddedList.length; index++) {
        let key = this.newlyAddedList[index].replace('https://' + this.$config.Bucket + '.cos.ap-guangzhou.myqcloud.com/', '')
          .replace('http://' + this.$config.Bucket + '.cos.ap-guangzhou.myqcloud.com/', '')
        if (!key.startsWith('http')) {
          objects.push({
            Key: key
          })
        }
      }
      if (objects.length > 0) {
        cos.deleteMultipleObject({
          Bucket: this.$config.Bucket,
          Region: this.$config.Region,
          Objects: objects
        }, function (err, data) {
          console.log(err || data)
        })
      }
      this.tmpDeleteList = []
      this.newlyAddedList = []
    },
    // crop image
    initCrop (image) {
      this.progressDialogVisible = true
      this.uploadingImg = image
      this.uploadingIndex = -1
      this.cropSchemeList = []
    },
    needCrop (height) {
      return this.cropHeightWhenTooLarge && height > this.cropHeightThreshold * this.cropHeight
    },
    calcCrop () {
      this.uploadingIndex = -1
      let remainingHeight = this.uploadingImg.height
      let start = 0
      while (remainingHeight > this.cropHeightThreshold * this.cropHeight) {
        this.cropSchemeList.push({
          start: start,
          height: this.cropHeight
        })
        start += this.cropHeight
        remainingHeight -= this.cropHeight
      }
      this.cropSchemeList.push({
        start: start,
        height: remainingHeight
      })
      console.log('crop scheme', this.cropSchemeList)
    },
    nextCropStep () {
      this.uploadingIndex++
      this.uploadingProgress = 0
      if (this.uploadingIndex < this.cropSchemeList.length) {
        // next step
        let blob = this.cropImage(this.cropSchemeList[this.uploadingIndex])
        this.uploadCroppedImage(blob)
      } else {
        // finish
        this.finishCrop()
      }
    },
    cropImage (scheme) {
      // console.log('current crop scheme', scheme)
      let canvas = document.createElement('CANVAS')
      canvas.width = this.uploadingImg.width
      canvas.height = scheme.height
      let context = canvas.getContext('2d')
      context.drawImage(this.uploadingImg, 0, scheme.start, this.uploadingImg.width, scheme.height, 0, 0, canvas.width, canvas.height)

      // 将 canvas 转换为 blob
      let data = canvas.toDataURL()
      // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
      data = data.split(',')[1]
      data = window.atob(data)
      let ia = new Uint8Array(data.length)
      for (let i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i)
      }
      // canvas.toDataURL 返回的默认格式就是 image/png
      return new Blob([ia], { type: 'image/png' })
    },
    uploadCroppedImage (blob) {
      // console.log('upload image')
      let that = this
      this.doUpload(blob, 'image/png', (data) => {
        let file = { url: 'https://' + data.Location }
        that.newlyAddedList.push(file.url)
        that.fileList.push(file)
        that.updateFileList(that.fileList)
        that.nextCropStep()
      }, (e) => {
        console.log(e)
      }, (progress) => {
        // console.log(progress)
        this.uploadingProgress = progress
      })
    },
    finishCrop () {
      this.progressDialogVisible = false
    }
  },
  beforeDestroy () {
    console.log('[ImgListUpload] beforeDestory')
    this.cancelChanges()
  }
}
</script>

<style scoped>
  .uploader-img {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    display: inline-block;
    margin: 0 8px 8px 0;
  }
  .uploader-img .uploader-icon {
    display: none;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 148px;
    height: 148px;
    line-height: 148px;
    left: 0;
    top: 0;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
  }
  .uploader-img:hover .uploader-icon {
    display: inline-block;
    cursor: pointer;
    opacity: 1;
  }
</style>
