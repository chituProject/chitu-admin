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
        v-model="item.main_picture">
      </img-single-upload>
      <div style="padding: 14px; text-align: left">
        <div style="word-break: break-all;">{{ item.id }}</div>
        <div class="bottom" v-can:edit="'Platform'">
          <el-button type="text" class="button" @click.stop="onDelete(item)">删除</el-button>
          <el-button type="text" class="button" @click.stop="onEdit(item, index)">编辑</el-button>
          <el-button type="text" class="button" @click.stop="openGoods(item)">详情</el-button>
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
        <el-form-item label="商品 SPU 编号" prop="id">
          <el-input v-model="form.id"></el-input>
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

export default {
  name: 'PageGoods',
  components: {
    ImgSingleUpload
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      dialogIsAdd: true,
      dialogTargetIndex: -1,
      form: {
        id: ''
      },
      rules: {
        id: [
          { required: true, message: '请输入商品 SPU 编号', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    list: {
      default: []
    }
  },
  methods: {
    onAdd () {
      this.form.id = ''
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    onEdit (item, index) {
      this.dialogTargetIndex = index
      this.form.id = item.id
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    onSubmit () {
      const that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let index = that.dialogTargetIndex
          let id = that.form.id
          that.$axios.get('/insider/goods/' + id + '/')
            .then(res => {
              if (that.dialogIsAdd) {
                that.list.push({
                  id: id,
                  main_picture: res.data.main_picture
                })
              } else {
                that.list[index].id = id
                that.list[index].main_picture = res.data.main_picture
              }
              that.$emit('change')
            })
            .catch(err => {
              console.log(err)
              if (that.dialogIsAdd) {
                that.list.push({
                  id: id
                })
              } else {
                that.list[index].id = id
                that.list[index].main_picture = ''
              }
            })
            .finally(() => {
              that.dialogVisible = false
            })
        }
      })
    },
    onDelete (item) {
      const that = this
      this.$confirm('确认要删除这个SPU吗？SPU：' + item.id, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        for (let i = 0; i < that.list.length; i++) {
          if (that.list[i].id === item.id) {
            that.list.splice(i, 1)
            break
          }
        }
        that.$emit('change')
      })
        .catch(err => {
          console.log(err)
        })
    },
    openGoods (item) {
      this.$router.push('/goods/detail/' + item.id)
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
