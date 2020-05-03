<template>
  <div v-loading="loading" class="main-col">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
    </div>
    <div class="card-outer" v-if="model">
      <div class="title">抽奖信息</div>
      <div class="card-container">
        <el-form inline class="demo-table-expand" label-width="120px" label-position="left">
          <el-form-item label="奖品名称">
            <span>{{model.gift_title}}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{status[model.status]}}</span>
          </el-form-item>
          <el-form-item label="发起人">
            <span>{{model.sponsor ? model.sponsor.wechat_nickname : ''}}</span>
          </el-form-item>
          <el-form-item label="参与抽奖人数">
            <span>{{model.joined_num}}</span>
          </el-form-item>
          <el-form-item label="单次开奖人数">
            <span>{{model.participant_num}}</span>
          </el-form-item>
          <el-form-item label="开奖时间">
            <span>{{model.lottery_type === "TIME"? formatTimeNew(model.created_at,model.valid_period):formatTime(model.end_at)}}</span>
            <!--<span>{{formatTime(model.end_at)}}</span>-->
          </el-form-item>
          <el-form-item label="发起时间">
            <span>{{formatTime(model.created_at)}}</span>
          </el-form-item>
          <el-form-item label="转发人数">
            <span>{{model.forward_num}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="title">中奖信息
        <el-button class="relottery" type="default" @click="reLottery" v-can:edit="'Gift'">重新抽奖</el-button>
      </div>
      <div class="card-container">
        <el-table
          stripe
          :data="winnerList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            label="中奖信息">
            <span slot-scope="scope">{{ winner_status[scope.row.type] }}</span>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户ID">
            <span slot-scope="scope">{{ scope.row.winner ? scope.row.winner.id : ''}}</span>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户昵称">
            <span slot-scope="scope">{{ scope.row.winner ? scope.row.winner.wechat_nickname : ''}}</span>
          </el-table-column>
          <el-table-column
            align="center"
            label="收货人姓名">
            <span slot-scope="scope">{{ scope.row.receiver_name ? scope.row.receiver_name : '未填写'}}</span>
          </el-table-column>
          <el-table-column
            align="center"
            label="手机号码">
            <span slot-scope="scope">{{ scope.row.receiver_tel ? scope.row.receiver_tel : '未填写'}}</span>
          </el-table-column>
          <el-table-column
            align="center"
            label="收货地址">
            <span slot-scope="scope">{{ scope.row.receiver_area ? `${scope.row.receiver_area} ${scope.row.receiver_address}` : '未填写' }}</span>
          </el-table-column>
          <el-table-column
            align="center"
            label="快递单号">
            <span slot-scope="scope">{{ scope.row.logistic_code ?  `${scope.row.logistic_code}` : '未填写' }}</span>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope" v-if="scope.row.type === 'VALID'">
              <el-button type="default" v-can:edit="'Gift'" @click="grantGood(scope.row)">派奖</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        title="派奖"
        :visible.sync="dialogVisible"
        width="30%"
        center>
        <el-form ref="shipmentForm" :model="shipmentForm" :rules="rules" label-width="80px" size="small">
          <el-form-item label="快递公司" prop="name">
            <el-select v-model="shipmentForm.name" filterable placeholder="请选择">
              <el-option
                v-for="(item, j) in express"
                :key="j"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="logistic_code">
            <el-input v-model="shipmentForm.logistic_code"></el-input>
          </el-form-item>
          <div style="text-align: center;">
            <el-button type="primary" @click="shipGoods" size="medium">提交</el-button>
            <el-button @click="dialogVisible = false" size="medium">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
      <template v-if="model.gift_type === 'PACKAGE'">
        <div class="title">往期中奖信息</div>
        <div class="card-container">
          <el-table
            stripe
            :data="formerWinnerList"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              align="center"
              label="期数">
              <span slot-scope="scope">第{{ scope.$index + 1 }}期</span>
            </el-table-column>
            <el-table-column
              align="center"
              label="抽奖ID">
              <span slot-scope="scope">{{ scope.row.gift_lottery.id }}</span>
            </el-table-column>
            <el-table-column
              align="center"
              label="中奖人ID">
              <span slot-scope="scope">{{ scope.row.winner ? scope.row.winner.id : ''}}</span>
            </el-table-column>
            <el-table-column
              align="center"
              label="中奖人姓名">
              <span slot-scope="scope">{{ scope.row.receiver_name ? scope.row.receiver_name : '未填写'}}</span>
            </el-table-column>
            <el-table-column
              align="center"
              label="手机号码">
              <span slot-scope="scope">{{ scope.row.receiver_tel ? scope.row.receiver_tel : '未填写'}}</span>
            </el-table-column>
            <el-table-column
              align="center"
              label="开奖时间">
              <span slot-scope="scope">{{ formatTime(scope.row.gift_lottery.end_at) }}</span>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <div class="title">转发信息</div>
      <div class="card-container">
        <el-table
          stripe
          :data="forwardList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            label="用户ID">
            <span slot-scope="scope">{{ scope.row.customer ? scope.row.customer.id : '' }}</span>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户昵称">
            <span slot-scope="scope">{{ scope.row.customer ? scope.row.customer.wechat_nickname : '' }}</span>
          </el-table-column>
          <el-table-column
            align="center"
            prop="forward_user_num"
            label="转发次数">
          </el-table-column>
          <el-table-column
            align="center"
            prop="participant_user_num"
            label="传播用户">
          </el-table-column>
          <el-table-column
            align="center"
            prop="sku_num"
            label="带来销量">
          </el-table-column>
          <el-table-column
            align="center"
            label="转发分成">
            <span slot-scope="scope">{{ formatPrice(scope.row.forward_profit_amount) }}</span>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="userList && userList.length > 0">
        <div class="title">参与用户</div>
        <div class="card-container">
          <div class="user-avatar-wrapper">
            <img
              class="user-avatar"
              v-for="(item, index) in userList"
              :key="index"
              :src="item.customer.wechat_avatar_url">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime, formatPrice, formatTimeNew } from '@/assets/util'
