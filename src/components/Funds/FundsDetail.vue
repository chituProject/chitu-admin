<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button v-if="!edit" type="primary" @click="editFunds">编辑</el-button>
        <el-button v-if="edit" size="medium" @click="editFundsCancel">取消</el-button>
        <el-button v-if="edit && activeName === 'achivement'" @click="dialogVisible = true">新增净值</el-button>
        <el-button v-if="edit" type="primary" v-can:edit="'Goods'" size="medium" @click="editFundsConfirm">保存</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-row>  
          <el-col :span="24">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <!-- 基金档案管理 -->
              <el-tab-pane label="基金档案管理" name="archive">
                <div>
                  <el-form ref="spuForm" :model="model_new" :rules="rules" class="demo-table-expand" label-width="100px" label-position="left">
                    <div class="title">基本信息</div>
                    <div class="spu-table">
                      <el-form-item label="基金编号">
                        <span>{{$route.params.id}}</span>
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
                      <el-form-item v-show="edit" label="基金策略" prop="strategy">
                        <el-select v-model="model_new.strategy">
                          <el-option
                            v-for="item in fund_strategy"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item v-show="!edit" label="基金策略">
                        <span>{{ fund_strategy_name[model.strategy] }}</span>
                      </el-form-item>
                      <el-form-item v-show="edit && model.type === 'MANAGER'" label="备忘录" prop="memo">
                        <el-input type="textarea" v-model="model_new.memo" :rows="5" placeholder= "请输入备忘录"></el-input>
                      </el-form-item>
                      <el-form-item v-show="!edit && model.type === 'MANAGER'" label="备忘录">
                        <span>{{model.memo}}</span>
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
              <el-tab-pane label="基金业绩信息" name="achivement" v-if="model.fund">
                <div ref="fundAchievementChart" class="achievement-chart"></div>
                <el-form ref="fundAchievementForm" v-if="edit" label-width="160px">
                  <el-form-item
                    v-for="(ff, index) in model_new.fund"
                    :label="`${ff.time}净值`"
                    :key="ff.id"
                    :prop="'funds.' + index + '.net_worth'"
                    :rules="[
                      { type: 'number', message: '净值必须为数字', trigger: ['blur','change'] }
                    ]"
                  >
                    <el-input v-model="ff.net_worth" size="medium" clearable></el-input>
                  </el-form-item>
                </el-form>
                <el-table ref="fundAchievementTable" :data="model.fund" height="600" stripe v-if="!edit">
                  <el-table-column label="月份" width="90">
                    <template slot-scope="scope">
                      {{formatTimeMonth(scope.row.time)}}
                    </template>
                  </el-table-column>
                  <el-table-column label="净值" prop="net_worth">
                  </el-table-column>
                  <el-table-column label="月收益率" prop="monthly_yield">
                  </el-table-column>
                  <el-table-column label="回撤" prop="fallback">
                  </el-table-column>
                  <el-table-column label="滚动一年" prop="roll_year">
                  </el-table-column>
                  <el-table-column label="夏普比例" prop="sharpe_ratio">
                  </el-table-column>
                  <el-table-column label="成立以来收益" prop="profit" width="100">
                  </el-table-column>
                  <el-table-column label="最近一年收益" prop="one_year_profit" width="100">
                  </el-table-column>
                  <el-table-column label="最近一年年化" prop="one_year_annualized" width="100">
                  </el-table-column>
                  <el-table-column label="最近两年收益" prop="two_year_profit" width="100">
                  </el-table-column>
                  <el-table-column label="最近两年年化" prop="two_year_annualized" width="100">
                  </el-table-column>
                  <el-table-column label="最近三年收益" prop="three_year_profit" width="100">
                  </el-table-column>
                  <el-table-column label="最近三年年化" prop="three_year_annualized" width="100">
                  </el-table-column>
                  <el-table-column label="最近五年收益" prop="five_year_profit" width="100">
                  </el-table-column>
                  <el-table-column label="最近五年年化" prop="five_year_annualized" width="100">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>  
        </el-row>
      </div>
    </div>
    <el-dialog
      title="创建确认"
      :visible.sync="dialogVisible"
      width="300"
    >
      <div class="flex-justify_center">
        <span>请选择创建时间</span>
        <el-date-picker
          v-model="new_time"
          type="month"
          placeholder="选择月份"
          format="yyyy 年 MM 月"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </div>
      <div class="flex-justify_center">
        <span>请输入净值</span>
        <el-input v-model="new_net_worth" size="small" clearable></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNetworthConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ECharts from 'echarts'
