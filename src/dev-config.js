const baseUrl = 'https://dev.offpay.cn'
const Bucket = 'offpay-dev-1256235662'
const Region = 'ap-guangzhou'
const isDev = true
const mapKey = 'IUXBZ-ABF3X-NHT42-7PJQJ-65PUJ-F5FZW'
const ravenUrl = 'http://f7ff1f39139c4c83bee4c7617e43bca1@sentry.offpay.cn/9'

const categories = [
  {
    id: 54,
    name: '生活充值'
  },
  {
    id: 55,
    name: '视频会员'
  },
  {
    id: 56,
    name: '互动娱乐'
  },
  {
    id: 57,
    name: '礼品卡券'
  }
]

export default {
  name: 'Config',
  baseUrl,
  Bucket,
  Region,
  isDev,
  categories,
  mapKey,
  ravenUrl
}
