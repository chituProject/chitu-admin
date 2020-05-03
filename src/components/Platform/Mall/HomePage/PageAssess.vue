<template>
  <div class="content-table" v-loading="loading">
    <el-card
      :body-style="{ padding: '0px' }"
      v-for="(item, index) in list"
      v-if="!item.deleted"
      :key="index"
      shadow="never">
      <img-single-upload
        :editable="false"
        :customSize="true"
        class="image"
        v-model="item.main_picture">
      </img-single-upload>
      <div style="padding: 14px; text-align: left">
        <div style="word-break: break-all;">{{ item.reviews }}</div>
        <div style="word-break: break-all;margin-top: 14px"><img :src="item.wechat_avatar_url" style="width: 30px;padding-right: 10px;"/><span style="font-size: 14px;margin-left: 10px;">{{ item.wechat_nickname }}</span></div>
        <div class="bottom" v-if="editable" v-can:edit="'Platform'">
          <el-button v-if="list.length > 0" type="text" class="button" @click.stop="onDelete(item)">删除</el-button>
          <el-button type="text" class="button" @click.stop="onEdit(item, index)">编辑</el-button>
        </div>
      </div>
    </el-card>
    <div class="uploader-add-icon-wrapper" v-can:edit="'Platform'" @click.stop="onAdd" v-if="list.length < limit">
      <i class="el-icon-plus uploader-add-icon"></i>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      center>
      <el-form ref="Form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="13">
            <el-form-item label="商品 SPU 编号" prop="spu_id">
              <el-input v-model.number="form.spu_id" @input="form.sku_id = null"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="选择用户" prop="user_id">
              <el-select v-model="form.user_id" filterable v-el-select-loadmore="loadmore">
                <el-option v-for="item of userList" :key="item.id" :label="item.wechat_nickname" :value="item.id">
                  <div @click="change(item)">
                    <img style="float: left;width: 28px" :src="item.wechat_avatar_url" />
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.wechat_nickname }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评价" prop="comment">
              <el-input type="textarea" v-model="form.comment" placeholder="请输入内容" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <spu :spu="form.spu_id" v-if="form.spu_id" @spu="onChange"></spu>
      <div slot="footer" style="text-align: right">
        <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click.stop="onSubmit" :disabled="disabledButton">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImgSingleUpload from '@/components/ImgSingleUpload'
import SPUDetail from '@/components/Platform/Rush/spu'

export default {
  name: 'PageRecommend',
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  components: {
    ImgSingleUpload,
    spu: SPUDetail
  },
  mounted () {
    this.query(this.formData)
  },
  data () {
    return {
      loading: false,
      disabledButton: false,
      dialogVisible: false,
      dialogIsAdd: true,
      dialogTargetIndex: -1,
      form: {
        spu_id: '',
        user_id: '',
        comment: ''
      },
      userList: [],
      formData: {
        currentPage: 1,
        pageSize: 20
      },
      spu: {},
      user: {},
      rules: {
        spu_id: [
          {required: true, message: '请填写SPU编号', trigger: 'blur'}
        ],
        user_id: [
          {required: true, message: '请选择用户', trigger: 'blur'}
        ],
        comment: [
          {required: true, message: '请填写评价', trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    list: {
      default: []
    },
    limit: {
      default: 100
    },
    editable: {
      default: true
    },
    homepage: {
      default: null
    }
  },
  methods: {
    onChange (item) {
      if (!item) return
      if (item.shelf_status !== 'ON') {
        this.disabledButton = true
        this.$message.error('该商品状态未上架！')
        return
      }
      this.disabledButton = false
      this.spu = item
    },
    change (item) {
      this.user = item
    },
    loadmore () {
      this.formData.currentPage++
      this.query(this.formData)
    },
    query () {
      this.$axios.get('/insider/customer_user/?page_num=' + this.formData.currentPage +
        '&page_size=' + this.formData.pageSize)
        .then(res => {
          this.userList = [...this.userList, ...res.data.results]
        })
    },
    onAdd () {
      this.form.spu_id = ''
      this.form.user_id = ''
      this.form.comment = ''
      if (this.$refs.Form) {
        this.$refs.Form.clearValidate()
      }
      this.dialogIsAdd = true
      this.dialogVisible = true
    },
    onEdit (item, index) {
      this.dialogTargetIndex = index
      this.form.spu_id = item.goods
      this.form.user_id = item.user
      this.form.comment = item.reviews
      this.dialogIsAdd = false
      this.dialogVisible = true
    },
    onSubmit () {
      console.log(this.user)
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let index = this.dialogTargetIndex
          const item = {
            reviews: this.form.comment,
            user: this.form.user_id,
            goods: this.form.spu_id,
            homepage: this.homepage,
            wechat_avatar_url: this.user.wechat_avatar_url,
            wechat_nickname: this.user.wechat_nickname,
            main_picture: this.spu.main_picture
          }
          if (this.dialogIsAdd) {
            this.list.push({ ...item, isNew: true })
          } else {
            this.list.splice(index, 1, {
              id: this.list[index].id,
              ...item,
              edited: true
            })
          }
          this.dialogVisible = false
        }
      })
    },
    async save () {
      const reqs = this.list
        .map(comment => {
          if (comment.isNew && !comment.deleted) {
            return this.$axios.post('/insider/homepage_recommend/', comment)
          } else if (!comment.isNew && comment.deleted) {
            return this.$axios.delete('/insider/homepage_recommend/' + comment.id + '/')
          } else if (comment.edited) {
            return this.$axios.patch('/insider/homepage_recommend/' + comment.id + '/', comment)
          }
        })
      Promise
        .all(reqs)
        .catch(err => {
          console.error(err)
        })
        .finally(() => {
          this.$emit('finish-save')
        })
    },
    onDelete (item) {
      this.$confirm('确认要删除这个评价吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$set(item, 'deleted', true)
      })
        .catch(err => {
          console.log(err)
        })
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
