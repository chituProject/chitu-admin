let option = {
  tooltip: {
    trigger: 'none',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
  },
  yAxis: {
    type: 'category',
    data: ['今日暂无商品售出'],
    inverse: true,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
  },
};

let seriesOption = {
  name: '销量',
  type: 'bar',
  itemStyle: {
    normal: {
      color: function (params) {
        let colorList = ['#f56554', '#71aae8', '#ffc000']
        return colorList[params.dataIndex % colorList.length]
      }
    }
  }
}

export default {
  option: option,
  seriesOption: seriesOption
}
