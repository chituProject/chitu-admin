<template>
  <div class="main-col">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="closeWindow">返回</el-button>
    </div>
    <div class="card-outer" v-if="resellerInfo">
      <div class="card-container">
        <div class="avatar-container">
          <div class="title">未激活粉丝{{resellerInfo.inactive_fans_count}}人</div>
          <img v-for="(fans, i) in resellerInfo.inactive_fans" :key="i" :src="fans.wechat_avatar_url" class="avatar">
        </div>
        <div class="divider-bar"></div>
        <div class="avatar-container">
          <div class="title">已激活粉丝{{resellerInfo.active_fans_count}}人</div>
          <img v-for="(fans, i) in resellerInfo.active_fans" :key="i" :src="fans.wechat_avatar_url" class="avatar">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResellerIndividualDetail',
  data () {
    return {
      loading: false,
      resellerInfo: null
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    closeWindow () {
      window.open('javascript:window.open("", "_self", "");window.close();', '_self')
    }
  },
  mounted () {
    let that = this
    this.$axios.get('/insider/reseller_person/' + this.id)
      .then(res => {
        console.log(res.data)
        that.resellerInfo = res.data
      })
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .card-container {
    padding: 20px;
    margin: 20px;
    text-align: left;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    margin: 20px 20px 10px 4px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    margin: 4px;
  }
  .avatar-container {
    width: 100%;
  }
  .divider-bar {
    height: 20px;
    width: 100%;
  }
</style>
