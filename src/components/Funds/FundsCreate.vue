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
            <el-form-item label="基金类别" prop="fund_type">
              <el-select v-model="model.type">
                <el-option
                  v-for="item in fund_type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="基金名称" prop="fund_name">
              <el-input v-model="model.name" clearable placeholder= "请输入基金名"></el-input>
            </el-form-item>
            <el-form-item v-if="model.type === 'MANAGER'" label="基金经理" prop="fund_manager">
              <el-input v-model="model.manager" clearable placeholder= "请输入基金经理"></el-input>
            </el-form-item>
            <el-form-item label="业绩信息" prop="achievement">
            </el-form-item>
            <template v-if="model.type === 'MANAGER'">
              <detail-paras :edit="true" :title="'概述'" :value="model.general_infomation" @change="updateGeneralInformation"></detail-paras>
              <detail-paras :edit="true" :title="'运营'" :value="model.operation" @change="updateOperation"></detail-paras>
              <detail-paras :edit="true" :title="'条款和条件'" :value="model.article" @change="updateArticle"></detail-paras>
              <detail-paras :edit="true" :title="'组合特征'" :value="model.combination" @change="updateCombination"></detail-paras>
              <detail-paras :edit="true" :title="'多投'" :value="model.long_positions" @change="updateLongPositions"></detail-paras>
              <detail-paras :edit="true" :title="'空投'" :value="model.short_positions" @change="updateShortPositions"></detail-paras>
              <detail-paras :edit="true" :title="'整体仓位'" :value="model.designed_exposure" @change="updateDesignedExposure"></detail-paras>
            </template>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CategorySelector from '@/components/CategorySelector'
import EditableTagList from '@/components/EditableTagList'
import DetailParas from './Detail/DetailParas'

export default {
  name: 'FundsCreate',
  components: {
    CategorySelector,
    EditableTagList,
    DetailParas
  },
  data () {
    return {
      loading: false,
      fund_type: [
        {
          id: 'MANAGER',
          name: '经理基金'
        },
        {
          id: 'INDEX',
          name: '指数基金'
        }
      ],
      model: {
        type: '',
        name: '',
        manager: '',
        general_infomation: [
          {key: '基金管理方', value: ''},
          {key: '管理方牌照', value: ''},
          {key: '基金管理规模', value: ''},
          {key: '投资范围', value: ''},
          {key: '是否已投资', value: ''},
          {key: '基金状况', value: ''},
          {key: '预期封闭时间', value: ''}
        ],
        operation: [
          {key: '行政管理方', value: ''},
          {key: '审计师', value: ''},
          {key: '托管方', value: ''},
          {key: '法律顾问', value: ''}
        ],
        article: [
          {key: '锁定期', value: ''},
          {key: '流动性', value: ''},
          {key: '基金管理费', value: ''},
          {key: '业绩提成', value: ''},
          {key: '普通合伙人承诺出资额', value: ''},
          {key: '基金信息透明度', value: ''}
        ],
        combination: [
          {key: '历史最大多头仓位', value: ''},
          {key: '历史最大空头仓位', value: ''},
          {key: '持股数量（多头+空头）', value: ''}
        ],
        long_positions: [
          {key: '持股数量', value: ''},
          {key: '平均个股仓位', value: ''},
          {key: '最大个股仓位', value: ''}
        ],
        short_positions: [
          {key: '持股数量', value: ''},
          {key: '平均个股仓位', value: ''},
          {key: '最大个股仓位', value: ''}
        ],
        designed_exposure: [
          {key: '目标毛暴露范围', value: ''},
          {key: '目标净暴露范围', value: ''}
        ]
      },
      rules: {
        type: [
          { required: true, message: '请选择基金类别', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '基金名称限10字以内', trigger: 'blur', max: 10 }
        ],
        manager: [
          { message: '基金经理名限10字以内', trigger: 'blur', max: 10 }
        ]
      }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    updateGeneralInformation (value) {
      this.$set(this.model, 'general_infomation', value)
    },
    updateOperation (value) {
      this.$set(this.model, 'operation', value)
    },
    updateArticle (value) {
      this.$set(this.model, 'article', value)
    },
    updateCombination (value) {
      this.$set(this.model, 'combination', value)
    },
    updateLongPositions (value) {
      this.$set(this.model, 'long_positions', value)
    },
    updateShortPositions (value) {
      this.$set(this.model, 'short_positions', value)
    },
    updateDesignedExposure (value) {
      this.$set(this.model, 'designed_exposure', value)
    },
    createGoodsConfirm () {
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$axios.post('/insider/fund_archive/', this.model)
            .then(res => {
              this.$message.success('创建成功')
              this.loading = false
              setTimeout(() => {
                this.$router.push('/goods/detail/' + res.data.id)
              }, 800)
            })
            .catch(error => {
              console.log(error)
              this.$message.error('保存失败')
              this.loading = false
            })
        } else {
          this.$message.error('请填写所有项目')
        }
      })
    }
  },
  created () {
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
  .clickable {
    margin-left: 10px;
  }
  .clickable:hover {
    cursor: pointer;
  }
</style>
