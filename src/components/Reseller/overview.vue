<template>
  <div class="card-container container-fluid">
    <div class="row has-padding" v-if="overview">
      <div class="col-sm-3 col-md-3 col-lg-3">
        <p class="fs-14 line-26">合伙人可提现：</p>
        <p class="main-color fs-23 line-30">0 元 (暂无接口)</p>
      </div>
      <div class="col-sm-3 col-md-3 col-lg-3 left-divider">
        <div class="fs-14 line-30">线下收款总额：{{ overview.offpay_order_amount.total | formatPriceFixed }} 元</div>
      </div>
      <div class="col-sm-3 col-md-3 col-lg-3">
        <p class="fs-14 line-26">合伙人数量：</p>
        <p class="main-color fs-23 line-30">{{overview.reseller_count}} 人</p>
      </div>
      <div class="col-sm-3 col-md-3 col-lg-3 left-divider">
        <div class="fs-14 line-30">线下合伙人：{{overview.offline_reseller_count}} 人</div>
        <!-- <div class="fs-14 line-30">线上合伙人：{{overview.online_reseller_count}} 人</div> -->
        <div class="fs-14 line-30">个人合伙人：{{overview.reseller_person_count}} 人</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // badge
      overview: null
    }
  },
  methods: {
    getData () {
      this.$axios.get('/insider/reseller_user/overview/')
        .then(res => {
          console.log('overview', res.data)
          this.overview = res.data
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
.left-divider {
    border-left: 1px solid #DCDFE6;
    padding-left: 40px;
  }
  .has-padding {
    padding: 20px;
    text-align: left;
  }
</style>
