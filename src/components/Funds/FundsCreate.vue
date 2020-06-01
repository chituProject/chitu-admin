<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button type="primary" size="medium" @click="createFundsConfirm">确认创建</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-form ref="spuForm" :model="fundArchive" :rules="rules" class="demo-table-expand" label-width="160px" label-position="left">
          <div>
            <el-form-item label="业绩信息" prop="achievement">
              <label for="file" class="el-button search-button">
                <i class="el-icon-plus"></i>
                <span>上传文件</span>
              </label>
              <input id="file" type="file" @change="onFileChange" />
              <h3 class="filename">{{ fileName }}</h3>
            </el-form-item>
            <el-form-item label="基金类别" prop="type">
              <el-select v-model="fundArchive.type">
                <el-option
                  v-for="item in fund_type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="基金名称" prop="name">
              <el-input v-model="fundArchive.name" clearable placeholder= "请输入基金名"></el-input>
            </el-form-item>
            <el-form-item v-if="fundArchive.type === 'MANAGER'" label="基金经理" prop="manager">
              <el-input v-model="fundArchive.manager" clearable placeholder= "请输入基金经理"></el-input>
            </el-form-item>

            <template v-if="fundArchive.type === 'MANAGER'">
              <detail-paras :edit="true" :title="'概述'" :value="fundArchive.general_infomation" @change="updateGeneralInformation"></detail-paras>
              <detail-paras :edit="true" :title="'运营'" :value="fundArchive.operation" @change="updateOperation"></detail-paras>
              <detail-paras :edit="true" :title="'条款和条件'" :value="fundArchive.article" @change="updateArticle"></detail-paras>
              <detail-paras :edit="true" :title="'组合特征'" :value="fundArchive.combination" @change="updateCombination"></detail-paras>
              <detail-paras :edit="true" :title="'多投'" :value="fundArchive.long_positions" @change="updateLongPositions"></detail-paras>
              <detail-paras :edit="true" :title="'空投'" :value="fundArchive.short_positions" @change="updateShortPositions"></detail-paras>
              <detail-paras :edit="true" :title="'整体仓位'" :value="fundArchive.designed_exposure" @change="updateDesignedExposure"></detail-paras>
            </template>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import DetailParas from './Detail/DetailParas'
import { parseFile } from './Upload/options'

export default {
  name: 'FundsCreate',
  components: {
    DetailParas
  },
  data () {
    return {
      loading: false,
      fundId: null,
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
      fileName: null, // 文件名称
      xlsx: {},
      // Excel预定义字段
      currentSheet: 0,
      fundArchive: {
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
      fundAchievement: [], // 业绩信息
      rules: {
        type: [
          { required: true, message: '请选择基金类别', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '基金名称限10字以内', trigger: 'blur', max: 10 }
        ]
      }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    updateGeneralInformation (value) {
      this.$set(this.fundArchive, 'general_infomation', value)
    },
    updateOperation (value) {
      this.$set(this.fundArchive, 'operation', value)
    },
    updateArticle (value) {
      this.$set(this.fundArchive, 'article', value)
    },
    updateCombination (value) {
      this.$set(this.fundArchive, 'combination', value)
    },
    updateLongPositions (value) {
      this.$set(this.fundArchive, 'long_positions', value)
    },
    updateShortPositions (value) {
      this.$set(this.fundArchive, 'short_positions', value)
    },
    updateDesignedExposure (value) {
      this.$set(this.fundArchive, 'designed_exposure', value)
    },
    async onFileChange (e) {
      this.disabled = true
      const files = e.target.files
      if (files && files[0]) {
        this.fileName = files[0].name
        this.xlsx = await parseFile(files[0])
        this.disabled = false
        this.initializeForm()
      }
    },
    initializeForm () {
      if (!this.xlsx || !this.sheetTabs) return
      console.log('xlsx', this.xlsx[this.sheetTabs[0]])

      const sheet = this.xlsx[this.sheetTabs[0]]
      if (!sheet) return
      // 处理首行填充
      for (let key in Object.keys(sheet[0])) {
        const result = Object.keys(sheet[0])[key]
        const value = Object.values(this.sheet[0])[key]
        console.log(value)
        if (result.includes('基金名')) {
          this.fundArchive.name = value
        } else if (result.match(/(经理|manager)/i)) {
          this.fundArchive.type = 'MANAGER'
          this.fundArchive.manager = value
        }
      }
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
    },
    createFundsConfirm () {
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.fundId) {
            this.$axios.patch(`/insider/fund_archive/${this.fundId}/`, this.fundArchive)
              .then(res => {
                this.uploadFundAchievement(res.data.id)
              }).catch(error => {
                console.log(error)
                this.$message.error('创建失败，请检查您的网络连接')
                this.loading = false
              })
          } else {
            this.$axios.post('/insider/fund_archive/', this.fundArchive)
              .then(res => {
                this.fundId = res.data.id
                this.uploadFundAchievement(res.data.id)
              }).catch(error => {
                console.log(error)
                this.$message.error('创建失败，请检查您的网络连接')
                this.loading = false
              })
          }
        } else {
          this.$message.error('请填写所有项目')
        }
      })
    },
    uploadFundAchievement (id) {
      // 逐条添加业绩信息
      const promiseAll = this.fundAchievement.map((data) => {
        const params = {
          ...data,
          fund: id
        }
        return this.$axios.post('/insider/fund_achievement/', params)
      })
      Promise.all(promiseAll).then((resArr) => {
        console.log(resArr)
        this.$message.success('创建成功')
        this.loading = false
        setTimeout(() => {
          this.$router.push(`/goods/detail/${id}/`)
        }, 800)
      }).catch(error => {
        console.log(error)
        this.$message.error('保存失败')
        this.loading = false
      })
    }
  },
  computed: {
    hasData () {
      return this.xlsx && Object.keys(this.xlsx).length
    },
    // 当前选中表格
    sheet () {
      if (!this.xlsx) return [{}]
      return this.xlsx[this.sheetTabs[0]] || [{}]
    },
    // 所有表格名称
    sheetTabs () {
      return Object.keys(this.xlsx)
    },
    // 当前选中表格的表头字段
    sheetColumns () {
      if (!this.xlsx) return []
      return Object.keys(this.sheet[0])
    },
    tableModel () {
      const tab = `${this.sheetTabs[0]}`
      const firstEntryValues = Object.values(this.sheet[0])
      return this.sheetColumns.map((col, index) => ({
        col,
        example: firstEntryValues[index],
        type: `${tab}-${col}-type`,
        value: `${tab}-${col}-value`
      }))
    }
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
  .filename {
    margin: 12px 12px 0 0;
      text-align: left;
      line-height: 41px;
      font-size: 18px;
      float: left;
      display: block;
      padding-left: 12px;
      font-weight: normal;
      color: #f26250;
  }
</style>
