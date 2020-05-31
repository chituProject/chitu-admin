<template>
  <div class="main-col">
    <div class="filter-container">
      <label for="file" class="el-button search-button">
        <i class="el-icon-plus"></i>
        <span>上传文件</span>
      </label>
      <input id="file" type="file" @change="onFileChange" />
      <h3 class="filename">{{ fileName }}</h3>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-tabs v-model="currentSheet" type="card" v-if="hasData">
          <el-tab-pane v-for="key in sheetTabs" :key="key" :label="key" :disabled="disabled">
            <!-- 原始excel表格 -->
            <el-table ref="form" :data="tableModel" stripe>
              <el-table-column label="表格字段" prop="col">
              </el-table-column>
              <el-table-column label="样例数据" prop="example">
              </el-table-column>
            </el-table>
            <!-- 原始excel表格 END -->
            <el-form inline>
              <el-form-item>
                <el-button
                  class="import-button"
                  :disabled="disabled"
                  type="primary"
                  @click="onSubmit()"
                >
                  导入该表格
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
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
      // 已经处理了多少个表格，等于this.sheetTabs.length即完成
      sending: 0,
      disabled: false,
      // 上传信息
      message: '',
      percentage: 0,

      fileName: null,
      currentSheet: null,
      xlsx: {},
      // Excel预定义字段
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
    sending (val) {
      if (val === 0) {
        this.$message.success('上传完毕！')
        this.disabled = false
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

      // TODO:需要外套一个循环
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
          // console.log('a', a)
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
      // try {
      //   this.message = '数据预处理...'; this.percentage = 10
      //   this.message = '数据分割...'; this.percentage = 40
      //   this.sendData()
      //   this.message = '请求中...'; this.percentage = 70
      // } catch (e) {
      //   this.$message.error(e.toString())
      //   this.disabled = false
      // }

      this.fundArchive.map((data, index) => {
        console.log('data', data, index)
        this.$axios.post(`/insider/fund_archive/`, data).then((res) => {
          console.log(res)
          this.uploadFundAchievement(res.data.id, index)
        }).catch(error => {
          console.log(error)
          this.$message.error('创建失败，请检查您的网络连接')
          this.loading = false
        })
      })
    },
    uploadFundAchievement (id, index) {
      // 逐条添加业绩信息
      const promiseAll = this.fundAchievement[index].map((data) => {
        return this.$axios.patch(`/insider/fund_achievement/${id}/`, data)
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
  }
}
</script>

<style scoped>
form {
  float: right;
  margin-top: 22px;
}
</style>
