<template>
  <div class="main-col" v-loading="loading">
    <div class="filter-container">
      <el-button style="float: left;" icon="el-icon-back" size="medium" plain @click.stop="goBack">返回</el-button>
      <div style="float: right;" v-can:edit="'Gift'">
        <template v-if="isAdd">
          <el-button type="primary" size="medium" @click="postGift">保存</el-button>
        </template>
        <template v-else-if="isVerify">
          <el-button type="primary" size="medium" @click="verifyGift(0)">不通过</el-button>
          <el-button type="primary" size="medium" @click="verifyGift(1)">通过</el-button>
        </template>
        <template v-else-if="isEdit">
          <el-button type="primary" size="medium" @click="patchGift">保存</el-button>
        </template>
        <template v-else>
          <el-button type="primary" size="medium" @click="isEdit = true">编辑</el-button>
        </template>
      </div>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-form ref="spuForm" :model="model_new" :rules="rules" class="demo-table-expand" label-width="130px" label-position="left">
          <div class="title">基本信息</div>
          <div style=" width: 100%; display: grid; grid-template-columns: repeat( 2, 1fr ); grid-column-gap: 10px;">
            <el-form-item label="锦礼类型" prop="gift_type" v-show="isEdit">
              <el-radio v-model="model_new.gift_type" label="SINGLE">锦礼商品</el-radio>
              <el-radio v-model="model_new.gift_type" label="PACKAGE">锦礼礼包</el-radio>
            </el-form-item>
            <el-form-item label="锦礼类型" v-show="!isEdit">
              <span>{{model.gift_type === 'PACKAGE' ? '锦礼礼包': '锦礼商品'}}</span>
            </el-form-item>
            <el-form-item label="锦礼名称" prop="title" v-show="isEdit">
              <el-input v-model="model_new.title" clearable placeholder="请输入锦礼名称"></el-input>
            </el-form-item>
            <el-form-item label="锦礼名称" v-show="!isEdit">
              <span>{{model.title}}</span>
            </el-form-item>
            <el-form-item label="发起人分成" prop="sponsor_profit" v-show="isEdit">
              <el-input type="number" v-model.number="model_new.sponsor_profit" clearable placeholder="请输入百分比"></el-input>
            </el-form-item>
            <el-form-item label="发起人分成" v-show="!isEdit">
              <span>{{model.sponsor_profit}}%</span>
            </el-form-item>
            <el-form-item label="转发人分成" prop="forwarder_profit" v-show="isEdit">
              <el-input type="number" v-model.number="model_new.forwarder_profit" clearable placeholder="请输入百分比"></el-input>
            </el-form-item>
            <el-form-item label="转发人分成" v-show="!isEdit">
              <span>{{model.forwarder_profit}}%</span>
            </el-form-item>
            <el-form-item label="开奖方式" prop="gift_type" v-show="isEdit">
              <el-radio v-model="model_new.lottery_type" label="PEOPLE">人满开奖</el-radio>
              <el-radio v-model="model_new.lottery_type" label="TIME">到时开奖</el-radio>
            </el-form-item>
            <el-form-item label="开奖方式" v-show="!isEdit">
              <span>{{model.lottery_type === 'TIME' ? '到时开奖': '人满开奖'}}</span>
            </el-form-item>
            <el-form-item label="抽奖有效时间" prop="lottery_valid_period" v-show="isEdit">
              <el-input type="number" v-model.number="model_new.lottery_valid_period" clearable placeholder="请输入抽奖有效时间，单位：分钟（整数）"></el-input>
            </el-form-item>
            <el-form-item label="抽奖有效时间" v-show="!isEdit">
              <span>{{model.lottery_valid_period}}分钟</span>
            </el-form-item>
            <el-form-item label="单次开奖人数" prop="participant_num" v-if="isEdit && model_new.lottery_type !== 'TIME'">
              <el-input type="number" v-model.number="model_new.participant_num" clearable placeholder="请设置单次开奖的人数"></el-input>
            </el-form-item>
            <el-form-item label="单次开奖人数" v-if="!isEdit && model_new.lottery_type !== 'TIME'">
              <span>{{model.participant_num}}</span>
            </el-form-item>
            <el-form-item label="奖品数量" prop="gift_num" v-show="isEdit">
              <el-input type="number" v-model.number="model_new.gift_num" clearable placeholder="请输入奖品数量"></el-input>
            </el-form-item>
            <el-form-item label="奖品数量" v-show="!isEdit">
              <span>{{model.gift_num}}</span>
            </el-form-item>
            <el-form-item label="锦礼价值" prop="gift_value" v-if="isEdit && model_new.gift_type!=='PACKAGE'">
              <el-input type="number" v-model.number="model_new.gift_value" clearable placeholder="请输入锦礼价值"></el-input>
            </el-form-item>
            <el-form-item label="锦礼价值" v-if="!isEdit && model_new.gift_type!=='PACKAGE'">
              <span>{{ model.gift_value | formatPrice }}元</span>
            </el-form-item>
            <el-form-item label="锦礼成本" prop="package_cost" v-if="isEdit && model_new.gift_type==='PACKAGE'">
              <el-input type="number" v-model.number="model_new.package_cost" clearable placeholder="请输入锦礼成本"></el-input>
            </el-form-item>
            <el-form-item label="锦礼成本" v-if="!isEdit && model.gift_type==='PACKAGE'">
              <span>{{ model.package_cost | formatPrice }}元</span>
            </el-form-item>
            <el-form-item label="优惠券有效时间" prop="valid_period" v-if="isEdit && model_new.gift_type==='SINGLE'">
              <el-date-picker
                style="width: 100%;"
                v-model="model_new.valid_period"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="优惠券有效时间" v-if="!isEdit && model.gift_type==='SINGLE'">
              <span>{{formatTime(coupon.valid_start_time)}} 至 {{formatTime(coupon.valid_end_time)}}</span>
            </el-form-item>
            <el-form-item label="优惠券折扣" prop="percent_off" v-if="isEdit && model_new.gift_type==='SINGLE'">
              <el-input type="number" v-model.number="model_new.percent_off" clearable placeholder="请输入百分比"></el-input>
            </el-form-item>
            <el-form-item label="优惠券折扣" v-if="!isEdit && model.gift_type==='SINGLE'">
              <span>{{coupon.percent_off}}%</span>
            </el-form-item>
            <el-form-item label="抽奖说明" prop="description" v-show="isEdit">
              <el-input v-model="model_new.description" type="textarea" :rows="3" placeholder="请输入抽奖说明"></el-input>
            </el-form-item>
            <el-form-item label="抽奖说明" v-show="!isEdit">
              <span>{{model.description}}</span>
            </el-form-item>
          </div>
          <div class="divider"></div>
          <div class="title">锦礼图片</div>
          <el-form-item label-width="0" prop="gift_banner">
            <div>
              <span class="required" v-if="isEdit">*</span>
              <span class="pic-label">锦礼君首页banner：</span>
              <span class="pic-info">（要求尺寸600*500）</span>
            </div>
            <img-single-cropper-upload
              v-if="isEdit"
              ref="gift_banner"
              style="margin-top: 20px"
              :uuid="model_new.uuid"
              root="gift"
              path="gift_banner"
              :widthLimit="600"
              :heightLimit="500"
              accept="png"
              v-model="model_new.gift_banner">
            </img-single-cropper-upload>
            <img-single-upload
              v-else
              style="margin-top: 20px"
              :editable="isEdit"
              v-model="model.gift_banner">
            </img-single-upload>
          </el-form-item>
          <!-- 抽奖页故事图只对锦礼商品必填-->
          <el-form-item label-width="0" prop="graphic_text">
            <div>
              <span class="required" v-if="isEdit">*</span>
              <span class="pic-label">抽奖页故事图：</span>
              <span class="pic-info">（要求宽度750）</span>
            </div>
            <img-list-cropper-upload
              v-if="isEdit"
              ref="graphic_text"
              style="margin-top: 20px"
              :uuid="model_new.uuid"
              root="gift"
              path="graphic_text"
              :widthLimit="750"
              :isHeightTrue="false"
              :limit="6"
              v-model="model_new.graphic_text">
            </img-list-cropper-upload>
            <img-list-upload
              v-else
              style="margin-top: 20px"
              :editable="isEdit"
              v-model="model.graphic_text">
            </img-list-upload>
          </el-form-item>
          <!-- <el-form-item label-width="0" prop="lottery_banner">
            <div>
              <span class="required" v-if="isEdit">*</span>
              <span class="pic-label">抽奖页免单君banner：</span>
              <span class="pic-info">（要求尺寸750*300）</span>
            </div>
            <img-single-cropper-upload
              v-if="isEdit"
              ref="lottery_banner"
              style="margin-top: 20px"
              :uuid="model_new.uuid"
              root="gift"
              path="lottery_banner"
              :widthLimit="750"
              :heightLimit="300"
              accept="png"
              v-model="model_new.lottery_banner">
            </img-single-cropper-upload>
            <img-single-upload
              v-else
              style="margin-top: 20px"
              :editable="isEdit"
              v-model="model.lottery_banner">
            </img-single-upload>
          </el-form-item> -->
          <el-form-item label-width="0" prop="share_card">
            <div>
              <span class="required" v-if="isEdit">*</span>
              <span class="pic-label">小程序分享卡片：</span>
              <span class="pic-info">（要求尺寸380*200）</span>
            </div>
            <img-single-cropper-upload
              v-if="isEdit"
              ref="share_card"
              style="margin-top: 20px"
              :uuid="model_new.uuid"
              root="gift"
              path="share_card"
              :widthLimit="380"
              :heightLimit="200"
              accept="png"
              v-model="model_new.share_card">
            </img-single-cropper-upload>
            <img-single-upload
              v-else
              style="margin-top: 20px"
              :editable="isEdit"
              v-model="model.share_card">
            </img-single-upload>
          </el-form-item>
          <!-- <el-form-item label-width="0" prop="lottery_ad">
            <div>
              <span class="pic-label">抽奖页底部广告图：</span>
              <span class="pic-info">（要求尺寸750*700）</span>
            </div>
            <img-single-cropper-upload
              v-if="isEdit"
              ref="lottery_ad"
              style="margin-top: 20px"
              :uuid="model_new.uuid"
              root="gift"
              path="lottery_ad"
              :widthLimit="750"
              :heightLimit="700"
              accept="png"
              v-model="model_new.lottery_ad">
            </img-single-cropper-upload>
            <img-single-upload
              v-else-if="model_new.lottery_ad"
              style="margin-top: 20px"
              :editable="isEdit"
              v-model="model.lottery_ad">
            </img-single-upload>
            <p v-else>暂无</p>
          </el-form-item> -->
          <!-- <el-form-item label="跳转链接" prop="ad_link" v-show="isEdit">
            <el-input v-model="model_new.ad_link" placeholder="请输入广告图跳转链接"></el-input>
          </el-form-item>
          <el-form-item label="跳转链接" v-show="!isEdit">
            <span>{{model.ad_link}}</span>
          </el-form-item> -->
          <template v-if="!isEdit">
            <div class="divider"></div>
            <div class="title">抽奖信息</div>
            <el-table
              :data="model.lottery"
              tooltip-effect="dark"
              stripe
              style="width: 100%; padding-bottom: 20px">
              <el-table-column
                align="center"
                label="发起人">
                <template slot-scope="scope">{{scope.row.sponsor.wechat_nickname}}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">{{ lottery_status[scope.row.status] }}</template>
              </el-table-column>
              <el-table-column
                prop="joined_num"
                align="center"
                label="参与人数">
              </el-table-column>
              <el-table-column
                align="center"
                label="发起时间">
                <template slot-scope="scope">{{ formatTime(scope.row.start_time) }}</template>
              </el-table-column>
              <el-table-column
                align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click.stop="gotoLottery(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <div class="divider"></div>
          <template v-if="isEdit && model_new.gift_type!=='PACKAGE'">
            <div class="title">锦礼商品</div>
            <el-form-item label-width="0" prop="gift_goods">
              <div v-if="model_new.gift_goods">
                <el-card
                  :body-style="{ padding: '0px' }"
                  style="cursor: pointer; width: 200px"
                  shadow="hover">
                  <div @click="chooseGood">
                    <img :src="model_new.gift_goods ? model_new.gift_goods.sku_pic : ''" class="image" />
                    <!--<div style="padding: 14px; text-align: left">-->
                    <!--<div style="word-break: break-all;">{{ model_new.gift_goods.specification }}</div>-->
                    <!--</div>-->
                  </div>
                </el-card>
              </div>
              <div v-else class="uploader-add-icon-wrapper" @click.stop="chooseGood">
                <i class="el-icon-plus uploader-add-icon"></i>
              </div>
            </el-form-item>
          </template>
          <template v-else-if="!isEdit && model.gift_type!=='PACKAGE'">
            <div class="title">锦礼商品</div>
            <el-card
              :body-style="{ padding: '0px' }"
              style="cursor: pointer; width: 200px"
              shadow="hover">
              <div @click="gotoGiftGood">
                <img :src="model.gift_goods ? model.gift_goods.sku_pic : ''" class="image" />
                <!--<div style="padding: 14px; text-align: left">-->
                <!--<div style="word-break: break-all;">{{ model.gift_goods.specification }}</div>-->
                <!--</div>-->
              </div>
            </el-card>
          </template>
          <template v-else-if="isEdit && model_new.gift_type==='PACKAGE'">
            <div class="title">礼包内容
              <el-button class="add-param" type="default" @click="addParam" icon="el-icon-plus">添加商品</el-button>
            </div>
            <div v-for="(dd, index) in model_new.package_content" :key="index" style="width: 50%; display: inline-block">
              <el-form-item
                :label="'商品 ' + (index + 1)"
                :prop="'package_content.' + index + '.key'"
                :rules="{ required: true, message: '请填写供应商', trigger: 'blur' }"
                style="width: 250px; display: inline-block">
                <el-input style="width: auto" v-model="dd.key" placeholder="请输入供应商"></el-input>
              </el-form-item>
              <el-form-item
                label-width="0"
                :prop="'package_content.' + index + '.value'"
                :rules="{ required: true, message: '请填写商品名称', trigger: 'blur' }"
                style="width: auto; margin-left: 10px; display: inline-block">
                <el-input v-model="dd.value" placeholder="请输入商品名称"></el-input>
              </el-form-item>
              <el-form-item
                label-width="0"
                style="width: auto; margin-left: 10px; display: inline-block"
                v-if="model_new.package_content.length > 1">
                <i class="el-icon-error" @click.prevent="removeParam(dd)" style="color: #aaaaaa;"></i>
              </el-form-item>
            </div>
          </template>
          <template v-else-if="!isEdit && model.gift_type==='PACKAGE'">
            <div class="title">礼包内容</div>
            <el-table
              :data="model.package_content"
              style="width: 100%">
              <el-table-column
                prop="key"
                align="center"
                label="供应商">
              </el-table-column>
              <el-table-column
                prop="value"
                align="center"
                label="商品">
              </el-table-column>
            </el-table>
          </template>
        </el-form>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <div slot="title">
        选择锦礼商品
      </div>
      <div v-if="list && list.length > 0">
        <div class="goods-table" v-loading="goodsLoading">
          <el-card
            :body-style="{ padding: '0px' }"
            v-for="(item, index) in list"
            :key="index"
            style="cursor: pointer"
            shadow="hover">
            <div @click="onChooseGood(item)">
              <img :src="item.sku_pic" class="image" />
              <div style="padding: 14px; text-align: left">
                <div style="word-break: break-all;">{{ item.specification }}</div>
              </div>
            </div>
          </el-card>
        </div>
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
      <template v-else>
        <span>暂无锦礼商品!</span>
        <div slot="footer" style="text-align: right">
          <el-button @click="dialogVisible = false" size="medium">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { deepCopy, formatTime, deformatPrice, dateFormat } from '@/assets/util'
