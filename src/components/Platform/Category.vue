<template>
  <div class="main-col">
    <el-row :gutter="10">
      <el-col :span="8" v-loading="loading_1">
        <div class="category-container">
          <div class="category-title">一级品类</div>
          <el-button class="category-add" icon="el-icon-plus" type="primary" @click.stop="add(1)" v-can:edit="'Platform'">新增</el-button>
        </div>
        <el-card
          class="category-card"
          :class="category_1.id === category.id ? 'category-card-active' : ''"
          v-for="(category, index) in category_1_list"
          :key="index"
          @click.native="onChooseCategory(1, category)"
          shadow="never">
          <div class="category-card-content">
            <div>{{ category.name }}</div>
            <div v-can:edit="'Platform'">
              <i class="iconfont category-card-icon" @click.stop="edit(1, category)">&#xe62c;</i>
              <i class="iconfont category-card-icon" @click.stop="toggleCategoryVisibility(1, category)">{{ category.visible ? '&#xe68d;' : '&#xe60c;' }}</i>
              <i class="iconfont category-card-icon" @click.stop="deleteFirst(category.id)">&#xe63d;</i>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="loading_2">
        <div class="category-container">
          <div class="category-title">二级品类</div>
          <el-button class="category-add" icon="el-icon-plus" type="primary" :disabled="!category_1.id" @click.stop="add(2)" v-can:edit="'Platform'">新增</el-button>
        </div>
        <el-card
          class="category-card"
          :class="category_2.id === category.id ? 'category-card-active' : ''"
          v-for="(category, index) in category_2_list"
          :key="index"
          @click.native="onChooseCategory(2, category)"
          shadow="never">
          <div class="category-card-content">
            <div>{{ category.name }}</div>
            <div v-can:edit="'Platform'">
              <i class="iconfont category-card-icon" @click.stop="edit(2, category)">&#xe62c;</i>
              <i class="iconfont category-card-icon" @click.stop="toggleCategoryVisibility(2, category)">{{ category.visible ? '&#xe68d;' : '&#xe60c;' }}</i>
              <i class="iconfont category-card-icon" @click.stop="deleteSecond(category.id)">&#xe63d;</i>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="loading_3">
        <div class="category-container">
          <div class="category-title">三级品类</div>
          <el-button class="category-add" icon="el-icon-plus" type="primary" :disabled="!category_2.id" @click.stop="add(3)" v-can:edit="'Platform'">新增</el-button>
        </div>
        <el-card
          class="category-card"
          :class="category_3.id === category.id ? 'category-card-active' : ''"
          v-for="(category, index) in category_3_list"
          :key="index"
          @click.native="onChooseCategory(3, category)"
          shadow="never">
          <div class="category-card-content">
            <div>{{ category.name }}</div>
            <div v-can:edit="'Platform'">
              <i class="iconfont category-card-icon" @click.stop="edit(3, category)">&#xe62c;</i>
              <i class="iconfont category-card-icon" @click.stop="toggleCategoryVisibility(3, category)">{{ category.visible ? '&#xe68d;' : '&#xe60c;' }}</i>
              <i class="iconfont category-card-icon" @click.stop="deleteThird(category.id)">&#xe63d;</i>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      width="360px"
      @close="onDialogClose"
      center>
      <el-form ref="Form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="品类ID" prop="id" v-if="form.id">
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="品类名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="品类图标" prop="logo">
          <img-single-upload
            ref="logo"
            :uuid="uuid"
            root="category"
            path="logo"
            :customSize="true"
            style="width: 80px"
            v-model="form.logo">
          </img-single-upload>
        </el-form-item>
        <el-form-item label="品类banner(528*194)" :prop="dialogTargetLevel === 1 ? 'banner' : ''" v-show="dialogTargetLevel === 1">
          <img-single-cropper-upload
            ref="banner"
            :uuid="uuid"
            root="category"
            path="banner"
            :customSize="true"
            :widthLimit="528"
            :heightLimit="194"
            style="width: 80px"
            v-model="form.banner">
          </img-single-cropper-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click.stop="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImgSingleUpload from '@/components/ImgSingleUpload'
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'

