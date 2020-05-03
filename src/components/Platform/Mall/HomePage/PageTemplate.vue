<template>
  <div class="content-table" v-loading="loading">
    <el-card
      :body-style="{ padding: '0px' }"
      v-for="(item, index) in list"
      v-if="!item.deleted"
      :key="index"
      shadow="never">
      <img-single-upload
        v-if="item.is_new || item.changed"
        :editable="false"
        :customSize="true"
        class="image"
        v-model="item.img_path">
      </img-single-upload>
      <template-card v-else :item="item"></template-card>
      <div style="padding: 14px; text-align: left">
        <div style="word-break: break-all;">{{ item.title }}</div>
        <div class="bottom" v-can:edit="'Platform'">
          <el-button type="text" class="button" @click.stop="onDelete(item)">删除</el-button>
          <el-button type="text" class="button" @click.stop="onEdit(item)">编辑</el-button>
          <el-button v-if="index > 0" type="text" class="button" @click.stop="onMove(index)">向前移动</el-button>
        </div>
      </div>
    </el-card>
    <div class="uploader-add-icon-wrapper" v-can:edit="'Platform'" @click.stop="onAdd">
      <i class="el-icon-plus uploader-add-icon"></i>
    </div>
    <el-dialog
      width="80%"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" :model="form" :rules="rules" label-width="120px" label-position="left">
        <el-form-item label="选择版式">
          <div style="overflow: hidden">
            <div v-for="(template, index) in Templates" :key="index" class="img-outer">
              <img :src="template.img_path" @click="chooseTemplate(template, index)" alt="" width="200px" height="200px">
              <i v-if="templateChosen === index" class="iconfont chosen">&#xe627;</i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="Banner图" prop="homepage_banner_item" v-if="form.banner_cnt > 0">
          <page-banner :pageBanner="false" :list="form.homepage_banner_item" :limit="form.banner_cnt" :homepage="form.id" :tmp_delete="form.tmp_delete" @change="handleBannerChange"></page-banner>
        </el-form-item>
        <el-form-item label="商品项（id）" prop="goods_list" v-if="form.goods_cnt > 0">
          <editable-tag-list v-model="form.goods_list" type="success" :limit="form.goods_cnt"/>
        </el-form-item>
        <el-form-item label="跳转页面" prop="jump_page">
          <el-select
            v-model="form.jump_page"
            clearable
            filterable
            placeholder="请选择">
            <el-option
              v-for="item in jumpPages"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
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
import ImgListUpload from '@/components/ImgListUpload'
import EditableTagList from '@/components/EditableTagList'
import Template from './template'
import TemplateCard from './TemplateCard'
import PageBanner from './PageBanner'
import { deepCopy } from '@/assets/util'
export default {
  name: 'PageTemplate',
  components: {
    ImgSingleUpload,
    ImgListUpload,
    EditableTagList,
    TemplateCard,
    PageBanner
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      bannerEditVisible: false,
      dialogIsAdd: true,
      path_type: false,
      bannerIsAdd: false,
      bannerForm: {
        path: '',
        picture: ''
      },
      dialogTargetId: -1,
      bannerTargetId: -1,
      form: deepCopy(Template.Templates[0]),
      rules: {
        // title: [
        //   { required: true, message: '请输入标题', trigger: 'blur' }
        // ],
        goods_list: [
          { type: 'array', required: true, message: '请输入商品项', trigger: 'blur' }
        ]
      },
      bannerRules: {
        path: [
          { required: true, message: '请输入跳转路径', trigger: 'blur' }
        ],
        picture: [
          { required: true, message: '请上传banner', trigger: 'change' }
        ]
      },
      Templates: Template.Templates,
      templateChosen: 0,
      tmp_good: '',
      jumpPages: []
    }
  },
  props: {
    list: {
      default: []
    },
    homepage: {
      default: 1
    }
  },
  computed: {
    maxRank () {
      return this.list.length
    }
  },
  watch: {
    list () {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].img_path = this.findImg(this.list[i])
      }
    }
  },
  methods: {
    findImg (item) {
      for (let i = 0; i < this.Templates.length; i++) {
        if (this.Templates[i].goods_type === item.goods_type && this.Templates[i].banner_type === item.banner_type) {
          return this.Templates[i].img_path
        }
      }
      return ''
    },
    findTemplate (item) {
      for (let i = 0; i < this.Templates.length; i++) {
        if (this.Templates[i].goods_type === item.goods_type && this.Templates[i].banner_type === item.banner_type) {
          return i
        }
      }
      return 0
    },
    onAdd () {
      this.form = deepCopy(this.Templates[0])
      this.form.rank = this.maxRank
      this.form.tmp_delete = []
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    onEdit (item) {
      console.log(item)
      this.form = deepCopy(item)
      this.dialogTargetId = item.id
      this.templateChosen = this.findTemplate(item)
      this.form.goods_cnt = this.Templates[this.templateChosen].goods_cnt
      this.form.banner_cnt = this.Templates[this.templateChosen].banner_cnt
      this.form.tmp_delete = []
      this.formGoodsList(this.form)
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    onSubmit () {
      const that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          if (that.dialogIsAdd) {
            that.form.homepage = that.homepage
            that.form.is_new = true
            that.list.push(that.form)
            that.$emit('change')
          } else {
            that.form.changed = true
            for (let i = 0; i < that.list.length; i++) {
              if (that.list[i].id === that.dialogTargetId) {
                that.list[i] = deepCopy(that.form)
                break
              }
            }
            that.$emit('change')
          }
          that.dialogVisible = false
        }
      })
    },
    onDelete (item) {
      const that = this
      this.$confirm('确认要删除这个模块吗？ID：' + item.id, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        item.deleted = true
        for (let i = 0; i < that.list.length; i++) {
          if (that.list[i].id === item.id) {
            item.deleted = true
            that.$set(that.list, i, item)
            break
          }
        }
        that.$emit('change')
      })
    },
    openDetail (item) {
      // this.$router.push('/goods/detail/' + item.goods.id)
    },
    chooseTemplate (template, index) {
      if (this.dialogIsAdd) {
        this.templateChosen = index
        this.form = deepCopy(template)
        this.form.rank = this.maxRank
      }
    },
    formGoodsList (item) {
      for (let i = 0; i < item.goods_list.length; i++) {
        if (item.goods_list[i] instanceof Object) {
          this.$set(item.goods_list, i, item.goods_list[i].id)
        }
      }
    },
    onMove (index) {
      if (index === 0) {
        return
      }
      this.list[index].rank = index - 1
      this.formGoodsList(this.list[index])
      this.list[index].changed = true
      this.list[index - 1].rank = index
      this.formGoodsList(this.list[index - 1])
      this.list[index - 1].changed = true
      let tmp = this.list[index]
      this.$set(this.list, index, this.list[index - 1])
      this.$set(this.list, index - 1, tmp)
      console.log(this.list)
    },
    getJumpPages () {
      let that = this
      this.$axios.get('/insider/homepage_jump_page/')
        .then(res => {
          console.log(res.data)
          that.jumpPages = res.data
          // that.$store.commit('SET_JUMPPAGES', res.data)
        })
    },
    handleBannerChange () {
      this.form.banner_changed = true
    }
    // confirmDelete () {
    //   if (this.tmp_delete === 0) {
    //     this.$emit('deleted')
    //     return
    //   }
    //   let change_cnt = 0
    //   let that = this
    //   for (let i = 0; i < this.tmp_delete.length; i++) {
    //     change_cnt += 1
    //     this.$axios.delete('/insider/homepage_banner_item/' + this.tmp_delete[i].id + '/')
    //       .then(() => {
    //         change_cnt -= 1
    //         if (change_cnt < 0) {
    //           that.$emit('deleted')
    //         }
    //       })
    //       .catch(err => {
    //         console.log(err)
    //       })
    //   }
    //   change_cnt -= 1
    // }
  },
  mounted () {
    this.getJumpPages()
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
  .chosen {
    font-size: 60px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -30px;
    margin-top: -30px;
  }
  .img-outer {
    position: relative;
    float: left;
    margin: 5px;
  }
</style>
