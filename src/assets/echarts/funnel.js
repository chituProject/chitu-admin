let option = {
  tooltip: {
    trigger: 'item',
    formatter: "{b} <br/>人数: {c}"
  },
  legend: {
    right: '1%',
    orient: 'vertical',
    data: ['展现','点击','访问','咨询','订单']
  },
  calculable: true,
};

let retentionOption = {
  name: '用户留存漏斗图',
  type: 'funnel',
  min: 0,
  minSize: '0%',
  maxSize: '80%',
  sort: 'none',
  label: {
    normal: {
      show: true,
      position: 'inside'
    }
  },
  itemStyle: {
    normal: {
      borderColor: '#fff',
      borderWidth: 1,
      color: function (params) {
        let colorList = ['#f56554', '#71aae8', '#ffc000', '#67C23A']
        return colorList[params.dataIndex]
      }
    }
  },
}

let transformOption = {
  name: '用户转化漏斗图',
  type: 'funnel',
  min: 0,
  minSize: '0%',
  maxSize: '80%',
  sort: 'none',
  label: {
    normal: {
      show: true,
      position: 'inside'
    }
  },
  itemStyle: {
    normal: {
      borderColor: '#fff',
      borderWidth: 1,
      color: function (params) {
        let colorList = ['#f56554', '#71aae8', '#ffc000', '#67C23A']
        return colorList[params.dataIndex]
      }
    }
  },
}

export default {
  option: option,
  retentionOption: retentionOption,
  transformOption: transformOption
}
