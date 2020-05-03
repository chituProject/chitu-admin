<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
    </div>
    <div class="card-outer">
      <div v-if="unauditedList && unauditedList.length > 0" class="card-container">
        <el-card
          v-for="(item, index) in unauditedList"
          :key="index"
          shadow="hover"
          class="card">
          <el-row>
            <el-col :span="20">
              <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
                <el-form-item label="供应商ID">
                  <span>{{item.uuid}}</span>
                </el-form-item>
                <el-form-item label="企业名称">
                  <span>{{item.name}}</span>
                </el-form-item>
                <el-form-item label="联系人">
                  <span>{{item.contact_name}}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>审核中</span>
                </el-form-item>
                <el-form-item label="主营类目">
                  <span>{{item.main_category}}</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="4">
              <router-link :to="'/supplier/merchant/' + item.uuid + '/detail'"><el-button type="primary" size="medium">查看审核</el-button></router-link>
            </el-col>
          </el-row>
        </el-card>
        <el-pagination
          class="pagination"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalCnt"
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <empty-page v-else></empty-page>
    </div>
  </div>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
import constants from '@/assets/constants'
export default {
  name: 'SupplierUnaudited',
  components: {EmptyPage},
  data () {
    return {
      loading: true,
      input: '',
      sort_value: 'name',
      options: [
        {
          label: '企业名称',
          value: 'name'
        }
      ],
      unauditedList: [],
      totalCnt: 0,
      currentPage: 1,
      pageSize: 20,
      status: constants.SCENE_STATUS
    }
  },
  props: {
    model: {
      type: Object
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getUnaudited () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/merchant/?status=UNAUDITED&page_num=' + that.currentPage + '&page_size=' + that.pageSize)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.unauditedList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getUnaudited()
    },
    querySearch () {
    }
  },
  created () {
    this.getUnaudited()
  }
}
</script>

<style scoped>

  .filter-container {
    padding: 12px;
  }
  .demo-table-expand {
    width: 100%;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    margin-top: 5px;
    width: 33%;
    min-width: 200px;
  }
</style>
