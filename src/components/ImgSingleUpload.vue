<template>
  <div :class="{'default-size': !customSize}">
    <div v-if="editable" :class="customSize ? 'custom-size' : 'full'">
      <el-upload
        action=""
        :show-file-list="false"
        :on-error="handleError"
        :http-request="upload"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
        :accept="accept"
        v-if="!progressVisible">
        <div v-if="value" :class="customSize ? 'custom-size' : 'fixed'">
          <img :src="value" :class="customSize ? 'custom-size' : 'full'">
          <div class="icon-wrapper">
            <i class="el-icon-edit icon"></i>
          </div>
        </div>
        <div v-else class="fixed">
          <div class="uploader-add-icon-wrapper">
            <i class="el-icon-plus uploader-add-icon"></i>
          </div>
        </div>
      </el-upload>
      <div class="progress-wrapper" v-else>
        <div class="uploader-progress">
          <el-progress
            type="circle"
            :percentage="percentage">
          </el-progress>
        </div>
      </div>
    </div>
    <template v-else>
      <div :class="customSize ? 'custom-size' : 'full'" @click="dialogVisible = true">
        <img :src="value" :class="customSize ? 'custom-size' : 'full'">
        <div class="icon-wrapper">
          <i class="el-icon-zoom-in icon"></i>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="value" alt="">
      </el-dialog>
    </template>
  </div>
</template>

<script>
import cos from '@/assets/cos'
import { Message } from 'element-ui'
import { randomStr } from '@/assets/util'
import { VueCropper } from 'vue-cropper'

/**
 *  如果确认更改，调用 confirmChanges 删除该删的
 *  如果取消更改，调用 cancelChanges 删除新加的
 *  如果 editable 为 true，root、uuid、path 必须非空
 */
export default {
  name: 'ImgUpload',
  components: {
    VueCropper
  },
  data: function () {
    return {
      img_file: '',
      Bucket: this.$config.Bucket,
      Region: this.$config.Region,
      dialogVisible: false,
      progressVisible: false,
      percentage: 0,
      tmpDeleteList: [],
      newlyAddedList: []
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
    value: {
      type: String
    },
    editable: {
      type: Boolean,
      default: true
    },
    customSize: {
      type: Boolean,
      default: false
    },
    widthLimit: {
      type: Number,
      default: -1
    },
    heightLimit: {
      type: Number,
      default: -1
    }
  },
  methods: {
    upload (event) {
      console.log('uploadImg', event)
      this.progressVisible = true
      let key = '/' + this.root + '/' + this.uuid + '/' + this.path + '/' + randomStr(10)
      if (event.file.type === 'image/jpeg') {
        key = key + '.jpg'
      } else if (event.file.type === 'image/png') {
        key = key + '.png'
      } else {
        console.log('wrong type', event.file.type)
      }
      let that = this
      console.log(event.file)
      cos.sliceUploadFile({
        Bucket: this.Bucket,
        Region: this.Region,
        Headers: {
          'Host': this.$config.Bucket + '.cos.ap-guangzhou.myqcloud.com'
        },
        Key: key,
        FilePath: key,
        Body: event.file,
        onProgress: function (progressData) {
          that.percentage = progressData.percent * 100
        }
      }, function (err, data) {
        console.log('cos sliceUploadFile callBack:', err, data)
        that.progressVisible = false
        if (err) {
          event.onError(err)
        } else {
          event.onSuccess(data)
        }
      })
    },
    handleSuccess (response, file) {
      console.log('handleSuccess', file)
      file.url = 'https://' + response.Location
      this.newlyAddedList.push(file.url)

      let oldValue = this.value
      this.$emit('input', file.url)
      if (oldValue) {
        this.handleRemove(oldValue)
      }
    },
    handleError (err, file) {
      Message.error(err)
    },
    handleRemove (url) {
      // console.log('handleRemove', url)
      this.tmpDeleteList.push(url)
    },
    handleBeforeUpload (file) {
      if (this.widthLimit > 0 || this.heightLimit > 0) {
        // 上传图片前处理函数
        let that = this
        return new Promise(function (resolve, reject) {
          let _URL = window.URL || window.webkitURL
          let image = new Image()
          image.onload = function () {
            // console.log('Image Size:', image.width, image.height)
            let valid = (that.widthLimit <= 0 || image.width === that.widthLimit) && (that.heightLimit <= 0 || image.height === that.heightLimit)
            valid ? resolve() : reject(new Error())
          }
          image.src = _URL.createObjectURL(file)
        }).then(
          () => {
            return file
          },
          (e) => {
            Message.error('上传图片尺寸不符合')
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
        console.log('delete deleted', objects)
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
        console.log('delete added', objects)
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
    }
  },
  beforeDestroy () {
    console.log('[ImgSingleUpload] beforeDestory')
    this.cancelChanges()
  }
}
</script>

<style scoped>
  .default-size {
    position: relative;
    width: 148px;
    height: 148px;
  }
  .custom-size {
    position: relative;
    width: 100%;
    border-radius: 6px;
  }
  .full {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .fixed {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    overflow: visible;
  }
  .icon-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    cursor: pointer;
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
  }
  .icon {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 20px;
    width: 20px;
    margin: auto;
    color: #fff;
    font-size: 20px;
  }
  .icon-wrapper:hover {
    opacity: 1;
  }
  .uploader-add-icon-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 6px;
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
    cursor: pointer;
    overflow: hidden;
    margin: auto;
  }
  .progress-wrapper {
    position: relative;
    background-color: white;
    width: 148px;
    height: 148px;
  }
  .uploader-progress {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 126px;
    height: 126px;
    margin: auto;
  }
</style>
