<template>
  <div v-loading="loading">
    <div class="button-container">
      <el-button type="default" v-can:edit="'Platform'" class="search-button button-container-item" @click="fetchPageByActiveIndex">取消</el-button>
      <el-button type="success" v-can:edit="'Platform'" class="search-button button-container-item" @click="savePage">保存</el-button>
      <el-button type="primary" v-can:edit="'Platform'" class="search-button button-container-item" @click="addPage">新增</el-button>
    </div>
    <el-tabs
      v-if="pages.length > 0"
      v-model="activePage"
      type="card"
      @tab-click="fetchPageByActiveIndex">
      <el-tab-pane v-for="(item, index) in pages" :key="index" :label="item.title" :name="item.id.toString()">
        <el-card shadow="never" class="card tab-content" v-if="item.id == activePage">
          <div class="button-container">
            <el-button v-if="pages.length > 1" type="danger" v-can:edit="'Platform'" class="search-button button-container-item" @click="deletePage(item)">删除该页</el-button>
            <el-button v-if="index > 0" v-can:edit="'Platform'" type="default" class="search-button button-container-item" @click="onMove(index)">提前该页</el-button>
          </div>
          <div>
            <h4 class="title-div">Banner配置</h4>
            <page-banner ref="banner" :pageBanner="true" :list="bannerList" :homepage="homepageItemId" @finish-save="finishSave"></page-banner>
          </div>
          <hr />
          <div>
            <h4 class="title-div">分类设置</h4>
            <page-category ref="category" :homepage="homepageItemId" @finish-save="finishSave"></page-category>
          </div>
          <hr />
          <div>
            <h4 class="title-div">抢购时间</h4>
            <page-rush ref="rush" :homepage="homepageItemId" @finish-save="finishSave"></page-rush>
          </div>
          <hr />
          <div>
            <h4 class="title-div">好物评价</h4>
            <page-assess ref="comment" :list="commentList" :homepage="homepageItemId" @finish-save="finishSave"></page-assess>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import PageBanner from './PageBanner'
import PageCategory from './PageCategory'
import PageGoods from './PageGoods'
import PageAssess from './PageAssess'
import RushTimes from './RushTimes'

export default {
  name: 'Page',
  data () {
    return {
      loading: false,
      showAddPage: false,
      activePage: '',
      pages: [],
      homepageItem: null,
      change_cnt: 0
    }
  },
  components: {
    PageBanner,
    PageCategory,
    PageGoods,
    PageAssess,
    PageRush: RushTimes
  },
  computed: {
    maxRank () {
      return this.pages.length
    },
    homepageItemId () {
      return this.homepageItem ? this.homepageItem.id : -1
    },
    bannerList () {
      return this.homepageItem ? (this.homepageItem.homepage_banner_item || []) : []
    },
    commentList () {
      return this.homepageItem ? (this.homepageItem.recommend || []) : []
    }
  },
  methods: {
    fetchPageByActiveIndex () {
      this.getPageDetail(parseInt(this.activePage))
    },
    async getPageDetail (id) {
      this.loading = true
      try {
        const res = await this.$axios.get('/insider/homepage/' + id + '/')
        this.homepageItem = res.data.homepage_item.find(i => i.title === 'Banner')
        this.$refs.rush.forEach(page => page.getData())
        if (this.homepageItemId < 0) {
          await this.$axios.post('/insider/homepage_item/', {
            homepage_banner_item: [],
            goods_type: 'NULL',
            banner_type: 'CAROUSEL',
            homepage: parseInt(this.activePage),
            title: 'Banner'
          })
        }
      } catch (e) {
      }
      this.loading = false
    },
    getAllPages () {
      this.loading = true
      this.$axios.get('/insider/homepage/')
        .then(res => {
          console.log('getAllPages', res.data)
          res.data.sort((a, b) => {
            return a.rank - b.rank
          })
          this.pages = res.data
          if (res.data.length > 0 && this.activePage === '') {
            this.activePage = res.data[0].id.toString()
            this.getPageDetail(res.data[0].id)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    deletePage (item) {
      this.$confirm('确认要删除这个页面吗？标题：' + item.title, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(() => {})
        .then(() => this.$axios.delete('/insider/homepage/' + item.id + '/'))
        .then(() => {
          this.$message.success('删除成功')
          this.activePage = ''
          this.getAllPages()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('删除失败')
        })
    },
    addPage () {
      this.$prompt('请输入页面名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) =>
          this.$axios.post('/insider/homepage/', {
            title: value,
            rank: this.maxRank
          })
        )
        .then(res => {
          this.getAllPages()
        })
        .catch(() => {})
    },
    async savePage () {
      this.$refs.banner.forEach(page => page.save())
      this.$refs.category.forEach(page => page.save())
      this.$refs.comment.forEach(page => page.save())
      this.$refs.rush.forEach(page => page.save())
      this.change_cnt =
        this.$refs.banner.length +
        this.$refs.category.length +
        this.$refs.comment.length +
        this.$refs.rush.length
    },
    finishSave () {
      this.change_cnt -= 1
      if (this.change_cnt === 0) {
        this.$message.success('保存成功')
        this.getPageDetail(parseInt(this.activePage))
      }
    },
    onMove (index) {
      if (index === 0) {
        return
      }
      const patch = (i, rank) =>
        this.$axios.patch('/insider/homepage/' + this.pages[i].id + '/', {
          title: this.pages[i].title,
          rank: rank
        })
      axios.all([patch(index, index - 1), patch(index - 1, index)])
        .then(this.$axios.spread(() => {
          this.$message.success('修改成功')
        }))
        .finally(() => this.getAllPages())
    }
  },
  mounted () {
    this.getAllPages()
  }
}
</script>

<style scoped>
  .tab-content {
    /*padding: 20px;*/
    text-align: left;
  }
  .title-div {
    /*margin-left: 10px;*/
    margin-bottom: 10px;
  }
  .button-container {
    overflow: hidden;
    width: 100%;
  }
  .button-container-item {
    float: right;
    /*margin-left: 10px;*/
  }
</style>
