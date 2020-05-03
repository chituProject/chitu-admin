<template>
  <div class="main-col" v-loading="loading">
    <div class="full-container">
      <p>活跃场景定义：</p>
      <div class="line-wrapper">
        <el-checkbox v-model="count_checked"/>
        <span>近</span>
        <el-input type="number" v-model.number="form.order_count_time"/>
        <span>天成单数大于</span>
        <el-input type="number" v-model.number="form.order_count"/>
        <span>单</span>
      </div>
      <div class="line-wrapper">
        <el-checkbox v-model="amount_checked"/>
        <span>近</span>
        <el-input type="number" v-model.number="form.order_amount_time"/>
        <span>天销售额大于</span>
        <el-input type="number" v-model.number="form.order_amount"/>
        <span>元</span>
      </div>
      <br />
      <el-button type="primary" @click="postData" :disabled="!$can('edit', 'Platform')">确认</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlatformReseller',
  data () {
    return {
      loading: false,
      count_checked: false,
      amount_checked: false,
      form: {
        order_count_time: 0,
        order_count: 0,
        order_amount_time: 0,
        order_amount: 0
      }
    }
  },
  methods: {
    updateData (res) {
      this.form.order_count_time = res.order_count_time
      this.form.order_count = res.order_count
      this.form.order_amount_time = res.order_amount_time
      this.form.order_amount = res.order_amount / 100
      this.count_checked = this.form.order_count > 0
      this.amount_checked = this.form.order_amount > 0
    },
    getData () {
      let that = this
      that.loading = true
      this.$axios.get('/insider/reseller/get_active/')
        .then(res => {
          that.updateData(res.data)
        })
        .finally(() => {
          that.loading = false
        })
    },
    postData () {
      let form = {}
      if (this.count_checked && this.form.order_count_time > 0 && this.form.order_count > 0) {
        form.order_count_time = Math.floor(this.form.order_count_time)
        form.order_count = Math.floor(this.form.order_count)
      }
      if (this.amount_checked && this.form.order_amount_time > 0 && this.form.order_amount > 0) {
        form.order_amount_time = Math.floor(this.form.order_amount_time)
        form.order_amount = Math.floor(this.form.order_amount * 100)
      }
      let that = this
      that.loading = true
      this.$axios.post('/insider/reseller/set_active/', form)
        .then(res => {
          that.getData()
        })
        .catch(() => {
          that.loading = false
        })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
  .full-container {
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    background-color: #fff;
    padding: 20px;
    text-align: left;
  }
  .line-wrapper {
    display: flex;
    align-items: center;
  }
  .line-wrapper + .line-wrapper {
    margin-top: 20px;
  }
  .line-wrapper .el-checkbox {
    margin-right: 10px;
  }
  .line-wrapper .el-input {
    width: 100px;
    margin: 0 10px;
  }
</style>
