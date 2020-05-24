<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="createGoodsConfirm">确认创建</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-form ref="spuForm" :model="model" :rules="rules" class="demo-table-expand" label-width="160px" label-position="left">
          <div>
            <el-form-item label="基金类别" prop="goods_type">
              <el-select v-model="model.goods_type">
                <el-option
                  v-for="item in type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="基金名称" prop="goods_name">
              <el-input v-model="model.goods_name" clearable placeholder= "请输入基金名"></el-input>
            </el-form-item>
            <el-form-item label="业绩信息" prop="achievement">
            </el-form-item>
            <div v-if="model.goods_type !== 'INDEX_FUND'">
              <el-form-item label="产品项目档案" prop="archives">
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import UUID from 'uuid-js'
import CategorySelector from '@/components/CategorySelector'
import EditableTagList from '@/components/EditableTagList'

export default {
  name: 'GoodsCreate',
  components: {
    CategorySelector,
    EditableTagList
  },
  data () {
    return {
      loading: false,
      type: [
        {
          id: 'MANAG_FUND',
          name: '经理基金'
        },
        {
          id: 'INDEX_FUND',
          name: '指数基金'
        }
      ],
      model: {
        goods_type: '',
        uuid: '',
        goods_name: ''
      },
      rules: {
        goods_type: [
          { required: true, message: '请选择基金类别', trigger: 'blur' }
        ],
        goods_name: [
          { required: true, message: '基金名称限10字以内', trigger: 'blur', max: 10 }
        ]
      }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    createGoodsConfirm () {
      let that = this
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          that.loading = true
          that.$axios.post('/insider/goods/', that.model)
            .then(res => {
              console.log(res.data)
            })
            .catch(error => {
              console.log(error)
              that.$message.error('保存失败')
            })
            .finally(() => {
              that.loading = false
            })
        } else {
          that.$message.error('请填写所有项目')
        }
      })
    }
  },
  created () {
    this.model.uuid = UUID.create(1).hex
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .demo-table-expand .el-form-item {
    width: 350px;
    margin: 0 20px 20px;
    font-size: 0;
    text-align: left;
  }
  .spu-table {
    width: 100%;
    display: grid;
    grid-template-columns: repeat( 2, 1fr );
    grid-column-gap: 10px;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    padding-bottom: 20px;
  }
  .card-container {
    position: relative;
  }
  .divider {
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
    background-color: #efeded;
  }
  .title {
    font-size: 20px !important;
    /*font-weight: bold;*/
    text-align: left;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .divider + .title {
    margin-top: 40px;
  }
  .demo-table-expand label {
    /*width: 90px;*/
    color: #99a9bf;
  }
  /*.el-form-item .el-form-item__content {*/
    /*width: 200px !important;*/
  /*}*/
  .main-pic {
    text-align: left;
    display: block;
    margin: 20px;
  }
  .pic-label {
    /*font-weight: bold;*/
  }
  .pic-info {
    color: #9b9b9b;
  }
  .pic-img {
    height: 140px;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }
  .pic-img div {
    display:inline-block;
    box-sizing: border-box;
    height: 100px;
    margin: 20px;
    text-align: center;
  }
  .pic-img img {
    height: 100px;
    border: 1px solid rgb(239,237,237);
  }
  .button-close {
    font-size: 20px;
    margin: -10px -10px;
    position: absolute;
  }
  .button-close:hover {
    cursor: pointer;
    -webkit-transform: scale(0.9,0.9);
    -moz-transform: scale(0.9,0.9);
    -o-transform: scale(0.9,0.9);
    transform: scale(0.9,0.9);
  }
  .tags {
    margin-right: 10px;
    width: 30%;
    position: relative;
  }
  .tags .el-input{
    width: 80px !important;
    /*margin-right: 8px;*/
  }
  .clickable {
    margin-left: 10px;
  }
  .clickable:hover {
    cursor: pointer;
  }
  .add-param {
    margin-left: 30px;
  }
</style>
