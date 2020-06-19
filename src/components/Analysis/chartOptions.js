let option = {
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    data: []
  },
  yAxis: {
    splitLine: {
      show: false
    }
  },
  toolbox: {
    left: 'center',
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  dataZoom: [{
    startValue: '2014-06-01'
  }, {
    type: 'inside'
  }],
  visualMap: {
    top: 10,
    right: 20,
    min: 0,
    max: 4,
    // dataValue corresponding to the two handles.
    range: [0, 4],
    text: ['4', '0'],
    color: ['#bf444c', '#bf444c', '#d88273', '#00ef43']
  },
  series: {
    type: 'line',
    data: [],
    markLine: {
      silent: true,
      data: [{
        yAxis: 0.5
      }, {
        yAxis: 1
      }, {
        yAxis: 1.5
      }, {
        yAxis: 2
      }]
    }
  }
}

export default {
  option: option
}
