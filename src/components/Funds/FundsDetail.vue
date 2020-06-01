<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button v-if="!edit" type="primary" v-can:edit="'Goods'" @click="editFunds">编辑</el-button>
        <el-button v-if="edit" size="medium" @click="editFundsCancel">取消</el-button>
        <el-button v-if="edit" type="primary" v-can:edit="'Goods'" size="medium" @click="editFundsConfirm">保存</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <!-- 基金档案管理 -->
          <el-tab-pane label="基金档案管理" name="archive">
            <div>
              <el-form ref="spuForm" :model="model_new" :rules="rules" class="demo-table-expand" label-width="100px" label-position="left">
                <div class="title">基本信息</div>
                <div class="spu-table">
                  <el-form-item label="基金编号">
                    <span>{{model.id}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="基金名称" prop="fund_name">
                    <el-input v-model="model_new.name" clearable></el-input>
                  </el-form-item>
                  <el-form-item v-show="!edit" label="基金名称">
                    <span>{{model.name}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit && model.type === 'MANAGER'" label="基金经理" prop="fund_manager">
                    <el-input v-model="model_new.manager" clearable placeholder= "请输入基金经理"></el-input>
                  </el-form-item>
                  <el-form-item v-show="!edit && model.type === 'MANAGER'" label="基金经理">
                    <span>{{model.manager}}</span>
                  </el-form-item>
                  <el-form-item v-show="edit" label="基金类别" prop="fund_type">
                    <el-select v-model="model_new.type">
                      <el-option
                        v-for="item in fund_type"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-show="!edit" label="基金类别">
                    <span>{{model.type === 'MANAGER' ? '经理基金' : '指数基金'}}</span>
                  </el-form-item>
                </div>
                <div class="divider"></div>
                <!-- 概述 -->
                <detail-paras :edit="edit" :title="'概述'" :value="model.general_infomation" @change="updateGeneralInformation"></detail-paras>
                <!-- 运营 -->
                <detail-paras :edit="edit" :title="'运营'" :value="model.operation" @change="updateOperation"></detail-paras>
                <!-- 条款和条件 -->
                <detail-paras :edit="edit" :title="'条款和条件'" :value="model.article" @change="updateArticle"></detail-paras>
                <!-- 组合特征 -->
                <detail-paras :edit="edit" :title="'组合特征'" :value="model.combination" @change="updateCombination"></detail-paras>
                <!-- 多头 -->
                <detail-paras :edit="edit" :title="'多头'" :value="model.long_positions" @change="updateLongPositions"></detail-paras>
                <!-- 空头 -->
                <detail-paras :edit="edit" :title="'空头'" :value="model.short_positions" @change="updateShortPositions"></detail-paras>
                <!-- 总体仓位 -->
                <detail-paras :edit="edit" :title="'总体仓位'" :value="model.designed_exposure" @change="updateDesignedExposure"></detail-paras>
              </el-form>
            </div>
          </el-tab-pane>

          <!-- 基金业绩信息 -->
          <el-tab-pane label="基金业绩信息" name="achivement">
            <el-table ref="fundAchievementForm" :data="fundAchievement" stripe>
              <el-table-column label="表格字段" prop="col">
              </el-table-column>
              <el-table-column label="样例数据" prop="example">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/assets/util'
import DetailParas from './Detail/DetailParas'

export default {
  name: 'FundsDetail',
  components: {
    DetailParas
  },
  data () {
    return {
      loading: false,
      edit: false,
      loadedRes: 0,
      activeName: 'archive',
      model: {
        name: '',
        type: '',
        manager: '',
        general_infomation: [],
        operation: [],
        article: [],
        combination: [],
        long_positions: [],
        short_positions: [],
        designed_exposure: []
      },
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
      model_new: {
        name: '',
        type: '',
        manager: '',
        general_infomation: [],
        operation: [],
        article: [],
        combination: [],
        long_positions: [],
        short_positions: [],
        designed_exposure: []
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
      },
      fundAchievement: []
    }
  },
  props: {
    id: {
      type: String
    }
  },
  computed: {
  },
  methods: {
    updateGeneralInformation (value) {
      this.$set(this.model_new, 'general_infomation', value)
    },
    updateOperation (value) {
      this.$set(this.model_new, 'operation', value)
    },
    updateArticle (value) {
      this.$set(this.model_new, 'article', value)
    },
    updateCombination (value) {
      this.$set(this.model_new, 'combination', value)
    },
    updateLongPositions (value) {
      this.$set(this.model_new, 'long_positions', value)
    },
    updateShortPositions (value) {
      this.$set(this.model_new, 'short_positions', value)
    },
    updateDesignedExposure (value) {
      this.$set(this.model_new, 'designed_exposure', value)
    },
    getData () {
      this.loading = true
      this.loadedRes = 0
      this.$axios.get(`/insider/fund_archive/${this.id}/`)
        .then(res => {
          this.model = res.data
          this.loadedRes += 1
          if (this.loadedRes > 1) {
            this.loading = false
          }
        })
      this.$axios.get(`/insider/fund_achievement/${this.id}/`)
        .then(res => {
          this.fundAchievement = res.data
          this.loadedRes += 1
          if (this.loadedRes > 1) {
            this.loading = false
          }
        })
    },
    goBack () {
      if (this.edit) {
        this.editFundsCancel()
      } else {
        this.$router.go(-1)
      }
    },
    handleClick () {
      this.edit = false
    },
    editFunds () {
      this.model_new = deepCopy(this.model)
      this.edit = true
    },
    editFundsConfirm () {
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          this.handleEditConfirm(this.model_new)
          this.edit = false
        }
      })
    },
    handleEditConfirm (parm) {
      this.loading = true
      this.$axios.patch(`/insider/fund_archive/${parm.id}/`, parm)
        .then(res => {
          console.log(res.data)
          this.$message.success('保存成功')
          this.getData()
        })
        .catch(error => {
          console.log(error)
          this.$message.error('保存失败')
          this.loading = false
        })
    },
    editFundsCancel () {
      this.edit = false
    }
  },
  created () {
    if (this.$route.query.edit) {
      this.edit = true
    }
    this.getData()
  }
}
</script>

<style scoped>
.filter-container {
  padding: 12px;
}
.demo-table-expand {
  margin: 0px 20px 20px;
  font-size: 0;
  text-align: left;
}
.spu-table {
  width: 100%;
  display: grid;
  grid-template-columns: repeat( 2, 1fr );
  grid-column-gap: 10px;
}
.sku-table {
  width: 100%;
  display: grid;
  grid-template-columns: repeat( 2, 1fr );
  grid-column-gap: 20px;
}
.demo-table-expand label {
  /*width: 90px;*/
  color: #99a9bf;
}
/*.el-form-item .el-input {*/
  /*width: 300px !important;*/
/*}*/
.el-form-item .el-form-item__content {
  width: 100% !important;
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
  margin-top: 60px;
}
</style>
