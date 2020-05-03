const GOODS_TYPE = {
  ONLINE: '线上商品',
  LIFE: '免单生活',
  SICORDER: '怡亚通商品'
}

const SHELF_STATUS = {
  'DRAFT': '草稿',
  'VERIFY': '审核中',
  'MODIFY': '待修改',
  'PRE_ON': '待上架',
  'ON': '上架',
  'OFF': '下架'
}

const GIFT_STATUS = {
  DRAFT: '草稿',
  VERIFY: '审核中',
  MODIFY: '待修改',
  PRE_ON: '待发布',
  ON: '已发布',
  OFF: '暂停中',
  FINISH: '已结束'
}

const RESELLER_STATUS = {
  'AUDITED': '入驻成功',
  'UNAUDITED': '未审核',
  'AUDIT_FAILED': '废弃'
}

const WITHDRAW_STATUS = {
  CANCELED: '已取消',
  CREATED: '已发起',
  DEALING: '提现中',
  TRANSFERRED: '已到账'
}

const LOTTERY_STATUS = {
  PRE: '待开奖',
  FINISH: '已结束',
  DELIVERY: '已派奖',
  EXPIRE: '已过期'
}

const WINNER_STATUS = {
  VALID: '中奖',
  INVALID: '已失效'
}

const ORDER_STATUS = {
  UNPAID_UNFILLED: '待付款',
  PAID_UNFILLED: '待填写地址',
  UNSHIPPED: '待发货',
  SHIPPING: '已发货',
  FINISHED: '已完成',
  CLOSED: '已关闭',
  CANCELED: '已取消'
}

const SCENE_STATUS = {
  'UNAUDITED': '正在审核',
  'AUDITED': '入驻成功',
  'AUDIT_FAILED': '入驻失败'
}

const AFTERSALE_STATUS = {
  ADMIN_CONFIRMING: '等待平台审核',
  SUPPLIER_CONFIRMING: '等待商家审核',
  CANCELED: '已取消',
  CUSTOMER_UNSHIPPED: '买家未发货',
  CUSTOMER_SHIPPING: '商家待收货',
  FINISHED: '服务结束'
}

const DISCOUNT_STATUS = {
  'PRE': '已上架',
  'MARCH': '已上架',
  'FINISH': '已结束',
  'CANCEL': '已下架'
}

const PROVINCE = [
  {
    'key': '北京市',
    'en': 'Beijing',
    'value': '11'
  },
  {
    'key': '天津市',
    'en': 'Tianjin',
    'value': '12'
  },
  {
    'key': '河北省',
    'en': 'Hebei',
    'value': '13'
  },
  {
    'key': '山西省',
    'value': '14'
  },
  {
    'key': '内蒙古自治区',
    'value': '15'
  },
  {
    'key': '辽宁省',
    'value': '21'
  },
  {
    'key': '吉林省',
    'value': '22'
  },
  {
    'key': '黑龙江省',
    'value': '23'
  },
  {
    'key': '上海市',
    'en': 'Shanghai',
    'value': '31'
  },
  {
    'key': '江苏省',
    'value': '32'
  },
  {
    'key': '浙江省',
    'value': '33'
  },
  {
    'key': '安徽省',
    'value': '34'
  },
  {
    'key': '福建省',
    'value': '35'
  },
  {
    'key': '江西省',
    'value': '36'
  },
  {
    'key': '山东省',
    'value': '37'
  },
  {
    'key': '河南省',
    'value': '41'
  },
  {
    'key': '湖北省',
    'value': '42'
  },
  {
    'key': '湖南省',
    'value': '43'
  },
  {
    'key': '广东省',
    'en': 'Guangdong',
    'value': '44'
  },
  {
    'key': '广西壮族自治区',
    'value': '45'
  },
  {
    'key': '海南省',
    'value': '46'
  },
  {
    'key': '重庆市',
    'value': '50'
  },
  {
    'key': '四川省',
    'value': '51'
  },
  {
    'key': '贵州省',
    'value': '52'
  },
  {
    'key': '云南省',
    'value': '53'
  },
  {
    'key': '西藏自治区',
    'value': '54'
  },
  {
    'key': '陕西省',
    'value': '61'
  },
  {
    'key': '甘肃省',
    'value': '62'
  },
  {
    'key': '青海省',
    'value': '63'
  },
  {
    'key': '宁夏回族自治区',
    'value': '64'
  },
  {
    'key': '新疆维吾尔自治区',
    'value': '65'
  },
  {
    'key': '台湾省',
    'value': '71'
  },
  {
    'key': '香港特别行政区',
    'value': '81'
  },
  {
    'key': '澳门特别行政区',
    'value': '82'
  }
]

