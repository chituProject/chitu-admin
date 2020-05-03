<template>
  <div :class="{'default-size': !customSize}">
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
    <div v-if="editable" :class="customSize ? 'custom-size' : 'full'">
      <div style="height: 40px">
        <div v-if="value" :class="customSize ? 'custom-size' : 'fixed'">
          <img :src="value" :class="customSize ? 'custom-size' : 'full'">
          <div class="icon-wrapper">
            <i class="el-icon-edit icon"></i>
            <input class="imageInput" type="file" name="images" accept="image/*" @change="setImage">
          </div>
        </div>
        <div v-else class="fixed">
          <div class="uploader-add-icon-wrapper">
            <i class="el-icon-plus uploader-add-icon"></i>
            <input class="imageInput" type="file" name="image" accept="image/*" @change="setImage">
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div :class="customSize ? 'custom-size' : 'full'" @click="dialogVisiblePic = true">
        <img :src="value" :class="customSize ? 'custom-size' : 'full'">
        <div class="icon-wrapper">
          <i class="el-icon-zoom-in icon"></i>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisiblePic" append-to-body>
        <img width="100%" :src="value" alt="">
      </el-dialog>
    </template>
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
      type: String
    },
    accept: {
      type: String,
      default: 'png'
    },
    widthLimit: {
      type: Number,
      default: 500
    },
    heightLimit: {
      type: Number,
      default: 500
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
    },
    // changeScale (num) {
    //   num = num || 1
    //   this.$refs.cropper.changeScale(num)
    // },
    // rotateLeft () {
    //   this.$refs.cropper.rotateLeft()
    // },
    // rotateRight () {
    //   this.$refs.cropper.rotateRight()
    // },
    updateFileList (l) {
      // console.log('update list', l)
      const newVal = []
      for (let index = 0; index < l.length; index++) {
        newVal.push(l[index].url)
      }
      // console.log('update list', newVal)
      this.$emit('input', newVal)
    },
    setImage (e) {
      console.log(e)
      var that = this
      const file = e.target.files[0]
      let url = window.URL || window.webkitURL
      let img = new Image()
      img.src = url.createObjectURL(file)
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

            let oldValue = that.value
            that.$emit('input', url)
            if (oldValue) {
              that.handleRemove(oldValue)
            }
          }
        })
      })
    },
    cancelCrop () {
      this.dialogCropper = false
      this.option.img = ''
    },
    handleRemove (url) {
      // console.log('handleRemove', url)
      this.tmpDeleteList.push(url)
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
    imgLoad (msg) {
      console.log(msg)
    }
  }
}
</script>

<style scoped>
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin:20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }
  .cut {
    margin: 30px auto;
  }
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
  .uploader-icon-wrapper {
    position: absolute;
    left: 160px;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 6px;
  }
  .uploader-icon-wrapper:hover {
    border-color: #f26250;
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
  .imageInput{
    position: absolute;
    left: 0px;
    top: 0px;
    width: 148px;
    height: 148px;
    opacity: 0;
    display: block;
    -ms-filter: 'alpha(opacity=0)';
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
</style>
