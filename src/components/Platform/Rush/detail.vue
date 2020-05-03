<template>
  <div class="main-col">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;">
        <el-button class="blue_button_filled" size="medium" v-if="form.spu_id" @click="goSpu">编辑SPU</el-button>
        <el-button class="blue_button_filled" size="medium" v-if="form.id" @click="goEdit">编辑抢购商品</el-button>
      </div>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-form class="demo-table-expand" label-width="120px" label-position="left">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品 SPU 编号" prop="spu_id">
                {{ form.spu_id }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品 SKU 编号" prop="sku_id">
                {{ form.sku_id }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="抢购时间段" prop=“time”>
                {{ form.time && form.time.start_at }} - {{ form.time && form.time.end_at }}
                (主页 {{ form.time && form.time.homepage }})
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抢购数量" prop=“rush_number”>
                {{ form.rush_number }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抢购价格" prop=“rush_price”>
                {{ form.rush_price | formatPrice }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="赠送免单金" prop=“rush_offpay_limit”>
                {{ form.rush_offpay_limit | formatPrice }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                {{ statuses[form.status] }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <spu :spu="form.spu_id" :sku="form.sku_id" v-if="form.spu_id"></spu>
    </div>
  </div>
</template>

<script>
import SPUDetail from './spu'
import constants from '@/assets/constants'

export default {
  components: {
    spu: SPUDetail
  },
  props: ['id'],
  data () {
    return {
      form: {},
      statuses: constants.DISCOUNT_STATUS
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    time () {
      return this.times.find(item => item.id === this.form.time) || {}
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    goEdit () {
      this.$router.push('/platform/rush/' + this.id + '/edit')
    },
    goSpu () {
      window.open(window.location.origin + '/#/goods/detail/' + this.form.spu_id)
    },
    getData () {
      this.$axios.get(`/insider/goods_rush/${this.id}/`)
        .then(res => {
          this.form = res.data
        })
    }
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .el-input {
    width: 200px;
  }
  .demo-table-expand {
    padding: 20px;
  }
</style>