import 'echarts/lib/chart/line'
import chartOptions from './chartOptions'
import { deepCopy, formatTimeMonth } from '@/assets/util'
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
      activeName: 'archive',
      dialogVisible: false,
      new_time: '',
      new_net_worth: '',
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
        designed_exposure: [],
        fund: [
          {
            net_worth: '1'
          }
        ]
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
      fund_strategy: [
        {
          label: '量化',
          value: 'quantification'
        },
        {
          label: '固收',
          value: 'fixed__income'
        },
        {
          label: '宏观对冲',
          value: 'macro__hedging'
        },
        {
          label: '纯多头',
          value: 'pure__bull'
        },
        {
          label: '多空',
          value: 'long__short'
        },
        {
          label: '复合',
          value: 'combination'
        },
        {
          label: '其他',
          value: 'other'
        }
      ],
      fund_strategy_name: {
        quantification: '量化',
        fixed__income: '固收',
        macro__hedging: '宏观对冲',
        pure__bull: '纯多头',
        long__short: '多空',
        combination: '复合',
        other: '其他'
      },
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
        designed_exposure: [],
        fund: []
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
      fundAchievementChart: null
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    formatTimeMonth,
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
      this.$axios.get(`/insider/fund_archive/${this.$route.params.id}/`)
        .then(res => {
          this.model = res.data
          this.loading = false
          if (res.data.fund) {
            this.fundAchievementChart.setOption({
              title: {
                text: '净值'
              },
              xAxis: {
                data: res.data.fund.map((item) => {
                  return item.time
                })
              },
              series: {
                data: res.data.fund.map((item) => {
                  return parseFloat(item.net_worth)
                })
              }
            })
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
      this.$axios.patch(`/insider/fund_archive/${this.$route.params.id}/`, parm)
        .then(() => {
          // 并行
          // const promiseAll = parm.fund.map((data) => {
          //   return this.$axios.patch(`/insider/fund_achievement/${data.id}/`, data)
          // })
          // Promise.all(promiseAll).then(() => {
          //   this.$message.success('保存成功')
          //   this.getData()
          // })
          // 串行
          this.patchAchievement(parm,0)
        }).catch(() => {
          this.$message.error('保存失败')
          this.loading = false
        })
    },
    patchAchievement(parm, index) {
      if (index > parm.fund.length - 1) {
        this.$message.success('保存成功')
        this.getData()
        return
      } else {
        this.$axios.patch(`/insider/fund_achievement/${parm.fund[index].id}/`, parm.fund[index]).then(()=>{
          this.patchAchievement(parm, index + 1)
        })
      }
    },
    editFundsCancel () {
      this.edit = false
    },
    addNetworthConfirm() {
      const params = {
        net_worth: this.new_net_worth,
        time: this.new_time,
        fund: this.$route.params.id
      }
      this.$axios.post('/insider/fund_achievement/', params).then(res => {
        if (res.data)
          this.model_new.fund.push(res.data)
        else
          this.$message.error(res.msg)
        this.dialogVisible = false
      })
    }
  },
  created () {
    if (this.$route.query.edit) {
      this.edit = true
    }
    this.getData()
  },
  mounted () {
    this.fundAchievementChart = ECharts.init(this.$refs.fundAchievementChart)
    this.fundAchievementChart.setOption(chartOptions.option)
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
.achievement-chart{
  width: 800px;
  height: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>
