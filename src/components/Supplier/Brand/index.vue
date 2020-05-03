<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-select v-model="sort_value" class="selecter">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input
        class="search"
        v-model="input"
        placeholder="搜索内容"
        @change="querySearch"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" class="search-button" size="medium" disabled>搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" class="search-button" size="medium" v-can:edit="'Supplier'" @click="openBrand(null)">新增品牌</el-button>
    </div>
    <div class="card-outer">
      <div v-if="brandList && brandList.length > 0" class="card-container">
        <el-card
          v-for="(item, index) in brandList"
          :key="index"
          shadow="hover"
          class="card">
          <div @click="openBrand(item)">
            <div style="display: flex; flex-direction: row;align-items: center">
              <img :src="item.logo" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;"/>
              <el-form inline class="demo-table-expand" label-width="100px" label-position="left">
                <el-form-item label="品牌ID">
                  <span>{{item.id}}</span>
                </el-form-item>
                <el-form-item label="商标注册号">
                  <span>{{item.register_code}}</span>
                </el-form-item>
                <el-form-item label="品牌名">
                  <span>{{item.name}}</span>
                </el-form-item>
                <el-form-item label="企业">
                  <span>{{item.merchant.name}}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
        <el-pagination
          v-if="pageSize < totalCnt"
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
    <brand-add-edit ref="brandAdd" @goBack="handleGoBack" @complete="handleComplete"></brand-add-edit>
  </div>
</template>

<script>
import BrandAddEdit from '@/components/Supplier/Brand/BrandAddEdit'
import EmptyPage from '@/components/EmptyPage'

export default {
  name: 'Brand',
  components: {
    EmptyPage,
    BrandAddEdit
  },
  data () {
    return {
      input: '',
      sort_value: 'name',
      options: [
        {
          label: '品牌名',
          value: 'name'
        }
      ],
      brandList: [],
      totalCnt: 0,
      currentPage: 1,
      pageSize: 20,
      loading: true
    }
  },
  methods: {
    getBrand () {
      let that = this
      this.loading = true
      this.$axios.get('/insider/brand/?page_num=' + that.currentPage + '&page_size=' + that.pageSize)
        .then(res => {
          console.log(res.data)
          that.totalCnt = res.data.count
          that.brandList = res.data.results
        })
        .finally(() => {
          that.loading = false
        })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getBrand()
    },
    openBrand (brand) {
      if (this.$can('edit', 'Supplier')) {
        this.$refs.brandAdd.open(brand)
      }
    },
    handleGoBack () {
      this.$refs.brandAdd.close()
    },
    handleComplete () {
      let that = this
      this.$axios.get('/insider/goods/merchant/')
        .then(res => {
          console.log(res.data)
          that.$store.commit('SET_MERCHANT', res.data)
        })
        .catch(err => {
          console.log(err)
          this.$message.warning('无法获取品牌信息')
        })
      this.getBrand()
      this.$refs.brandAdd.close()
    },
    querySearch () {
    }
  },
  created () {
    this.getBrand()
  }
}
</script>

<style scoped>

  .demo-table-expand {
    flex: 1;
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    margin-top: 5px;
    width: 50%;
    min-width: 200px;
  }
  .card:hover {
    cursor: pointer;
  }
</style>
