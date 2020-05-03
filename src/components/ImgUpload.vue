<template>
  <div class="upload">
    <input type="file" name="file" :id="fileId" @change="uploadImg($event)" class="inputfile" accept="image/*"/>
    <label :for="fileId" class="el-button"><i class="el-icon-plus"></i></label>
  </div>
</template>

<script>
import cos from '@/assets/cos'
import { Message } from 'element-ui'
import { randomStr } from '@/assets/util'

export default {
  name: 'ImgUpload',
  data: function () {
    return {
      img_file: '',
      Bucket: this.$config.Bucket,
      Region: this.$config.Region,
      fileId: randomStr(10)
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
    }
  },
  methods: {
    uploadImg (event) {
      // console.log('uploadImg', event.target.files[0])
      if (event.target.files.length === 0) {
        return
      }
      let key = '/' + this.root + '/' + this.uuid + '/'
      if (this.root === 'goods' && this.path !== 'main_picture') {
        key = key + this.path + '/'
      }
      key = key + event.target.files[0].name
      let that = this
      const loading = this.$loading({
        lock: true
      })
      cos.sliceUploadFile({
        Bucket: this.Bucket,
        Region: this.Region,
        Headers: {
          'Host': this.$config.Bucket + '.cos.ap-guangzhou.myqcloud.com'
        },
        Key: key,
        FilePath: key,
        Body: event.target.files[0]
      }, function (err, data) {
        loading.close()
        console.log('cos sliceUploadFile callBack:', err, data)
        if (err) {
          Message.error('上传失败！')
        } else {
          that.$emit('imgBack', {url: 'https://' + data.Location, path: that.path, root: that.root})
        }
      })
    }
  }
}
</script>

<style scoped>
.upload {
  display:inline-block;
  /*width: 100%;*/
  box-sizing: border-box;
  /*height: 100px;*/
  /*margin: 20px;*/
  /*text-align: center;*/
}
.inputfile {
  opacity: 0;
}
</style>
