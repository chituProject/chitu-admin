<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button v-if="!edit" size="medium" type="primary" @click="editFund">编辑</el-button>
        <el-button v-if="!edit && isHighWater" size="medium" type="primary" @click="HighWater">取消高水位</el-button>
        <el-button v-if="!edit && !isHighWater" size="medium" type="primary" @click="HighWater">一键高水位</el-button>
        <el-button v-if="!edit && model.fund.length === 0" size="medium" type="primary" @click="addArchive(fundAchievement)">上传业绩</el-button>
        <el-button v-if="!edit && model.fund.length > 0" size="medium" @click="deleteArchive">删除业绩</el-button>
        <el-button v-if="!edit" size="medium" @click="deleteFund">删除基金</el-button>
        <el-button v-if="edit" size="medium" @click="editFundCancel">取消</el-button>
        <el-button v-if="edit && activeName === 'achievement'" @click="dialogVisible = true">新增净值</el-button>
        <el-button v-if="edit" type="primary" v-can:edit="'Goods'" size="medium" @click="editFundConfirm">保存</el-button>
      </div>
    </div>
    <div class="card-outer" v-if="model">
      <div class="card-container">
        <el-row>  
          <el-col :span="24">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <!-- 基金业绩信息 -->
              <el-tab-pane label="基金业绩信息" name="achievement">
              <template v-if="model.fund && model.fund.length > 0">
                <el-form class="demo-table-expand" label-width="100px" label-position="left">
                  <div class="title">基本信息</div>
                  <div class="fund_archive-table">
                    <el-form-item label="最大回撤">
                      {{`${(model.max_fallback * 100 ).toFixed(2)}%`}}
                    </el-form-item>
                    <el-form-item label="最大回撤月份">
                      {{formatTimeMonth(model.max_fallback_created_at)}}
                    </el-form-item>
                    <el-form-item label="滚动一年收益">
                      {{`${(model.roll_year_win * 100 ).toFixed(2)}%`}}
                    </el-form-item>
                    <el-form-item label="夏普比率">
                      {{model.sharpe_ratio}}
                    </el-form-item>
                    <el-form-item label="YTD">
                      {{`${(model.ytd * 100 ).toFixed(2)}%`}}
                    </el-form-item>
                    <el-form-item label="近三年收益率">
                      {{`${(model.three_year_profit * 100 ).toFixed(2)}%`}}
                    </el-form-item>
                  </div>
                </el-form>
                <div class="divider"></div>
                <div ref="fundAchievementChart" class="achievement-chart"></div>
                <el-form ref="fundAchievementForm" v-if="edit" label-width="160px">
                  <el-form-item
                    v-for="(ff, index) in model_new.fund"
                    :label="`${formatTimeMonth(ff.time)}净值`"
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
                    <template slot-scope="scope">
                    {{ `${(scope.row.monthly_yield * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column label="回撤" prop="fallback">
                    <template slot-scope="scope">
                    {{ `${(scope.row.fallback * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column label="滚动12月" prop="roll_year">
                    <template slot-scope="scope">
                    {{ `${(scope.row.roll_year * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column label="滚动18月" prop="roll_eighteen_month">
                    <template slot-scope="scope">
                    {{ `${(scope.row.roll_eighteen_month * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="90" label="滚动12月>0" prop="roll_12_gt_0">
                    <template slot-scope="scope">
                    {{ scope.row.roll_12_gt_0 ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column width="110" label="滚动12月>10%" prop="roll_12_gt_10">
                    <template slot-scope="scope">
                    {{ scope.row.roll_12_gt_10 ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column width="90" label="滚动18月>0" prop="roll_18_gt_0">
                    <template slot-scope="scope">
                    {{ scope.row.roll_18_gt_0 ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column width="110" label="滚动18月>10%" prop="roll_18_gt_10">
                    <template slot-scope="scope">
                    {{ scope.row.roll_18_gt_10 ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column width="80" label="夏普比率" prop="sharpe_ratio">
                  </el-table-column>
                  <el-table-column width="100" label="成立以来收益" prop="profit">
                    <template slot-scope="scope">
                    {{ `${(scope.row.profit * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="最近一年收益" prop="one_year_profit">
                    <template slot-scope="scope">
                    {{ `${(scope.row.one_year_profit * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="最近一年年化" prop="one_year_annualized">
                    <template slot-scope="scope">
                    {{ `${(scope.row.one_year_annualized * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="最近两年收益" prop="two_year_profit">
                    <template slot-scope="scope">
                    {{ `${(scope.row.two_year_profit * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="最近两年年化" prop="two_year_annualized">
                    <template slot-scope="scope">
                    {{ `${(scope.row.two_year_annualized * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="最近三年收益" prop="three_year_profit">
                    <template slot-scope="scope">
                    {{ `${(scope.row.three_year_profit * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="最近三年年化" prop="three_year_annualized">
                    <template slot-scope="scope">
                    {{ `${(scope.row.three_year_annualized * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="最近五年收益" prop="five_year_profit">
                    <template slot-scope="scope">
                    {{ `${(scope.row.five_year_profit * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                  <el-table-column width="100" label="最近五年年化" prop="five_year_annualized">
                    <template slot-scope="scope">
                    {{ `${(scope.row.five_year_annualized * 100 ).toFixed(2)}%` }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <template v-else>
                <el-form class="demo-table-expand" label-width="100px" label-position="left">
                  <el-form-item label="业绩信息" prop="achievement">
                    <label for="file" class="el-button search-button">
                      <i class="el-icon-plus"></i>
                      <span>上传文件</span>
                    </label>
                    <input id="file" type="file" @change="onFileChange" />
                    <h3 class="filename">{{ fileName }}</h3>
                  </el-form-item>
                </el-form>
              </template>
              </el-tab-pane>
              <!-- 基金档案管理 -->
              <el-tab-pane label="基金档案管理" name="archive">
                <div>
                  <el-form ref="spuForm" :model="model_new" :rules="rules" class="demo-table-expand" label-width="100px" label-position="left">
                    <div class="title">基本信息</div>
                    <div class="fund_archive-table">
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
                        {{model.memo}}
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
        <span>请选择月份<br>（请按时间先后顺序插入，否则可能会有计算错误的问题）</span>
        <el-date-picker
          style="margin-left:12px;width:220px;"
          v-model="new_time"
          type="month"
          placeholder="选择月份"
          format="yyyy 年 MM 月"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </div>
      <div class="flex-justify_center" style="margin-top:24px;">
        <span>请输入净值</span>
        <el-input v-model="new_net_worth" type="number" style="margin-left:12px;width:220px;" size="small" clearable></el-input>
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
import { parseFile } from './Upload/options'
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
      activeName: 'achievement',
      dialogVisible: false,
      isHighWater: false,
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
      fileName: null, // 文件名称
      xlsx: {},
      fundAchievement: [], // 业绩信息
      fundAchievementChart: null
    }
  },
  props: {
    id: {
      type: String
    }
  },
  computed: {
    // 当前选中表格
    sheet () {
      if (!this.xlsx) return [{}]
      return this.xlsx[this.sheetTabs[0]] || [{}]
    },
    // 所有表格名称
    sheetTabs () {
      return Object.keys(this.xlsx)
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
          this.isHighWater = false
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
    async onFileChange (e) {
      this.loading = true
      const files = e.target.files
      if (files && files[0]) {
        this.fileName = files[0].name
        this.xlsx = await parseFile(files[0])
        this.loading = false
        this.initializeForm()
      }
    },
    initializeForm () {
      if (!this.xlsx || !this.sheetTabs) return
      console.log('xlsx', this.xlsx[this.sheetTabs[0]])

      const sheet = this.xlsx[this.sheetTabs[0]]
      if (!sheet) return
      // 处理首行填充
      // for (let key in Object.keys(sheet[0])) {
      //   const result = Object.keys(sheet[0])[key]
      //   const value = Object.values(this.sheet[0])[key]
      //   // console.log(value)
      //   if (result.includes('基金名')) {
      //     this.fundArchive.name = value
      //   } else if (result.match(/(经理|manager)/i)) {
      //     this.fundArchive.type = 'MANAGER'
      //     this.fundArchive.manager = value
      //   }
      // }
      let fundAchievement = []
      sheet.forEach(col => {
        let a = {}
        // const a = rule(col)
        // console.log('col', col, Object.keys(col))
        for (let key in Object.keys(col)) {
          const result = Object.keys(col)[key]
          const value = Object.values(col)[key]
          if (result.match(/(日期|date)/i)) {
            a.time = value
          } else if (result.match(/(净值|value)/i)) {
            a.net_worth = value
          }
        }
        // console.log('a', a)
        if (a.time && a.net_worth) {
          fundAchievement.push(a)
        }
      })
      this.fundAchievement = fundAchievement
      console.log(this.fundAchievement)
    },
    goBack () {
      if (this.edit) {
        this.editFundCancel()
      } else {
        this.$router.go(-1)
      }
    },
    handleClick () {
      this.edit = false
    },
    editFund() {
      this.model_new = deepCopy(this.model)
      this.edit = true
    },
    editFundConfirm () {
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          if (this.activeName === 'achievement')
            this.handleEditAchievement()
          else
            this.handleEditArchive(this.model_new)
          this.edit = false
        }
      })
    },
    handleEditArchive (parm) {
      this.loading = true
      this.$axios.patch(`/insider/fund_archive/${this.$route.params.id}/`, parm)
        .then(() => {
          this.$message.success('保存成功')
          this.loading = false
        }).catch(() => {
          this.$message.error('保存失败')
          this.loading = false
        })
    },
    handleEditAchievement () {
      // 并行
      // const promiseAll = parm.fund.map((data) => {
      //   return this.$axios.patch(`/insider/fund_achievement/${data.id}/`, data)
      // })
      // Promise.all(promiseAll).then(() => {
      //   this.$message.success('保存成功')
      //   this.getData()
      // })
      // 串行
      // this.patchAchievement(parm,0)
      this.$axios.delete(`/insider/fund_archive/${this.$route.params.id}/fund_achievement_del/`).then(() => {
        this.addArchive(this.model_new.fund)
      })
    },
    addArchive(parm) {
      this.postAchievement(parm, this.$route.params.id , 0)
    },
    postAchievement(parm, id, index) {
      this.loading = true
      if (index > parm.length - 1) {
        this.$message.success('创建成功')
        this.loading = false
        // setTimeout(() => {
        //   this.$router.go(0)
        // }, 800)
        return
      } else {
        const params = {
          time: formatTimeMonth(parm[index].time),
          net_worth: parm[index].net_worth,
          fund: id
        }
        this.$axios.post(`/insider/fund_achievement/`, params).then(()=>{
          this.postAchievement(parm, id, index + 1)
        })
      }
    },
    // patchAchievement(parm, index) {
    //   if (index > parm.fund.length - 1) {
    //     console.log(index, parm)
    //     this.$message.success('保存成功')
    //     this.getData()
    //     return
    //   } else {
    //     console.log(parm.fund[index])
    //     this.$axios.patch(`/insider/fund_achievement/${parm.fund[index].id}/`, parm.fund[index]).then(()=>{
    //       this.patchAchievement(parm, index + 1)
    //     })
    //   }
    // },
    deleteArchive() {
      this.$confirm('确认删除基金业绩？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/insider/fund_archive/${this.$route.params.id}/fund_achievement_del/`).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          setTimeout(() => {
            this.$router.go(0)
          }, 800)
        })
      })
    },
    deleteFund() {
      this.$confirm('确认删除此基金？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/insider/fund_archive/${this.$route.params.id}/`).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 800)
        })
      })
    },
    editFundCancel () {
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
    },
    HighWater() {
      this.loading = true
      if(!this.isHighWater) {
        this.$axios.get(`/insider/fund_high_water/?fund=${this.$route.params.id}`).then(res => {
          this.isHighWater = true
          this.model.fund = res.data
          this.loading = false
        })
      } else {
        this.getData()
      }
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
.fund_archive-table {
  width: 100%;
  display: grid;
  grid-template-columns: repeat( 2, 1fr );
  grid-column-gap: 10px;
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
  margin: 48px auto 0;
}
</style>