const CITY = [
  {
    'key': '北京市',
    'value': [
      {
        'key': '市辖区',
        'value': '01'
      }
    ]
  },
  {
    'key': '天津市',
    'value': [
      {
        'key': '市辖区',
        'value': '01'
      }
    ]
  },
  {
    'key': '河北省',
    'value': [
      {
        'key': '石家庄市',
        'value': '01'
      },
      {
        'key': '唐山市',
        'value': '02'
      },
      {
        'key': '秦皇岛市',
        'value': '03'
      },
      {
        'key': '邯郸市',
        'value': '04'
      },
      {
        'key': '邢台市',
        'value': '05'
      },
      {
        'key': '保定市',
        'value': '06'
      },
      {
        'key': '张家口市',
        'value': '07'
      },
      {
        'key': '承德市',
        'value': '08'
      },
      {
        'key': '沧州市',
        'value': '09'
      },
      {
        'key': '廊坊市',
        'value': '10'
      },
      {
        'key': '衡水市',
        'value': '11'
      },
      {
        'key': '省直辖县级行政区划',
        'value': '90'
      }
    ]
  },
  {
    'key': '山西省',
    'value': [
      {
        'key': '太原市',
        'value': '01'
      },
      {
        'key': '大同市',
        'value': '02'
      },
      {
        'key': '阳泉市',
        'value': '03'
      },
      {
        'key': '长治市',
        'value': '04'
      },
      {
        'key': '晋城市',
        'value': '05'
      },
      {
        'key': '朔州市',
        'value': '06'
      },
      {
        'key': '晋中市',
        'value': '07'
      },
      {
        'key': '运城市',
        'value': '08'
      },
      {
        'key': '忻州市',
        'value': '09'
      },
      {
        'key': '临汾市',
        'value': '10'
      },
      {
        'key': '吕梁市',
        'value': '11'
      }
    ]
  },
  {
    'key': '内蒙古自治区',
    'value': [
      {
        'key': '呼和浩特市',
        'value': '01'
      },
      {
        'key': '包头市',
        'value': '02'
      },
      {
        'key': '乌海市',
        'value': '03'
      },
      {
        'key': '赤峰市',
        'value': '04'
      },
      {
        'key': '通辽市',
        'value': '05'
      },
      {
        'key': '鄂尔多斯市',
        'value': '06'
      },
      {
        'key': '呼伦贝尔市',
        'value': '07'
      },
      {
        'key': '巴彦淖尔市',
        'value': '08'
      },
      {
        'key': '乌兰察布市',
        'value': '09'
      },
      {
        'key': '兴安盟',
        'value': '22'
      },
      {
        'key': '锡林郭勒盟',
        'value': '25'
      },
      {
        'key': '阿拉善盟',
        'value': '29'
      }
    ]
  },
  {
    'key': '辽宁省',
    'value': [
      {
        'key': '沈阳市',
        'value': '01'
      },
      {
        'key': '大连市',
        'value': '02'
      },
      {
        'key': '鞍山市',
        'value': '03'
      },
      {
        'key': '抚顺市',
        'value': '04'
      },
      {
        'key': '本溪市',
        'value': '05'
      },
      {
        'key': '丹东市',
        'value': '06'
      },
      {
        'key': '锦州市',
        'value': '07'
      },
      {
        'key': '营口市',
        'value': '08'
      },
      {
        'key': '阜新市',
        'value': '09'
      },
      {
        'key': '辽阳市',
        'value': '10'
      },
      {
        'key': '盘锦市',
        'value': '11'
      },
      {
        'key': '铁岭市',
        'value': '12'
      },
      {
        'key': '朝阳市',
        'value': '13'
      },
      {
        'key': '葫芦岛市',
        'value': '14'
      }
    ]
  },
  {
    'key': '吉林省',
    'value': [
      {
        'key': '长春市',
        'value': '01'
      },
      {
        'key': '吉林市',
        'value': '02'
      },
      {
        'key': '四平市',
        'value': '03'
      },
      {
        'key': '辽源市',
        'value': '04'
      },
      {
        'key': '通化市',
        'value': '05'
      },
      {
        'key': '白山市',
        'value': '06'
      },
      {
        'key': '松原市',
        'value': '07'
      },
      {
        'key': '白城市',
        'value': '08'
      },
      {
        'key': '延边朝鲜族自治州',
        'value': '24'
      }
    ]
  },
  {
    'key': '黑龙江省',
    'value': [
      {
        'key': '哈尔滨市',
        'value': '01'
      },
      {
        'key': '齐齐哈尔市',
        'value': '02'
      },
      {
        'key': '鸡西市',
        'value': '03'
      },
      {
        'key': '鹤岗市',
        'value': '04'
      },
      {
        'key': '双鸭山市',
        'value': '05'
      },
      {
        'key': '大庆市',
        'value': '06'
      },
      {
        'key': '伊春市',
        'value': '07'
      },
      {
        'key': '佳木斯市',
        'value': '08'
      },
      {
        'key': '七台河市',
        'value': '09'
      },
      {
        'key': '牡丹江市',
        'value': '10'
      },
      {
        'key': '黑河市',
        'value': '11'
      },
      {
        'key': '绥化市',
        'value': '12'
      },
      {
        'key': '大兴安岭地区',
        'value': '27'
      }
    ]
  },
  {
    'key': '上海市',
    'value': [
      {
        'key': '市辖区',
        'value': '01'
      }
    ]
  },
  {
    'key': '江苏省',
    'value': [
      {
        'key': '南京市',
        'value': '01'
      },
      {
        'key': '无锡市',
        'value': '02'
      },
      {
        'key': '徐州市',
        'value': '03'
      },
      {
        'key': '常州市',
        'value': '04'
      },
      {
        'key': '苏州市',
        'value': '05'
      },
      {
        'key': '南通市',
        'value': '06'
      },
      {
        'key': '连云港市',
        'value': '07'
      },
      {
        'key': '淮安市',
        'value': '08'
      },
      {
        'key': '盐城市',
        'value': '09'
      },
      {
        'key': '扬州市',
        'value': '10'
      },
      {
        'key': '镇江市',
        'value': '11'
      },
      {
        'key': '泰州市',
        'value': '12'
      },
      {
        'key': '宿迁市',
        'value': '13'
      }
    ]
  },
  {
    'key': '浙江省',
    'value': [
      {
        'key': '杭州市',
        'value': '01'
      },
      {
        'key': '宁波市',
        'value': '02'
      },
      {
        'key': '温州市',
        'value': '03'
      },
      {
        'key': '嘉兴市',
        'value': '04'
      },
      {
        'key': '湖州市',
        'value': '05'
      },
      {
        'key': '绍兴市',
        'value': '06'
      },
      {
        'key': '金华市',
        'value': '07'
      },
      {
        'key': '衢州市',
        'value': '08'
      },
      {
        'key': '舟山市',
        'value': '09'
      },
      {
        'key': '台州市',
        'value': '10'
      },
      {
        'key': '丽水市',
        'value': '11'
      }
    ]
  },
  {
    'key': '安徽省',
    'value': [
      {
        'key': '合肥市',
        'value': '01'
      },
      {
        'key': '芜湖市',
        'value': '02'
      },
      {
        'key': '蚌埠市',
        'value': '03'
      },
      {
        'key': '淮南市',
        'value': '04'
      },
      {
        'key': '马鞍山市',
        'value': '05'
      },
      {
        'key': '淮北市',
        'value': '06'
      },
      {
        'key': '铜陵市',
        'value': '07'
      },
      {
        'key': '安庆市',
        'value': '08'
      },
      {
        'key': '黄山市',
        'value': '10'
      },
      {
        'key': '滁州市',
        'value': '11'
      },
      {
        'key': '阜阳市',
        'value': '12'
      },
      {
        'key': '宿州市',
        'value': '13'
      },
      {
        'key': '六安市',
        'value': '15'
      },
      {
        'key': '亳州市',
        'value': '16'
      },
      {
        'key': '池州市',
        'value': '17'
      },
      {
        'key': '宣城市',
        'value': '18'
      }
    ]
  },
  {
    'key': '福建省',
    'value': [
      {
        'key': '福州市',
        'value': '01'
      },
      {
        'key': '厦门市',
        'value': '02'
      },
      {
        'key': '莆田市',
        'value': '03'
      },
      {
        'key': '三明市',
        'value': '04'
      },
      {
        'key': '泉州市',
        'value': '05'
      },
      {
        'key': '漳州市',
        'value': '06'
      },
      {
        'key': '南平市',
        'value': '07'
      },
      {
        'key': '龙岩市',
        'value': '08'
      },
      {
        'key': '宁德市',
        'value': '09'
      }
    ]
  },
  {
    'key': '江西省',
    'value': [
      {
        'key': '南昌市',
        'value': '01'
      },
      {
        'key': '景德镇市',
        'value': '02'
      },
      {
        'key': '萍乡市',
        'value': '03'
      },
      {
        'key': '九江市',
        'value': '04'
      },
      {
        'key': '新余市',
        'value': '05'
      },
      {
        'key': '鹰潭市',
        'value': '06'
      },
      {
        'key': '赣州市',
        'value': '07'
      },
      {
        'key': '吉安市',
        'value': '08'
      },
      {
        'key': '宜春市',
        'value': '09'
      },
      {
        'key': '抚州市',
        'value': '10'
      },
      {
        'key': '上饶市',
        'value': '11'
      }
    ]
  },
  {
    'key': '山东省',
    'value': [
      {
        'key': '济南市',
        'value': '01'
      },
      {
        'key': '青岛市',
        'value': '02'
      },
      {
        'key': '淄博市',
        'value': '03'
      },
      {
        'key': '枣庄市',
        'value': '04'
      },
      {
        'key': '东营市',
        'value': '05'
      },
      {
        'key': '烟台市',
        'value': '06'
      },
      {
        'key': '潍坊市',
        'value': '07'
      },
      {
        'key': '济宁市',
        'value': '08'
      },
      {
        'key': '泰安市',
        'value': '09'
      },
      {
        'key': '威海市',
        'value': '10'
      },
      {
        'key': '日照市',
        'value': '11'
      },
      {
        'key': '莱芜市',
        'value': '12'
      },
      {
        'key': '临沂市',
        'value': '13'
      },
      {
        'key': '德州市',
        'value': '14'
      },
      {
        'key': '聊城市',
        'value': '15'
      },
      {
        'key': '滨州市',
        'value': '16'
      },
      {
        'key': '菏泽市',
        'value': '17'
      }
    ]
  },
  {
    'key': '河南省',
    'value': [
      {
        'key': '郑州市',
        'value': '01'
      },
      {
        'key': '开封市',
        'value': '02'
      },
      {
        'key': '洛阳市',
        'value': '03'
      },
      {
        'key': '平顶山市',
        'value': '04'
      },
      {
        'key': '安阳市',
        'value': '05'
      },
      {
        'key': '鹤壁市',
        'value': '06'
      },
      {
        'key': '新乡市',
        'value': '07'
      },
      {
        'key': '焦作市',
        'value': '08'
      },
      {
        'key': '濮阳市',
        'value': '09'
      },
      {
        'key': '许昌市',
        'value': '10'
      },
      {
        'key': '漯河市',
        'value': '11'
      },
      {
        'key': '三门峡市',
        'value': '12'
      },
      {
        'key': '南阳市',
        'value': '13'
      },
      {
        'key': '商丘市',
        'value': '14'
      },
      {
        'key': '信阳市',
        'value': '15'
      },
      {
        'key': '周口市',
        'value': '16'
      },
      {
        'key': '驻马店市',
        'value': '17'
      },
      {
        'key': '省直辖县级行政区划',
        'value': '90'
      }
    ]
  },
  {
    'key': '湖北省',
    'value': [
      {
        'key': '武汉市',
        'value': '01'
      },
      {
        'key': '黄石市',
        'value': '02'
      },
      {
        'key': '十堰市',
        'value': '03'
      },
      {
        'key': '宜昌市',
        'value': '05'
      },
      {
        'key': '襄阳市',
        'value': '06'
      },
      {
        'key': '鄂州市',
        'value': '07'
      },
      {
        'key': '荆门市',
        'value': '08'
      },
      {
        'key': '孝感市',
        'value': '09'
      },
      {
        'key': '荆州市',
        'value': '10'
      },
      {
        'key': '黄冈市',
        'value': '11'
      },
      {
        'key': '咸宁市',
        'value': '12'
      },
      {
        'key': '随州市',
        'value': '13'
      },
      {
        'key': '恩施土家族苗族自治州',
        'value': '28'
      },
      {
        'key': '省直辖县级行政区划',
        'value': '90'
      }
    ]
  },
  {
    'key': '湖南省',
    'value': [
      {
        'key': '长沙市',
        'value': '01'
      },
      {
        'key': '株洲市',
        'value': '02'
      },
      {
        'key': '湘潭市',
        'value': '03'
      },
      {
        'key': '衡阳市',
        'value': '04'
      },
      {
        'key': '邵阳市',
        'value': '05'
      },
      {
        'key': '岳阳市',
        'value': '06'
      },
      {
        'key': '常德市',
        'value': '07'
      },
      {
        'key': '张家界市',
        'value': '08'
      },
      {
        'key': '益阳市',
        'value': '09'
      },
      {
        'key': '郴州市',
        'value': '10'
      },
      {
        'key': '永州市',
        'value': '11'
      },
      {
        'key': '怀化市',
        'value': '12'
      },
      {
        'key': '娄底市',
        'value': '13'
      },
      {
        'key': '湘西土家族苗族自治州',
        'value': '31'
      }
    ]
  },
  {
    'key': '广东省',
    'value': [
      {
        'key': '广州市',
        'value': '01'
      },
      {
        'key': '韶关市',
        'value': '02'
      },
      {
        'key': '深圳市',
        'value': '03'
      },
      {
        'key': '珠海市',
        'value': '04'
      },
      {
        'key': '汕头市',
        'value': '05'
      },
      {
        'key': '佛山市',
        'value': '06'
      },
      {
        'key': '江门市',
        'value': '07'
      },
      {
        'key': '湛江市',
        'value': '08'
      },
      {
        'key': '茂名市',
        'value': '09'
      },
      {
        'key': '肇庆市',
        'value': '12'
      },
      {
        'key': '惠州市',
        'value': '13'
      },
      {
        'key': '梅州市',
        'value': '14'
      },
      {
        'key': '汕尾市',
        'value': '15'
      },
      {
        'key': '河源市',
        'value': '16'
      },
      {
        'key': '阳江市',
        'value': '17'
      },
      {
        'key': '清远市',
        'value': '18'
      },
      {
        'key': '东莞市',
        'value': '19'
      },
      {
        'key': '中山市',
        'value': '20'
      },
      {
        'key': '潮州市',
        'value': '51'
      },
      {
        'key': '揭阳市',
        'value': '52'
      },
      {
        'key': '云浮市',
        'value': '53'
      }
    ]
  },
  {
    'key': '广西壮族自治区',
    'value': [
      {
        'key': '南宁市',
        'value': '01'
      },
      {
        'key': '柳州市',
        'value': '02'
      },
      {
        'key': '桂林市',
        'value': '03'
      },
      {
        'key': '梧州市',
        'value': '04'
      },
      {
        'key': '北海市',
        'value': '05'
      },
      {
        'key': '防城港市',
        'value': '06'
      },
      {
        'key': '钦州市',
        'value': '07'
      },
      {
        'key': '贵港市',
        'value': '08'
      },
      {
        'key': '玉林市',
        'value': '09'
      },
      {
        'key': '百色市',
        'value': '10'
      },
      {
        'key': '贺州市',
        'value': '11'
      },
      {
        'key': '河池市',
        'value': '12'
      },
      {
        'key': '来宾市',
        'value': '13'
      },
      {
        'key': '崇左市',
        'value': '14'
      }
    ]
  },
  {
    'key': '海南省',
    'value': [
      {
        'key': '海口市',
        'value': '01'
      },
      {
        'key': '三亚市',
        'value': '02'
      },
      {
        'key': '三沙市',
        'value': '03'
      },
      {
        'key': '儋州市',
        'value': '04'
      },
      {
        'key': '省直辖县级行政区划',
        'value': '90'
      }
    ]
  },
  {
    'key': '重庆市',
    'value': [
      {
        'key': '市辖区',
        'value': '01'
      },
      {
        'key': '县',
        'value': '02'
      }
    ]
  },
  {
    'key': '四川省',
    'value': [
      {
        'key': '成都市',
        'value': '01'
      },
      {
        'key': '自贡市',
        'value': '03'
      },
      {
        'key': '攀枝花市',
        'value': '04'
      },
      {
        'key': '泸州市',
        'value': '05'
      },
      {
        'key': '德阳市',
        'value': '06'
      },
      {
        'key': '绵阳市',
        'value': '07'
      },
      {
        'key': '广元市',
        'value': '08'
      },
      {
        'key': '遂宁市',
        'value': '09'
      },
      {
        'key': '内江市',
        'value': '10'
      },
      {
        'key': '乐山市',
        'value': '11'
      },
      {
        'key': '南充市',
        'value': '13'
      },
      {
        'key': '眉山市',
        'value': '14'
      },
      {
        'key': '宜宾市',
        'value': '15'
      },
      {
        'key': '广安市',
        'value': '16'
      },
      {
        'key': '达州市',
        'value': '17'
      },
      {
        'key': '雅安市',
        'value': '18'
      },
      {
        'key': '巴中市',
        'value': '19'
      },
      {
        'key': '资阳市',
        'value': '20'
      },
      {
        'key': '阿坝藏族羌族自治州',
        'value': '32'
      },
      {
        'key': '甘孜藏族自治州',
        'value': '33'
      },
      {
        'key': '凉山彝族自治州',
        'value': '34'
      }
    ]
  },
  {
    'key': '贵州省',
    'value': [
      {
        'key': '贵阳市',
        'value': '01'
      },
      {
        'key': '六盘水市',
        'value': '02'
      },
      {
        'key': '遵义市',
        'value': '03'
      },
      {
        'key': '安顺市',
        'value': '04'
      },
      {
        'key': '毕节市',
        'value': '05'
      },
      {
        'key': '铜仁市',
        'value': '06'
      },
      {
        'key': '黔西南布依族苗族自治州',
        'value': '23'
      },
      {
        'key': '黔东南苗族侗族自治州',
        'value': '26'
      },
      {
        'key': '黔南布依族苗族自治州',
        'value': '27'
      }
    ]
  },
  {
    'key': '云南省',
    'value': [
      {
        'key': '昆明市',
        'value': '01'
      },
      {
        'key': '曲靖市',
        'value': '03'
      },
      {
        'key': '玉溪市',
        'value': '04'
      },
      {
        'key': '保山市',
        'value': '05'
      },
      {
        'key': '昭通市',
        'value': '06'
      },
      {
        'key': '丽江市',
        'value': '07'
      },
      {
        'key': '普洱市',
        'value': '08'
      },
      {
        'key': '临沧市',
        'value': '09'
      },
      {
        'key': '楚雄彝族自治州',
        'value': '23'
      },
      {
        'key': '红河哈尼族彝族自治州',
        'value': '25'
      },
      {
        'key': '文山壮族苗族自治州',
        'value': '26'
      },
      {
        'key': '西双版纳傣族自治州',
        'value': '28'
      },
      {
        'key': '大理白族自治州',
        'value': '29'
      },
      {
        'key': '德宏傣族景颇族自治州',
        'value': '31'
      },
      {
        'key': '怒江傈僳族自治州',
        'value': '33'
      },
      {
        'key': '迪庆藏族自治州',
        'value': '34'
      }
    ]
  },
  {
    'key': '西藏自治区',
    'value': [
      {
        'key': '拉萨市',
        'value': '01'
      },
      {
        'key': '日喀则市',
        'value': '02'
      },
      {
        'key': '昌都市',
        'value': '03'
      },
      {
        'key': '林芝市',
        'value': '04'
      },
      {
        'key': '山南市',
        'value': '05'
      },
      {
        'key': '那曲地区',
        'value': '24'
      },
      {
        'key': '阿里地区',
        'value': '25'
      }
    ]
  },
  {
    'key': '陕西省',
    'value': [
      {
        'key': '西安市',
        'value': '01'
      },
      {
        'key': '铜川市',
        'value': '02'
      },
      {
        'key': '宝鸡市',
        'value': '03'
      },
      {
        'key': '咸阳市',
        'value': '04'
      },
      {
        'key': '渭南市',
        'value': '05'
      },
      {
        'key': '延安市',
        'value': '06'
      },
      {
        'key': '汉中市',
        'value': '07'
      },
      {
        'key': '榆林市',
        'value': '08'
      },
      {
        'key': '安康市',
        'value': '09'
      },
      {
        'key': '商洛市',
        'value': '10'
      }
    ]
  },
  {
    'key': '甘肃省',
    'value': [
      {
        'key': '兰州市',
        'value': '01'
      },
      {
        'key': '嘉峪关市',
        'value': '02'
      },
      {
        'key': '金昌市',
        'value': '03'
      },
      {
        'key': '白银市',
        'value': '04'
      },
      {
        'key': '天水市',
        'value': '05'
      },
      {
        'key': '武威市',
        'value': '06'
      },
      {
        'key': '张掖市',
        'value': '07'
      },
      {
        'key': '平凉市',
        'value': '08'
      },
      {
        'key': '酒泉市',
        'value': '09'
      },
      {
        'key': '庆阳市',
        'value': '10'
      },
      {
        'key': '定西市',
        'value': '11'
      },
      {
        'key': '陇南市',
        'value': '12'
      },
      {
        'key': '临夏回族自治州',
        'value': '29'
      },
      {
        'key': '甘南藏族自治州',
        'value': '30'
      }
    ]
  },
  {
    'key': '青海省',
    'value': [
      {
        'key': '西宁市',
        'value': '01'
      },
      {
        'key': '海东市',
        'value': '02'
      },
      {
        'key': '海北藏族自治州',
        'value': '22'
      },
      {
        'key': '黄南藏族自治州',
        'value': '23'
      },
      {
        'key': '海南藏族自治州',
        'value': '25'
      },
      {
        'key': '果洛藏族自治州',
        'value': '26'
      },
      {
        'key': '玉树藏族自治州',
        'value': '27'
      },
      {
        'key': '海西蒙古族藏族自治州',
        'value': '28'
      }
    ]
  },
  {
    'key': '宁夏回族自治区',
    'value': [
      {
        'key': '银川市',
        'value': '01'
      },
      {
        'key': '石嘴山市',
        'value': '02'
      },
      {
        'key': '吴忠市',
        'value': '03'
      },
      {
        'key': '固原市',
        'value': '04'
      },
      {
        'key': '中卫市',
        'value': '05'
      }
    ]
  },
  {
    'key': '新疆维吾尔自治区',
    'value': [
      {
        'key': '乌鲁木齐市',
        'value': '01'
      },
      {
        'key': '克拉玛依市',
        'value': '02'
      },
      {
        'key': '吐鲁番市',
        'value': '04'
      },
      {
        'key': '哈密市',
        'value': '05'
      },
      {
        'key': '昌吉回族自治州',
        'value': '23'
      },
      {
        'key': '博尔塔拉蒙古自治州',
        'value': '27'
      },
      {
        'key': '巴音郭楞蒙古自治州',
        'value': '28'
      },
      {
        'key': '阿克苏地区',
        'value': '29'
      },
      {
        'key': '克孜勒苏柯尔克孜自治州',
        'value': '30'
      },
      {
        'key': '喀什地区',
        'value': '31'
      },
      {
        'key': '和田地区',
        'value': '32'
      },
      {
        'key': '伊犁哈萨克自治州',
        'value': '40'
      },
      {
        'key': '塔城地区',
        'value': '42'
      },
      {
        'key': '阿勒泰地区',
        'value': '43'
      },
      {
        'key': '自治区直辖县级行政区划',
        'value': '90'
      }
    ]
  },
  {
    'key': '台湾省',
    'value': [
      {
        'key': '台湾省',
        'value': '00'
      }
    ]
  },
  {
    'key': '香港特别行政区',
    'value': [
      {
        'key': '香港特别行政区',
        'value': '00'
      }
    ]
  },
  {
    'key': '澳门特别行政区',
    'value': [
      {
        'key': '澳门特别行政区',
        'value': '00'
      }
    ]
  }
]

const SEXS = [
  {
    value: 0,
    label: '女'
  },
  {
    value: 1,
    label: '男'
  }
]

const RESELLER_TYPE = {
  ONLINE: '线上合伙人',
  OFFLINE: '线下合伙人',
  ACTIVATED: '达人',
  INACTIVATED: '普通用户'
}

export default {
  GOODS_TYPE,
  SHELF_STATUS,
  GIFT_STATUS,
  ORDER_STATUS,
  LOTTERY_STATUS,
  WINNER_STATUS,
  AFTERSALE_STATUS,
  RESELLER_STATUS,
  WITHDRAW_STATUS,
  PROVINCE,
  CITY,
  SEXS,
  SCENE_STATUS,
  RESELLER_TYPE,
  DISCOUNT_STATUS
}