export default {
  name: 'PlatformCategory',
  components: {
    ImgSingleUpload,
    ImgSingleCropperUpload
  },
  data () {
    return {
      loading_1: false,
      category_1: {},
      category_1_list: [],
      loading_2: false,
      category_2: {},
      category_2_list: [],
      loading_3: false,
      category_3: {},
      category_3_list: [],
      // dialog
      dialogVisible: false,
      dialogIsAdd: true,
      dialogTargetLevel: 1,
      dialogTargetId: -1,
      form: {
        name: '',
        logo: '',
        banner: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入品类名称', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传品类图标', trigger: 'change' }
        ],
        banner: [
          { required: true, message: '请上传品类banner', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    uuid () {
      switch (this.dialogTargetLevel) {
        case 1:
          return 'first'
        case 2:
          return 'second'
        case 3:
          return 'third'
        default:
          return 'error'
      }
    }
  },
  methods: {
    onChooseCategory (level, category) {
      switch (level) {
        case 1:
          this.category_1 = category
          this.getSecond()
          break
        case 2:
          this.category_2 = category
          this.getThird()
          break
        case 3:
          this.category_3 = category
          break
      }
    },
    toggleCategoryVisibility (level, category) {
      let that = this
      switch (level) {
        case 1:
          this.loading_1 = true
          this.$axios.patch('/insider/category_first/' + category.id + '/', {
            visible: !category.visible
          }).then(res => {
            category.visible = res.data.visible
          }).finally(() => {
            that.loading_1 = false
          })
          break
        case 2:
          this.loading_2 = true
          this.$axios.patch('/insider/category_second/' + category.id + '/', {
            visible: !category.visible
          }).then(res => {
            category.visible = res.data.visible
          }).finally(() => {
            that.loading_2 = false
          })
          break
        case 3:
          this.loading_3 = true
          this.$axios.patch('/insider/category_third/' + category.id + '/', {
            visible: !category.visible
          }).then(res => {
            category.visible = res.data.visible
          }).finally(() => {
            that.loading_3 = false
          })
          break
      }
    },
    getFirst () {
      let that = this
      this.loading_1 = true
      this.$axios.get('/insider/category_first/')
        .then(res => {
          // if (!res.data) {
          //   return
          // }
          // for (let i = 0; i < res.data.length; i++) {
          //   if (res.data[i] && res.data[i].name === '免单生活') {
          //     res.data.splice(i, 1)
          //     break
          //   }
          // }
          that.category_1_list = res.data
          that.category_1 = {}
          that.category_2_list = []
          that.category_2 = {}
          that.category_3_list = []
          that.category_3 = {}
        })
        .finally(() => {
          that.loading_1 = false
        })
    },
    addFirst () {
      let that = this
      this.loading_1 = true
      this.$axios.post('/insider/category_first/', {
        name: this.form.name,
        logo: this.form.logo,
        banner: this.form.banner
      }).then(res => {
        that.getFirst()
      }).catch(() => {
        that.loading_1 = false
      })
    },
    patchFirst () {
      let that = this
      this.loading_1 = true
      this.$axios.patch('/insider/category_first/' + this.dialogTargetId + '/', {
        name: this.form.name,
        logo: this.form.logo,
        banner: this.form.banner
      }).then(res => {
        that.getFirst()
      }).catch(() => {
        that.loading_1 = false
      })
    },
    deleteFirst (id) {
      let that = this
      this.loading_1 = true
      this.$axios.delete('/insider/category_first/' + id + '/')
        .then(res => {
          that.getFirst()
        }).catch(() => {
          that.loading_1 = false
        })
    },
    getSecond () {
      let that = this
      this.loading_2 = true
      this.$axios.get('/insider/category_first/' + this.category_1.id + '/')
        .then(res => {
          that.category_2_list = res.data.category_second
          that.category_2 = {}
          that.category_3_list = []
          that.category_3 = {}
        })
        .finally(() => {
          that.loading_2 = false
        })
    },
    addSecond () {
      let that = this
      this.loading_2 = true
      this.$axios.post('/insider/category_second/', {
        name: this.form.name,
        logo: this.form.logo,
        category_first: this.category_1.id
      }).then(res => {
        that.getSecond()
      }).catch(() => {
        that.loading_2 = false
      })
    },
    patchSecond () {
      let that = this
      this.loading_2 = true
      this.$axios.patch('/insider/category_second/' + this.dialogTargetId + '/', {
        name: this.form.name,
        logo: this.form.logo
      }).then(res => {
        that.getSecond()
      }).catch(() => {
        that.loading_2 = false
      })
    },
    deleteSecond (id) {
      let that = this
      this.loading_2 = true
      this.$axios.delete('/insider/category_second/' + id + '/')
        .then(res => {
          that.getSecond()
        }).catch(() => {
          that.loading_2 = false
        })
    },
    getThird () {
      let that = this
      this.loading_3 = true
      this.$axios.get('/insider/category_second/' + this.category_2.id + '/')
        .then(res => {
          that.category_3_list = res.data.category_third
          that.category_3 = {}
        })
        .finally(() => {
          that.loading_3 = false
        })
    },
    addThird () {
      let that = this
      this.loading_3 = true
      this.$axios.post('/insider/category_third/', {
        name: this.form.name,
        logo: this.form.logo,
        category_second: this.category_2.id
      }).then(res => {
        that.getThird()
      }).catch(() => {
        that.loading_3 = false
      })
    },
    patchThird () {
      let that = this
      this.loading_3 = true
      this.$axios.patch('/insider/category_third/' + this.dialogTargetId + '/', {
        name: this.form.name,
        logo: this.form.logo
      }).then(res => {
        that.getThird()
      }).catch(() => {
        that.loading_3 = false
      })
    },
    deleteThird (id) {
      let that = this
      this.loading_3 = true
      this.$axios.delete('/insider/category_third/' + id + '/')
        .then(res => {
          that.getThird()
        }).catch(() => {
          that.loading_3 = false
        })
    },
    add (target) {
      this.form.name = ''
      this.form.logo = ''
      this.form.banner = ''
      if (this.form.id) {
        delete this.form.id
      }
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogTargetLevel = target
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    edit (target, item) {
      this.dialogTargetLevel = target
      this.dialogTargetId = item.id
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.form.id = item.id
      this.form.name = item.name
      this.form.logo = item.logo
      this.form.banner = item.banner
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    submitForm () {
      const that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          that.$refs.logo.confirmChanges()
          that.$refs.banner.confirmChanges()
          if (that.dialogIsAdd) {
            switch (that.dialogTargetLevel) {
              case 1:
                that.addFirst()
                break
              case 2:
                that.addSecond()
                break
              case 3:
                that.addThird()
                break
            }
          } else {
            switch (that.dialogTargetLevel) {
              case 1:
                that.patchFirst()
                break
              case 2:
                that.patchSecond()
                break
              case 3:
                that.patchThird()
                break
            }
          }
          that.dialogVisible = false
        }
      })
    },
    onDialogClose () {
      console.log('onDialogClose')
      this.$refs.logo.cancelChanges()
      this.$refs.banner.cancelChanges()
    }
  },
  created () {
    this.getFirst()
  }
}
</script>

<style scoped>
  .category-container {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .category-title {
    float: left;
    font-size: 20px;
    font-weight: bold;
  }
  .category-add {
    float: right;
  }
  .category-card {
    margin: 1px 10px 0 10px;
    background-color: white;
    cursor: pointer;
    font-size: 16px;
  }
  .category-card-active {
    background-color: #f5f5f5;
  }
  .category-card-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .category-card-icon {
    margin: 0 10px;
  }
</style>
