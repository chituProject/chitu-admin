export default {
  title: {
    text: '饼图程序调用高亮示例',
    x: 'center'
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['50%', '70%'],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: [
        {value: 335, name: '直接访问'},
        {value: 310, name: '邮件营销'},
        {value: 234, name: '联盟广告'},
        {value: 135, name: '视频广告'},
        {value: 1548, name: '搜索引擎'}
      ],
      label: {
        normal: {
            show: false,
            position: 'center'
        },
        emphasis: {
            show: true,
            textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
            }
        }
      },
    }
  ]
}