import UUID from 'uuid-js'
import ImgListUpload from '@/components/ImgListUpload'
import ImgListCropperUpload from '@/components/ImgListCropperUpload'
import ImgSingleUpload from '@/components/ImgSingleUpload'
import ImgSingleCropperUpload from '@/components/ImgSingleCropperUpload'
import constants from '@/assets/constants'

export default {
  name: 'GiftDetail',
  components: {
    ImgListUpload,
    ImgSingleUpload,
    ImgSingleCropperUpload,
    ImgListCropperUpload
  },
  data () {
    return {
      loading: false,
      isAdd: false,
      isEdit: false,
      isVerify: false,
      model_new: {
        uuid: '',
        // 类型
        gift_type: 'SINGLE',
        // 商品信息
        title: '',
        sponsor_profit: '',
        forwarder_profit: '',
        // 开奖方式
        lottery_type: 'PEOPLE',
        lottery_valid_period: '',
        participant_num: '',
        gift_num: '',
        gift_value: '',
        description: '',
        // 商品图片
        gift_banner: '',
        graphic_text: [], // 故事图，其实在锦礼礼包中不显示
        // lottery_banner: '', // 这版暂时没有用，隐藏掉
        share_card: '',
        // lottery_ad: '', // 这版暂时没有用，隐藏掉
        // ad_link: '', // 这版暂时没有用，隐藏掉
        gift_goods: '', // 锦礼商品
        // 优惠券
        valid_period: [],
        percent_off: '',
        package_content: [
          {
            key: '',
            value: ''
          },
          {
            key: '',
            value: ''
          }
        ]
      },
      model: {},
      coupon: {},
      rules: {
        title: [
          { required: true, message: '请输入锦礼名称', trigger: 'blur' }
        ],
        sponsor_profit: [
          { required: true, message: '请输入发起人分成', trigger: 'blur' }
        ],
        forwarder_profit: [
          { required: true, message: '请输入转发人分成', trigger: 'blur' }
        ],
        lottery_valid_period: [
          { required: true, message: '请输入抽奖有效时间称', trigger: 'blur' }
        ],
        participant_num: [
          { required: true, message: '请输入单次开奖人数', trigger: 'blur' },
          { type: 'number', min: 2, message: '单次开奖人数至少为2', trigger: 'blur' }
        ],
        gift_num: [
          { required: true, message: '请输入奖品数量', trigger: 'blur' }
        ],
        gift_value: [
          { required: true, message: '请输入锦礼价值', trigger: 'blur' }
        ],
        package_cost: [
          { required: true, message: '请输入锦礼成本', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入抽奖说明', trigger: 'blur' }
        ],
        gift_banner: [
          { required: true, message: '请上传锦礼君首页banner', trigger: 'blur' }
        ],
        graphic_text: [
          { required: true, message: '请上传抽奖页故事图', trigger: 'blur' }
        ],
        // lottery_banner: [
        //   { required: true, message: '请上传抽奖页免单君banner', trigger: 'blur' }
        // ],
        share_card: [
          { required: true, message: '请上传小程序分享卡片', trigger: 'blur' }
        ],
        // lottery_ad: [
        //   { required: true, message: '请上传抽奖页底部广告图', trigger: 'blur' }
        // ],
        // ad_link: [
        //   { required: true, message: '请输入广告图跳转链接', trigger: 'blur' }
        // ],
        gift_goods: [
          { required: true, message: '请选择锦礼商品', trigger: 'blur' }
        ],
        percent_off: [
          { required: true, message: '请输入优惠券折扣', trigger: 'blur' }
        ],
        valid_period: [
          { required: true, message: '请选择优惠券有效时间', trigger: 'blur' }
        ]
      },
      lottery_status: constants.LOTTERY_STATUS,
      // choose good
      dialogVisible: false,
      goodsLoading: false,
      list: [],
      pageSize: 20,
      currentPage: -1,
      totalCnt: 0
    }
  },
  props: {
    id: {
      type: String
    }
  },
  methods: {
    formatTime,
    goBack () {
      if (this.isEdit && !this.isVerify && !this.isAdd) {
        this.isEdit = false
      } else if (this.isAdd) {
        this.$router.go(-1)
      } else {
        window.open('javascript:window.open("", "_self", "");window.close();', '_self')
      }
    },
    addParam () {
      this.model_new.package_content.push({
        key: '',
        value: ''
      })
    },
    removeParam (item) {
      this.$confirm('确认删除此礼包商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        var index = this.model_new.package_content.indexOf(item)
        if (index !== -1) {
          this.model_new.package_content.splice(index, 1)
        }
      })
    },
    getDetail () {
      let that = this
      this.loading = true
      this.$axios.get('/gift_insider/gift/' + this.id + '/')
        .then(res => {
          console.log(res.data)
          that.model = res.data
          // 此处不要用 deepcopy！
          that.model_new.gift_type = that.model.gift_type
          that.model_new.uuid = that.model.uuid
          that.model_new.title = that.model.title
          that.model_new.sponsor_profit = that.model.sponsor_profit
          that.model_new.forwarder_profit = that.model.forwarder_profit
          that.model_new.lottery_type = that.model.lottery_type
          that.model_new.lottery_valid_period = that.model.lottery_valid_period
          that.model_new.participant_num = that.model.participant_num
          that.model_new.gift_num = that.model.gift_num
          that.model_new.description = that.model.description

          that.model_new.gift_banner = that.model.gift_banner
          that.model_new.graphic_text = that.model.graphic_text
          // that.model_new.lottery_banner = that.model.lottery_banner
          that.model_new.share_card = that.model.share_card
          // that.model_new.lottery_ad = that.model.lottery_ad
          // that.model_new.ad_link = that.model.ad_link

          // 锦礼商品特有字段
          if (that.model.gift_type !== 'PACKAGE') {
            that.model_new.gift_value = that.model.gift_value / 100 // 锦礼价值
            that.model_new.gift_goods = that.model.gift_goods
            that.getCoupon()
          } else {
          // 锦礼礼包特有字段
            that.model_new.package_cost = that.model.package_cost / 100 // 锦礼成本
            let tmpParas = deepCopy(that.model.package_content)
            that.model.package_content = []
            for (let key in tmpParas) {
              that.model.package_content.push({
                key: key,
                value: tmpParas[key]
              })
            }
            that.model_new.package_content = that.model.package_content
          }
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          that.loading = false
        })
    },
    getCoupon () {
      let that = this
      this.$axios.get('/gift_insider/gift_gift_goods_coupon/?gift=' + this.id)
        .then(res => {
          if (res.data.results && res.data.results.length > 0) {
            that.coupon = res.data.results[0]
            that.model_new.valid_period = [new Date(that.coupon.valid_start_time), new Date(that.coupon.valid_end_time)]
            that.model_new.percent_off = that.coupon.percent_off
          }
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          that.loading = false
        })
    },
    patchGift () {
      let that = this
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          that.loading = true
          that.$axios.patch('/gift_insider/gift/' + that.id + '/', that.encodeForm(that.model_new))
            .then(res => {
              console.log(res.data)
              that.confirmPicChanges()
              if (that.model_new.gift_type !== 'PACKAGE') {
                if (that.coupon.id) {
                  that.patchCoupon(that.coupon.id)
                } else {
                  that.postCoupon(that.id)
                }
              } else {
                that.$message.success('修改成功')
                that.isEdit = false
                that.getDetail()
              }
            })
            .catch(error => {
              console.log(error)
              that.loading = false
            })
        } else {
          that.$message.error('请填写所有项目')
        }
      })
    },
    patchCoupon (id) {
      let that = this
      this.$axios.patch('/gift_insider/gift_gift_goods_coupon/' + id + '/', {
        valid_start_time: dateFormat(that.model_new.valid_period[0], 'yyyy-MM-ddThh:mm:ss'),
        valid_end_time: dateFormat(that.model_new.valid_period[1], 'yyyy-MM-ddThh:mm:ss'),
        percent_off: that.model_new.percent_off
      })
        .then(res => {
          that.isAdd = false
          that.isEdit = false
          that.isVerify = false
          that.getDetail()
        })
        .catch(error => {
          console.log(error)
          that.loading = false
        })
    },
    postGift () {
      let that = this
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          that.loading = true
          that.$axios.post('/gift_insider/gift/', that.encodeForm(that.model_new))
            .then(res => {
              console.log(res.data)
              that.confirmPicChanges()
              if (that.model_new.gift_type !== 'PACKAGE') {
                that.postCoupon(res.data.id)
              }
              this.goBack()
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              that.loading = false
            })
        } else {
          that.$message.error('请填写所有项目')
        }
      })
    },
    postCoupon (giftId) {
      let that = this
      this.$axios.post('/gift_insider/gift_gift_goods_coupon/', {
        gift: giftId,
        valid_start_time: dateFormat(that.model_new.valid_period[0], 'yyyy-MM-ddThh:mm:ss'),
        valid_end_time: dateFormat(that.model_new.valid_period[1], 'yyyy-MM-ddThh:mm:ss'),
        percent_off: that.model_new.percent_off
      })
        .then(res => {
          that.$router.replace('/gift/detail/' + giftId)
          that.id = giftId
          that.isAdd = false
          that.isEdit = false
          that.isVerify = false
          that.getDetail()
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          that.loading = false
        })
    },
    verifyGift (action) {
      if (action === 1) {
        this.doVerifyGift(1, null)
      } else {
        this.$prompt('请填写原因', '审核不通过', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          inputType: 'textarea',
          inputValidator: item => {
            return item !== null
          },
          inputErrorMessage: '请填写审核不通过原因'
        }).then(({ value }) => {
          this.doVerifyGift(0, value)
        })
      }
    },
    doVerifyGift (action, reason) {
      let that = this
      this.$refs.spuForm.validate((valid) => {
        if (valid) {
          that.loading = true
          let data = {
            gift: that.id,
            action: action,
            gift_data: that.encodeForm(that.model_new)
          }
          if (reason) {
            data.reason = reason
          }
          that.$axios.post('/gift_insider/gift_verification/', data)
            .then(res => {
              that.confirmPicChanges()
              if (that.coupon.id) {
                that.patchCoupon(that.coupon.id)
              } else {
                that.postCoupon(that.id)
              }
            })
            .catch(error => {
              console.log(error)
              that.loading = false
            })
        } else {
          that.$message.error('请填写所有项目')
        }
      })
    },
    encodeForm (form) {
      let tmpForm = deepCopy(form)
      tmpForm.gift_value = deformatPrice(tmpForm.gift_value)
      if (tmpForm.gift_type === 'PACKAGE') {
        tmpForm.package_cost = deformatPrice(tmpForm.package_cost)
        let tmpParas = deepCopy(form.package_content)
        tmpForm.package_content = {}
        for (let index in tmpParas) {
          tmpForm.package_content[tmpParas[index].key] = tmpParas[index].value
        }
      } else {
        tmpForm.gift_goods = tmpForm.gift_goods.id
      }
      if (tmpForm.lottery_type === 'TIME') {
        tmpForm.participant_num = 0
      }
      console.log('encode', tmpForm)
      return tmpForm
    },
    confirmPicChanges () {
      this.$refs.gift_banner.confirmChanges()
      this.$refs.graphic_text.confirmChanges()
      // this.$refs.lottery_banner.confirmChanges()
      this.$refs.share_card.confirmChanges()
      // this.$refs.lottery_ad.confirmChanges()
    },
    gotoLottery (item) {
      this.$router.push('/gift/lottery/' + item.id)
    },
    // gift
    chooseGood () {
      this.handleCurrentChange(1)
      this.dialogVisible = true
    },
    query () {
      let that = this
      that.goodsLoading = true
      this.$axios.get('/gift_insider/gift_goods/?shelf_status=ON&page_num=' + this.currentPage + '&page_size=' + this.pageSize)
        .then(res => {
          that.totalCnt = res.data.count
          that.list = res.data.results
        })
        .finally(() => {
          that.goodsLoading = false
        })
    },
    handleCurrentChange (currentPage) {
      if (this.currentPage !== currentPage) {
        this.currentPage = currentPage
        this.query()
      }
    },
    onChooseGood (item) {
      let that = this
      this.$confirm('确定选择' + item.specification + '吗', '锦礼商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.model_new.gift_goods = item
        that.dialogVisible = false
      }).catch(() => {})
    },
    gotoGiftGood () {
      if (this.model.gift_goods) {
        this.$router.push('/gift/goods/detail/' + this.model.gift_goods.id)
      }
    }
  },
  created () {
    if (this.$route.path === '/gift/add') {
      this.isAdd = true
      this.isEdit = true
      this.model_new.uuid = UUID.create(1).hex
    } else {
      if (this.$route.query.verify) {
        this.isVerify = true
        this.isEdit = true
      } else if (this.$route.query.edit) {
        this.isEdit = true
      }
      this.getDetail()
    }
  }
}
</script>

<style scoped>
  .filter-container {
    padding: 12px;
  }
  .demo-table-expand {
    margin: 0 20px 20px;
    font-size: 0;
    text-align: left;
  }
  .card-container {
    position: relative;
  }
  .divider {
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
    background-color: #efeded;
  }
  .title {
    font-size: 20px;
    /*font-weight: bold;*/
    text-align: left;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .divider + .title {
    margin-top: 40px;
  }
  .demo-table-expand label {
    /*width: 90px;*/
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    padding-bottom: 20px;
  }
  .pic-label {
    /*font-weight: bold;*/
  }
  .pic-info {
    color: #9b9b9b;
  }
  .uploader-add-icon-wrapper {
    position: relative;
    height: 200px;
    width: 200px;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 6px;
    cursor: pointer;
  }
  .uploader-add-icon-wrapper:hover {
    border-color: #f26250;
  }
  .uploader-add-icon {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 28px;
    height: 28px;
    font-size: 28px;
    color: #8c939d;
    overflow: hidden;
    margin: auto;
  }
  .goods-table {
    width: 100%;
    display: grid;
    grid-template-columns: repeat( auto-fill, minmax(200px, 1fr) );
    grid-gap: 10px;
  }
  .image {
    width: 100%;
  }
</style>
