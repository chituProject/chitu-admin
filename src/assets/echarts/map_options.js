let option = {
  // title : {
  //   text: '用户来源分析图',
  //   x:'left'
  // },
  tooltip : {
    trigger: 'item',
    formatter: function (params, ticket, callback) {
      if (params.value) {
        return params.name + '<br/>' + params.seriesName + ': ' + params.value;
      }
      else {
        return null
      }
    }
  },
  // legend: {
  //   orient: 'vertical',
  //   x:'left',
  //   data:['iphoneX']
  // },
  dataRange: {
    min: 0,
    max: 1000,
    x: 'right',
    y: 'bottom',
    inRange: {
      color: ['#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      // color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
    },
    text:['高','低'],
    calculable : true
  },
  roamController: {
    show: true,
    x: 'right',
    mapTypeControl: {
      'china': true
    }
  }
};

let seriesOption = {
  name: '用户数量',
    type: 'map',
  mapType: 'china',
  roam: false,
  itemStyle: {
    emphasis: {
      label: {
        show: false
      },
      // areaColor: '#f56554'
      areaColor: '#71aae8'
    }
  },
  // data: sourceData.map(item => {
  //   let result = {}
  //   result.name = getChina(item.wechat_province)
  //   result.value = item.id__count
  //   return result
  // })
}

export default {
  option: option,
  seriesOption: seriesOption
}