import Express from '%/express.json'
import constants from '@/assets/constants'
export default {
  name: 'LotteryDetail',
  data () {
    return {
      dialogVisible: false,
      shipmentForm: {
        name: '',
        logistic_code: ''
      },
      rules: {
        name: [
          {required: true, message: '请选择快递公司', triangle: 'blur'}
        ],
        logistic_code: [
          {required: true, message: '请输入快递单号', triangle: 'blur'}
        ]
      },
      shipItem: '',
      express: Express,
      loading: false,
      model: {},
      winnerList: [],
      forwardList: [],
      userList: [],
      formerWinnerList: [],
      status: constants.LOTTERY_STATUS,
      winner_status: constants.WINNER_STATUS
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    formatTime,
    formatTimeNew,
    formatPrice,
    goBack () {
      window.open('javascript:window.open("", "_self", "");window.close();', '_self')
    },
    getData () {
      let that = this
      this.loading = true
      this.$axios.get('/gift_insider/lottery/' + this.id + '/')
        .then(res => {
          console.log(res.data)
          that.model = res.data
          that.forwardList = res.data.forward_log
          that.$axios.get('/gift_insider/lottery/' + res.data.gift + '/before_gift_user/')
            .then(res => {
              that.formerWinnerList = res.data
            })
        })
        .finally(() => {
          that.loading = false
        })
      this.$axios.get('/gift_insider/lottery/' + this.id + '/customer_user/')
        .then(res => {
          that.userList = res.data
        })
      this.$axios.get('/gift_insider/gift_winner/?gift_lottery=' + this.id)
        .then(res => {
          that.winnerList = res.data.results.reverse()
        })
    },
    grantGood (item) {
      console.log(item)
      this.shipItem = item.id
      this.dialogVisible = true
      this.shipmentForm.name = ''
      this.shipmentForm.logistic_code = ''
    },
    shipGoods () {
      this.$refs.shipmentForm.validate((valid) => {
        if (valid) {
          this.$axios.post('/gift_insider/lottery/gift_delivery/', {
            lottery: parseInt(this.id),
            winner: this.shipItem,
            name: this.shipmentForm.name,
            logistic_code: this.shipmentForm.logistic_code
          }).then(() => {
            this.$message.success('派奖成功')
            this.getData()
            this.dialogVisible = false
          }).catch(() => {
            this.$message.error('派奖失败')
          })
        } else {
          this.$message.error('请填写快递信息')
        }
      })
    },
    reLottery () {
      const that = this
      this.$prompt('重新抽奖原因', '重新抽奖', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        that.$axios.post('/gift_insider/lottery/relottery/', {
          lottery: parseInt(that.id),
          reason: value
        }).then(() => {
          that.$message.success('重新抽奖成功')
          that.getData()
        }).catch(() => {
          that.$message.error('重新抽奖失败')
        })
      }).catch(() => {})
    },
    printscope (scope) {
      console.log(scope)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>

  .filter-container {
    padding: 12px;
  }
  .card-container {
    padding: 20px;
    margin: 0 20px 20px 20px;
  }
  .demo-table-expand {
    display: grid;
    grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
    grid-column-gap: 10px;
  }
  @media (min-width: 1350px) {
    .demo-table-expand {
      grid-template-columns: repeat( 4, 1fr );
    }
  }
  .demo-table-expand .el-form-item {
    margin-bottom: 0;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    margin: 20px 20px 10px 40px;
  }
  .user-avatar-wrapper {
    display: grid;
    grid-template-columns: repeat( auto-fill, 50px );
    grid-gap: 10px;
  }
  .user-avatar {
    width: 50px;
    height: 50px;
  }
  .relottery {
    margin-left: 20px;
  }
</style>
