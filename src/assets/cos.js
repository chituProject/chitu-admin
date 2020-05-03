import COS from 'cos-js-sdk-v5'
import axios from '@/assets/axios.js'

let cos = new COS({
  getAuthorization: function (options, callback) {
    // 异步获取签名
    // console.log('getAuthorization options:', options)
    axios.get('/insider/oss-auth/')
      .then (res =>{
        // console.log('getAuthorization response:', res.data)
        callback({
          // Authorization: res.data.Authorization
          TmpSecretId: res.data.TmpSecretId,
          TmpSecretKey: res.data.TmpSecretKey,
          XCosSecurityToken: res.data.XCosSecurityToken,
          ExpiredTime: res.data.ExpiredTime,
        });
      });
  }
});

export default cos
