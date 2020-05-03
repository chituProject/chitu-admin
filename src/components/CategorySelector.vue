<template>
  <el-dialog
    title="请选择需要添加的品类"
    :visible.sync="dialogVisible"
    width="80%"
    center>
    <div class="transfer-outer">
      <transfer-panel
        class="transfer"
        ref="firstPanel"
        :sourceData="first_category"
        :defaultChecked="[]"
        :props="{
          key: 'id',
          label: 'name'
        }"
        :title="'选择一级品类'"
        filterable
        @checked-change="onFirstChange">
      </transfer-panel>
      <transfer-panel
        class="transfer"
        ref="secondPanel"
        :sourceData="second_category"
        :defaultChecked="[]"
        :props="{
          key: 'id',
          label: 'name'
        }"
        filterable
        :title="'选择二级品类'"
        @checked-change="onSecondChange">
      </transfer-panel>
      <div class="transfer">
        <el-transfer
          v-model="checked"
          :props="{
            key: 'id',
            label: 'name'
          }"
          :titles="['选择三级品类', '已选择']"
          :data="third_category"
          filterable>
        </el-transfer>
      </div>
    </div>
    <div style="text-align: center;">
      <el-button type="primary" @click="setCategoryConfirm" size="medium">确定</el-button>
      <el-button @click="dialogVisible = false" size="medium">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TransferPanel from '@/assets/transfer-panel'
import { deepCopy } from '@/assets/util'

export default {
  name: 'CategorySelector',
  components: {
    TransferPanel
  },
  data () {
    return {
      dialogVisible: false,
      first_category: [],
      second_category: [],
      third_category: [],
      checked: []
    }
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    open (model) {
      this.checked = deepCopy(model)
      this.appendSelected([])
      this.dialogVisible = true
    },
    getCategory (id) {
      let label = ''
      this.categories.forEach(item => {
        if (item.id === id) {
          label = item
        }
      })
      return label
    },
    setCategoryConfirm () {
      this.$emit('categoryConfirm', this.checked)
      this.dialogVisible = false
    },
    onFirstChange (val) {
      if (val) {
        let that = this
        this.$axios.get('/insider/category_first/' + val + '/')
          .then(res => {
            console.log('first', res.data)
            that.second_category = res.data.category_second
            that.appendSelected([])
          })
      }
    },
    onSecondChange (val) {
      if (val) {
        let that = this
        this.$axios.get('/insider/category_second/' + val + '/')
          .then(res => {
            console.log('second', res.data)
            that.appendSelected(res.data.category_third)
          })
      }
    },
    appendSelected (categoryThird) {
      let showCategories = categoryThird.map(item => { return item.id })
      for (let i = 0; i < this.checked.length; i++) {
        let selected = this.getCategory(this.checked[i])
        let index = showCategories.indexOf(selected.id)
        if (index !== -1) {
          categoryThird.splice(index, 1)
          showCategories = categoryThird.map(item => { return item.id })
        }
      }
      this.third_category = []
      for (let i = 0; i < this.checked.length; i++) {
        let selected = this.getCategory(this.checked[i])
        this.third_category.push(selected)
      }
      this.third_category = this.third_category.concat(categoryThird)
    },
    clear () {
      this.checked = []
      this.second_category = []
      this.third_category = []
    }
  },
  mounted () {
    let that = this
    this.$axios.get('/insider/category_first/')
      .then(res => {
        console.log(res.data)
        that.first_category = res.data
      })
    this.$axios.get('/insider/category_third/')
      .then(res => {
        that.$store.commit('SET_CATEGORIES', res.data)
      })
  }
}
</script>

<style scoped>
  .transfer {
    display: inline-block;
    text-align: left;
  }
  .transfer-outer {
    width: 100%;
    text-align: center;
    margin-bottom: 40px;
  }
</style>
