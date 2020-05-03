<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <router-link to="/platform/keyword/history"><el-button type="default" class="search-button" size="medium">历史搜索记录</el-button></router-link>
      <div class="right">
        <el-button type="primary" class="search-button" size="medium" @click.stop="addKeyword" v-can:edit="'Platform'">添加推荐搜索关键词</el-button>
        <template v-if="!reRank">
          <el-button class="search-button blue_button_filled" size="medium" @click.stop="startReRank" v-can:edit="'Platform'">重新排序</el-button>
        </template>
        <template v-else>
          <el-button class="search-button" size="medium" @click.stop="cancelReRank" v-can:edit="'Platform'">取消</el-button>
          <el-button class="search-button" type="success" size="medium" @click.stop="confirmReRank" v-can:edit="'Platform'">确定</el-button>
        </template>
      </div>
    </div>
    <div class="card-outer">
      <div v-if="keywordList && keywordList.length > 0" class="card-container">
        <el-table
          ref="table"
          :data="keywordList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="keyword"
            label="关键词">
          </el-table-column>
          <el-table-column
            align="redirect_to"
            label="跳转路径">
          </el-table-column>
          <el-table-column
            align="center"
            prop="count"
            label="搜索次数">
          </el-table-column>
          <el-table-column
            align="center"
            label="排序">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center">
            <template slot-scope="scope">
              <el-button class="blue_button_filled" icon="el-icon-edit" circle @click.stop="editRank(scope.row)" :disabled="!$can('edit', 'Platform')"></el-button>
              <el-button type="primary" icon="el-icon-delete" circle @click.stop="deleteKeyword(scope.row)" :disabled="!$can('edit', 'Platform')"></el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="reRank"
            align="center">
            <template slot-scope="scope">
              <el-button type="default" icon="el-icon-arrow-up" circle :disabled="scope.$index===0 || !$can('edit', 'Platform')" @click.stop="rankUp(scope.row, scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <empty-page v-else></empty-page>
    </div>
    <el-dialog
      title="设置推荐关键词"
      :visible.sync="dialogVisible"
      center>
      <el-form ref="Form" :model="keyWord" :rules="rules" size="small">
        <el-form-item label="关键词名称" prop="keyword">
          <el-input type="text" v-model="keyWord.keyword" placeholder="请输入关键词名称"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径" prop="redirect_to">
          <el-input type="text" v-model="keyWord.redirect_to" placeholder="请输入跳转路径，如果不填则按照默认的搜索规则跳转"></el-input>
        </el-form-item>
        <div style="text-align: center;">
          <el-button type="primary" @click="confirmAdd" size="medium">确定</el-button>
          <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import { formatTime, formatPrice, deepCopy } from '@/assets/util'

export default {
  name: 'list',
  components: {
    EmptyPage
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      reRank: false,
      editId: -1,
      keywordList: [],
      keywordListCopy: [],
      rules: {
        keyword: [
          { required: true, message: '请输入关键词名称', trigger: 'blur' }
        ]
      },
      keyWord: {
        keyword: '',
        redirect_to: '',
        rank: 1
      }
    }
  },
  methods: {
    formatTime,
    formatPrice,
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/recommend_keyword/')
        .then(res => {
          console.log(res.data)
          that.keywordList = res.data
          that.keyWord.rank = res.data.length + 1
        })
        .finally(() => {
          that.loading = false
        })
    },
    addKeyword () {
      this.editId = -1
      this.keyWord.keyword = ''
      this.keyWord.redirect_to = ''
      this.dialogVisible = true
    },
    deleteEmptyString (ob) {
      for (var i in ob) {
        if (ob[i] === '') {
          delete ob[i]
        }
      }
      return ob
    },
    confirmAdd () {
      let that = this
      this.$refs.Form.validate((valid) => {
        if (valid) {
          that.loading = true
          if (that.editId === -1) {
            that.$axios.post('/insider/recommend_keyword/', that.deleteEmptyString(that.keyWord))
              .then(res => {
                console.log(res.data)
                that.getData()
              })
              .catch(error => {
                console.log(error)
                that.$message.error('保存失败')
              })
              .finally(() => {
                that.loading = false
                that.dialogVisible = false
              })
          } else {
            that.$axios.patch('/insider/recommend_keyword/' + that.editId + '/', that.deleteEmptyString(that.keyWord))
              .then(res => {
                console.log(res.data)
                that.getData()
              })
              .catch(error => {
                console.log(error)
                that.$message.error('保存失败')
              })
              .finally(() => {
                that.loading = false
                that.dialogVisible = false
              })
          }
        } else {
          that.$message.error('请填写所有项目')
        }
      })
    },
    editRank (row) {
      this.keyWord.keyword = row.keyword
      this.keyWord.redirect_to = row.redirect_to
      this.keyWord.rank = row.rank
      this.editId = row.id
      this.dialogVisible = true
    },
    deleteKeyword (row) {
      let that = this
      this.$confirm('确定要删除这个关键词吗?', '删除关键词', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.loading = true
        that.$axios.delete('/insider/recommend_keyword/' + row.id + '/')
          .then(res => {
            console.log(res.data)
            that.$message.success('删除成功')
            that.getData()
          })
          .catch(error => {
            console.log(error)
            that.$message.error('删除失败')
          })
          .finally(() => {
            that.loading = false
            that.dialogVisible = false
          })
      })
    },
    rankUp (row, index) {
      console.log(row, index)
      if (index > 0) {
        let temp = deepCopy(this.keywordList[index - 1])
        this.$set(this.keywordList, index - 1, deepCopy(row))
        this.$set(this.keywordList, index, temp)
      }
    },
    startReRank () {
      this.keywordListCopy = deepCopy(this.keywordList)
      this.reRank = true
    },
    cancelReRank () {
      this.keywordList = this.keywordListCopy
      this.reRank = false
    },
    confirmReRank () {
      let that = this
      this.$axios.post('/insider/recommend_keyword/rerank/', this.keywordList.map(item => {
        return item.id
      }))
        .then(res => {
          console.log(res.data)
          that.$message.success('排序成功')
          that.getData()
          that.reRank = false
        })
        .catch(err => {
          console.log(err)
          that.$message.success('排序失败')
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  .right {
    float: right;
    margin-right: 30px;
  }
</style>
