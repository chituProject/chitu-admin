<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="submit">保存</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-card shadow="never" class="card">
          <el-row>
            <el-col :span="16">
              <el-form :model="form" :rules="rules" ref="form" label-width="130px" label-position="left">
                <el-row :gutter="20">
                  <el-col :span="11">
                    <el-form-item label="店铺名" prop="name">
                      <el-input v-model="form.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="姓名" prop="username">
                      <el-input v-model="form.username"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="11">
                    <el-form-item label="手机号码" prop="phone">
                      <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="身份证号" prop="idcard">
                      <el-input v-model="form.idcard"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="11">
                    <el-form-item label="工商营业执照号" prop="license">
                      <el-input v-model="form.license"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="11">
                    <el-form-item label="店铺地址" prop="area">
                      <el-cascader
                        style="width: 100%"
                        expand-trigger="hover"
                        size="large"
                        filterable
                        :options="allRegions"
                        v-model="form.area">
                      </el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label-width="0" prop="address">
                      <el-input v-model="form.address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-form label-width="130px" label-position="left">
                <el-form-item label="工商营业执照照片">
                  <img-single-upload
                    ref="license_picture"
                    :uuid="uuid"
                    root="reseller"
                    path="license_picture"
                    :customSize="true"
                    v-model="form.license_picture">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="店铺门头照片">
                  <img-single-upload
                    ref="facade_picture"
                    :uuid="uuid"
                    root="reseller"
                    path="facade_picture"
                    :customSize="true"
                    v-model="form.facade_picture">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="身份证正面">
                  <img-single-upload
                    ref="idcard_front"
                    :uuid="uuid"
                    root="reseller"
                    path="idcard_front"
                    :customSize="true"
                    v-model="form.idcard_front">
                  </img-single-upload>
                </el-form-item>
                <el-form-item label="身份证背面" style="margin-bottom: 0">
                  <img-single-upload
                    ref="idcard_back"
                    :uuid="uuid"
                    root="reseller"
                    path="idcard_back"
                    :customSize="true"
                    v-model="form.idcard_back">
                  </img-single-upload>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import UUID from 'uuid-js'
export default {
  name: 'SceneAddEdit',
  components: {
    ImgSingleUpload
  },
  data () {
    return {
      loading: false,
      isAdd: true,
      scene_uuid: null,
      form: {
        name: '',
        username: '',
        phone: '',
        idcard: '',
        license: '',
        area: [],
        address: '',
        license_picture: '',
        facade_picture: '',
        idcard_front: '',
        idcard_back: ''
      },
      allRegions: regionData,
      rules: {
        name: [
          { required: true, message: '请输入店铺名', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        license: [
          { required: true, message: '请输入工商营业执照号', trigger: 'blur' }
        ],
        area: [
          { type: 'array', required: true, message: '请选择区域', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入店铺地址', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    uuid: {
      type: String
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/reseller/' + this.uuid + '/')
        .then(res => {
          that.initForm(res.data)
        })
        .finally(() => {
          that.loading = false
        })
    },
    initForm (scene) {
      if (scene) {
        this.isAdd = false
        this.scene_uuid = scene.uuid
        this.form.name = scene.name
        this.form.username = scene.username
        this.form.phone = scene.phone
        this.form.idcard = scene.idcard
        this.form.license = scene.license
        this.form.area = this.t2c(scene.area.split(' '))
        this.form.address = scene.address
        this.form.license_picture = scene.license_picture
        this.form.facade_picture = scene.facade_picture
        this.form.idcard_front = scene.idcard_front
        this.form.idcard_back = scene.idcard_back
      } else {
        this.isAdd = true
        this.scene_uuid = UUID.create(1).hex
      }
    },
    c2t (list) {
      const result = []
      result[0] = CodeToText[list[0]]
      result[1] = CodeToText[list[1]]
      result[2] = CodeToText[list[2]]
      return result
    },
    t2c (list) {
      try {
        const result = []
        result[0] = TextToCode[list[0]].code
        result[1] = TextToCode[list[0]][list[1]].code
        result[2] = TextToCode[list[0]][list[1]][list[2]].code
        return result
      } catch (e) {
        return []
      }
    },
    submit () {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.confirmPicChange()
          that.loading = true
          if (!that.isAdd) {
            that.$axios.patch('/insider/reseller/' + that.scene_uuid + '/', that.deleteEmptyString({
              name: that.form.name,
              username: that.form.username,
              phone: that.form.phone,
              idcard: that.form.idcard,
              license: that.form.license,
              area: that.c2t(that.form.area).join(' '),
              address: that.form.address,
              license_picture: that.form.license_picture,
              facade_picture: that.form.facade_picture,
              idcard_front: that.form.idcard_front,
              idcard_back: that.form.idcard_back
            })).then(() => {
              that.goBack()
            }).finally(() => {
              that.loading = false
            })
          } else {
            that.$axios.post('/insider/reseller/', that.deleteEmptyString({
              uuid: that.scene_uuid,
              status: 'UNAUDITED',
              name: that.form.name,
              username: that.form.username,
              phone: that.form.phone,
              idcard: that.form.idcard,
              license: that.form.license,
              area: that.c2t(that.form.area).join(' '),
              address: that.form.address,
              license_picture: that.form.license_picture,
              facade_picture: that.form.facade_picture,
              idcard_front: that.form.idcard_front,
              idcard_back: that.form.idcard_back
            })).then(() => {
              that.goBack()
            }).finally(() => {
              that.loading = false
            })
          }
        }
      })
    },
    deleteEmptyString (ob) {
      for (var i in ob) {
        if (ob[i] === '') {
          delete ob[i]
        }
      }
      return ob
    },
    confirmPicChange () {
      this.$refs.license_picture.confirmChanges()
      this.$refs.facade_picture.confirmChanges()
      this.$refs.idcard_front.confirmChanges()
      this.$refs.idcard_back.confirmChanges()
    },
    cancelPicChange () {
      this.$refs.license_picture.cancelChanges()
      this.$refs.facade_picture.cancelChanges()
      this.$refs.idcard_front.confirmChanges()
      this.$refs.idcard_back.confirmChanges()
    }
  },
  created () {
    if (this.uuid) {
      this.getData()
    } else {
      this.initForm(null)
    }
  },
  beforeDestroy () {
    console.log('destroyed')
    // confirmChanges 和 cancelChanges 只会执行一个，不需要特殊处理
    this.cancelPicChange()
  }
}
</script>

<style scoped>

  .filter-container {
    padding: 12px;
  }
  .el-form-item img {
    width: 100%
  }
</style>
