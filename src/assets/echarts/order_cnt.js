let option = {
  xAxis: {
    data: ['日期'],
    axisLabel: {
      textStyle: {
        color: '#666666'
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    // z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#999'
      }
    }
  },
  tooltip : {
    trigger: 'axis',
    formatter: '{b}<br />{a} {c}'
    // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
    //   type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    // }
  },
};

let seriesOption = {
  type: 'bar',
  itemStyle: {
    normal: {
      color: '#71aae8'
    }
  }
}

export default {
  option: option,
  seriesOption: seriesOption
}
