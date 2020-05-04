import axios from 'axios'
import config from '../config'
import router from '../router/index'
import { Message } from 'element-ui'
import store from '@/store/index'

let instance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
  headers: {'Content-Type': 'application/json'}
})

instance.interceptors.response.use(data => {
  return data;
}, err => {
  if (err.response.status === 401) {
    Message.error('您尚未登录或登录状态已过期，请重新登录')
    router.push({path: '/'})
  } else if (err.response.status === 403) {
    Message.error('权限错误：', err.response.data)
    store.dispatch("acl/clear");
    router.push({path: '/'})
  } else if (err.response.status === 404) {
    // 悄悄404掉
  } else {
    console.log('axios:', err.response.data)
    alert('请求出错!\n错误码: '+err.response.status+'\n错误信息: '+JSON.stringify(err.response.data.detail))
  }
  // Alert('<p><strong>错误码 <i>'+err.response.status+'</i></strong><br/>错误信息: '+JSON.stringify(err.response.data.detail)+'</p>', '请求出错', {
  //   dangerouslyUseHTMLString: true
  // })
  return Promise.reject(err);
})

export default instance
