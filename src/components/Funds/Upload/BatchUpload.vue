<template>
  <div class="main-col">
    <div class="filter-container">
      <div style="float: right;margin-top:12px;margin-right:12px;">
        <el-button
          :disabled="!fileName || disabled"
          size="medium"
          type="primary"
          @click="onSubmit"
        >
          导入该表格
        </el-button>
      </div>
      <label for="file" class="el-button el-button--primary el-button--medium search-button">
        <i class="el-icon-plus"></i>
        <span>上传文件</span>
      </label>
      <input id="file" type="file" @change="onFileChange" />
      <h3 class="filename">{{ fileName }}</h3>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-row v-if="hasData">  
          <el-col :span="24">
            <el-tabs v-model="currentSheet" type="card">
              <el-tab-pane v-for="key in sheetTabs" :key="key" :label="key" :disabled="disabled">
                <!-- 原始excel表格 -->
                <el-table ref="form" :data="tableModel" stripe>
                  <el-table-column label="表格字段" prop="col">
                  </el-table-column>
                  <el-table-column label="样例数据" prop="example">
                  </el-table-column>
                </el-table>
                <!-- 原始excel表格 END -->
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>  
        <empty-page v-else></empty-page>
        <el-dialog :visible="disabled && !!message" :show-close="false" :title="message">
          <el-progress :percentage="percentage"></el-progress>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import { parseFile } from './options'

export default {
  name: 'BatchUpload',
  components: {
    EmptyPage
  },
  data () {
    return {
      sended: 0, // 已经处理了多少个表格，等于this.sheetTabs.length即完成
      disabled: false,
      // 上传信息
      message: '',
      percentage: 0,

      fileName: null,
      currentSheet: null,
      // Excel对象
      xlsx: {},
      // 基金信息
      fundArchive: [], // 基金档案
      fundAchievement: [] // 业绩信息
    }
  },
  computed: {
    hasData () {
      return this.xlsx && Object.keys(this.xlsx).length
    },
    // 当前选中表格
    sheet () {
      if (!this.xlsx || this.currentSheet == null) return [{}]
      return this.xlsx[this.sheetTabs[+this.currentSheet]] || [{}]
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
      // const tab = `${this.sheetTabs[this.currentSheet]}`
      const firstEntryValues = Object.values(this.sheet[0])
      return this.sheetColumns.map((col, index) => ({
        col,
        example: firstEntryValues[index]
      }))
    }
  },
  watch: {
    sended (val) {
      if (val === this.sheetTabs.length) {
        this.$message.success('上传完毕！')
        this.disabled = false
        setTimeout(() => {
          this.$router.push(`/goods/list`)
        }, 800)
      }
    }
  },
  methods: {
    async onFileChange (e) {
      this.disabled = true
      const files = e.target.files
      if (files && files[0]) {
        console.log(files)
        this.fileName = files[0].name
        this.xlsx = await parseFile(files[0])
        this.disabled = false
        this.initializeForm()
      }
    },
    initializeForm () {
      if (!this.xlsx || !this.sheetTabs) return
      console.log('xlsx', this.xlsx)

      this.sheetTabs.forEach(tab => {
        const sheet = this.xlsx[tab]
        if (!sheet) return

        // 处理首行填充
        let fundArchive = {
          name: '',
          type: 'INDEX',
          manager: ''
        }
        for (let key in Object.keys(sheet[0])) {
          const result = Object.keys(sheet[0])[key]
          const value = Object.values(sheet[0])[key]
          if (result.includes('基金名')) {
            fundArchive.name = value
          } else if (result.match(/(经理|manager)/i)) {
            fundArchive.type = 'MANAGER'
            fundArchive.manager = value
          }
        }
        this.fundArchive.push(fundArchive)
        let fundAchievement = []
        sheet.forEach(col => {
          let a = {}
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
          if (a.time && a.net_worth) {
            fundAchievement.push(a)
          }
        })
        this.fundAchievement.push(fundAchievement)
      })
    },
    async onSubmit () {
      console.log(this.fundArchive, this.fundAchievement)
      this.disabled = true
      this.message = '上传中，请稍候'
      this.percentage = 2

      this.fundArchive.map((data, index) => {
        this.$axios.post(`/insider/fund_archive/`, data).then((res) => {
          if (res.data.id) {
            this.message = '上传基金业绩中，请稍候'
            this.percentage += 49.0 / this.sheetTabs.length
            this.uploadFundAchievement(res.data.id, index)
          } else if (res.data.fund_id && res.data.fund_id[0]) {
            this.$axios.patch(`/insider/fund_archive/${res.data.fund_id[0]}/`, data).then(() => {
              this.message = '上传基金业绩中，请稍候'
              this.percentage += 49.0 / this.sheetTabs.length
              this.uploadFundAchievement(res.data.fund_id[0], index)
            }).catch(() => {
              this.disabled = false
            })
          }
        }).catch(() => {
          this.disabled = false
        })
      })
    },
    uploadFundAchievement (id, tableIndex) {
      // 逐条添加业绩信息
      // 并行
      // const promiseAll = this.fundAchievement[tableIndex].map((data) => {
      //   const params = {
      //     ...data,
      //     fund: id
      //   }
      //   return this.$axios.post('/insider/fund_achievement/', params)
      // })
      // Promise.all(promiseAll).then(() => {
      //   this.message = `基金业绩上传完成${this.sended}个，还有${this.sheetTabs.length - this.sended}个`
      //   this.percentage += 49.0 / this.sheetTabs.length
      //   this.sended += 1
      // }).catch(() => {
      //   this.disabled = false
      // })
      // 串行
      this.patchAchievement(this.fundAchievement[tableIndex], id, 0)
    },
    patchAchievement(parm, id, index) {
      if (index > parm.length - 1) {
        this.message = '基金业绩上传完成！'
        this.sended += 1
        return
      } else {
        this.percentage = Math.round(100 * this.percentage + 4900 / (this.sheetTabs.length * parm.length)) / 100
        // console.log('parm index', parm[index])
        const params = {
          ...parm[index],
          fund: id
        }
        // console.log('params', params)
        this.$axios.post(`/insider/fund_achievement/`, params).then(()=>{
          this.patchAchievement(parm, id, index + 1)
        })
      }
    }
  }
}
</script>

<style scoped>
form {
  float: right;
  margin-top: 22px;
}
</style>
