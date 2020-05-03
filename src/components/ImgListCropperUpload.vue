<template>
  <div>
    <el-dialog title="裁剪图片" :visible.sync="dialogCropper" :width="dialogWidth" :append-to-body="true">
      <div class="cut" :style="{width: width,height: height}">
        <vue-cropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="accept" :info="option.fixedBox" :full="option.full"
                     :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
                     :auto-crop="option.autoCrop" :auto-crop-width="cropperWidth" :auto-crop-height="cropperHeight" :center-box="option.centerBox"
                     :high="option.high" @img-load="imgLoad" ></vue-cropper>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-input v-model="widthNew" placeholder="请输入裁剪宽度" v-if="isWidth" v-on:blur="changeWidth" style="width: 30%;float: left;margin-left: 30px;"></el-input>
        <el-input v-model="heightNew" placeholder="请输入裁剪高度" v-if="isHeight" v-on:blur="changeHeight" style="width: 30%;float: left;margin-left: 30px;"></el-input>
        <el-button @click="refreshCrop">重置</el-button>
        <el-button @click="cancelCrop">取 消</el-button>
        <el-button type="primary" @click="uploadImg">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="editable">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li :tabindex="index" class="el-upload-list__item is-success" v-for="(url, index) in value" :key="index">
          <img :src="url" class="el-upload-list__item-thumbnail">
          <a class="el-upload-list__item-name">
            <i class="el-icon-document"></i>
          </a>
          <i class="el-icon-close"></i>
          <i class="el-icon-close-tip">按 delete 键可删除</i>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(url)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="deleteImg(index)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </li>
      </ul>
      <div v-if="limit > value.length" tabindex="0" class="el-upload el-upload--picture-card">
        <i class="el-icon-plus"></i>
        <input type="file" name="file" accept="image/*" class="imageInput" @change="setImage">
      </div>
    </div>
    <template v-else>
      <div v-for="(url, index) in value" :key="index" class="uploader-img">
        <img :src="url" class="uploader-img">
        <i class="el-icon-zoom-in uploader-icon"></i>
      </div>
    </template>
    <el-dialog :visible.sync="dialogVisiblePic" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import cos from '@/assets/cos'
import { VueCropper } from 'vue-cropper'
import { randomStr } from '@/assets/util'

export default {
  name: 'ImgSupload',
  components: {
    VueCropper
  },
  data: function () {
    return {
      widthNew: '',
      heightNew: '',
      Bucket: this.$config.Bucket,
      Region: this.$config.Region,
      cropper: '',
      option: {
        img: '',
        size: 1,
        full: false,
        canMove: true,
        fixedBox: true,
        original: false,
        canMoveBox: false,
        // 只有自动截图开启 宽度高度才生效
        autoCrop: true,
        centerBox: false,
        high: true
      },
      dialogVisiblePic: false,
      dialogImageUrl: '',
      dialogCropper: false,
      dialogWidth: '600px',
      width: '500px',
      height: '500px',
      cropperWidth: '',
      cropperHeight: '',
      isWidth: false,
      isHeight: false,
      tmpDeleteList: [],
      newlyAddedList: []
    }
  },
  mounted () {
    this.init(this.widthLimit, this.heightLimit)
    if (!this.isHeightTrue) {
      this.isHeight = true
    }
    if (!this.isWightTrue) {
      this.isWidth = true
    }
  },
  props: {
    root: {
      type: String
    },
    uuid: {
      type: String
    },
    customSize: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    path: {
      type: String
    },
    value: {
      type: Array,
      required: true
    },
    accept: {
      type: String,
      default: 'jpeg'
    },
    widthLimit: {
      type: Number,
      default: 500
    },
    heightLimit: {
      type: Number,
      default: 500
    },
    limit: {
      type: Number,
      default: 100
    },
    isHeightTrue: {
      type: Boolean,
      default: true
    },
    isWightTrue: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    changeWidth () {
      this.init(parseInt(this.widthNew), parseInt(this.cropperHeight))
      this.refreshCrop()
    },
    changeHeight () {
      this.init(parseInt(this.widthLimit), parseInt(this.heightNew))
      this.refreshCrop()
    },
    refreshCrop () {
      this.$refs.cropper.refresh()
    },
    init (width, height) {
      this.cropperWidth = width
      this.cropperHeight = height
      this.width = width + 'px'
      this.height = height + 'px'
      this.dialogWidth = width + 100 + 'px'
    },
    handlePictureCardPreview (url) {
      console.log(url)
      this.dialogImageUrl = url
      this.dialogVisiblePic = true
    },
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
    deleteImg (index) {
      this.value.splice(index, 1)
    },
    setImage (e) {
      console.log(e)
      var that = this
      if (e.target.files.length > 0) {
        const file = e.target.files[0]
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function () {
          if (!file.type.includes('image/')) {
            return
          }
          const reader = new FileReader()
          reader.onload = (event) => {
            that.dialogCropper = true
            let arr = event.target.result.split(',')
            that.option.img = arr[1]
            that.option.img = event.target.result
          }
          reader.readAsDataURL(file)
        }
      } else {
        return true
      }
    },
    uploadImg () {
      let that = this
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        console.log(data)
        let param = new FormData()
        param.append('file', data, `${Date.now()}.png`)
        console.log(param.getAll('file')[0])
        // let arr = data.split(',')
        let key = '/' + this.root + '/' + this.uuid + '/' + this.path + '/' + randomStr(10)
        if (data.type === 'image/jpeg') {
          key = key + '.jpg'
        } else if (data.type === 'image/png') {
          key = key + '.png'
        } else {
          console.log('wrong type', data.type)
        }
        cos.sliceUploadFile({
          Bucket: this.Bucket,
          Region: this.Region,
          Headers: {
            'Host': this.Bucket + '.cos.ap-guangzhou.myqcloud.com'
          },
          Key: key,
          FilePath: key,
          Body: param.getAll('file')[0],
          onProgress: function (progressData) {
            that.percentage = progressData.percent * 100
          }
        }, function (err, data) {
          console.log('cos sliceUploadFile callBack:', err, data)
          if (err) {
            console.log(err)
          } else {
            that.dialogCropper = false
            let url = 'https://' + data.Location
            that.newlyAddedList.push(url)
            let newVal = that.value
            newVal.push(url)
            that.$emit('input', newVal)
          }
        })
      })
    },
    cancelCrop () {
      this.dialogCropper = false
      this.option.img = ''
    },
    imgLoad (msg) {
      console.log(msg)
    }
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
  .cut {
    margin: 30px auto;
  }
  .imageInput{
    position: absolute;
    bottom: 24px;
    width: 148px;
    height: 148px;
    opacity: 0;
    display: block;
    -ms-filter: 'alpha(opacity=0)';
  }
</style>
