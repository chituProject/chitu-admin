<template>
  <div class="content-table" v-loading="loading">
    <el-card
      :body-style="{ padding: '0px' }"
      v-for="(item, index) in displayedList"
      :key="index"
      shadow="never">
      <img-single-upload
        :editable="false"
        :customSize="true"
        class="image"
        v-model="item.category_info.logo">
      </img-single-upload>
      <div style="padding: 14px; text-align: left">
        <div style="word-break: break-all;">{{ item.category_info.name }}</div>
        <div class="bottom" v-can:edit="'Platform'" >
          <el-button type="text" class="button" @click.stop="onDelete(item)">删除</el-button>
          <el-button type="text" class="button" @click.stop="onEdit(item, index)">编辑</el-button>
        </div>
      </div>
    </el-card>
    <div class="uploader-add-icon-wrapper" v-can:edit="'Platform'" @click.stop="onAdd">
      <i class="el-icon-plus uploader-add-icon"></i>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      center>
      <el-form ref="Form" :model="form" :rules="rules" label-width="120px" label-position="left">
        <el-form-item label="品类级别" prop="level">
          <el-radio-group v-model="form.level">
            <el-radio :label="'1'">一级品类</el-radio>
            <el-radio :label="'2'">二级品类</el-radio>
            <el-radio :label="'3'">三级品类</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品类ID" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="是否默认" prop="default_type">
          <el-switch
            v-model="form.default_type">
          </el-switch>
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

export default {
  name: 'PageGoods',
  components: {
    ImgSingleUpload
  },
  data () {
    return {
      loading: false,
      list: [],
      dialogVisible: false,
      dialogIsAdd: true,
      dialogTargetIndex: -1,
      form: {
        id: '',
        level: '1',
        default_type: true
      },
      rules: {
        id: [
          { required: true, message: '请输入品类编号', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    homepage: {
      type: Number
    }
  },
  computed: {
    displayedList () {
      return this.list.filter(item => !item.deleted && item.category_info)
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.$axios.get('/insider/homepage_category_item/')
        .then(res => {
          this.list = res.data.filter(item => item.homepage === this.homepage)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onAdd () {
      this.form.id = ''
      this.form.level = '1'
      this.form.default_type = true
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    onEdit (item, index) {
      this.dialogTargetIndex = index
      this.form.id = item.category.id
      this.form.level = item.category.level
      this.form.default_type = item.default_type === 'default'
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    onSubmit () {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let index = this.dialogTargetIndex
          let id = this.form.id
          let level = this.form.level
          let defaultType = this.form.default_type ? 'default' : 'notdefault'
          let url = '/insider/category_'
          switch (level) {
            case '1':
              url += 'first/'
              break
            case '2':
              url += 'second/'
              break
            case '3':
              url += 'third/'
              break
          }
          // 获取品类图和名称
          const item = {
            category: {
              id: id,
              level: level
            },
            default_type: defaultType,
            homepage: this.homepage
          }
          this.$axios.get(url + id + '/')
            .then(res => {
              if (this.dialogIsAdd) {
                this.list.push({
                  ...item,
                  category_info: {
                    logo: res.data.logo,
                    name: res.data.name
                  },
                  isNew: true
                })
              } else {
                this.list.splice(index, 1, {
                  ...item,
                  category_info: {
                    logo: res.data.logo,
                    name: res.data.name
                  },
                  edited: true
                })
              }
            })
            .catch(() => {
              if (this.dialogIsAdd) {
                this.list.push({
                  ...item,
                  category_info: {
                    name: level + '-' + id
                  },
                  isNew: true
                })
              } else {
                this.list.splice(index, 1, {
                  ...item,
                  category_info: {
                    name: level + '-' + id
                  },
                  edited: true
                })
              }
            })
            .finally(() => {
              this.dialogVisible = false
            })
        }
      })
    },
    onDelete (item) {
      this.$confirm('确认要删除这个品类吗？品类名：' + item.category_info.name, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$set(item, 'deleted', true)
      })
        .catch(err => {
          console.log(err)
        })
    },
    save () {
      this.loading = true
      const deleteReq = (item) => this.$axios.delete(`/insider/homepage_category_item/${item.id}/`)
      const postReq = (item) => this.$axios.post('/insider/homepage_category_item/', item)
      const patchReq = (item) => this.$axios.patch('/insider/homepage_category_item/' + item.id + '/', item)
      axios.all([
        ...this.list.filter(item => item.deleted).map(item => deleteReq(item)),
        ...this.list.filter(item => item.isNew && !item.deleted).map(item => postReq(item)),
        ...this.list.filter(item => item.edited && !item.isNew && !item.deleted).map(item => patchReq(item))
      ])
        .catch(() => {
          this.$message.error('保存品类失败！')
        })
        .finally(() => {
          this.$emit('finish-save')
          this.getData()
          this.loading = false
        })
    }
  },
  mounted () {
    this.$watch('homepage', this.getData)
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
