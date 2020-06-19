export function dateFormat (date, fmt) { // author: meizz
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export function deepCopy (p) {
  let c = JSON.stringify(p)
  c = JSON.parse(c)
  return c
}

export function formatTime(tt) {
  if (!tt) {
    return '无'
  }
  const a = tt.split('-');
  const y = a[0];
  const m = a[1];
  const Str1 = a[2];
  const d = Str1.substr(0, 2);
  const time = Str1.substr(3, 5);
  return `${y}-${m}-${d} ${time}`
}

export function formatTimeMonth(tt) {
  if (!tt) {
    return '无'
  }
  const a = tt.split('-');
  const y = a[0];
  const m = a[1];
  return `${y}-${m}`
}

export function isNumber(val) {
  const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  }
  return false;
}

// export function utf8(str) {
//   console.log('utf8', str);
//   return str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "\u9602");
// }
export function randomStr (l) {
  let x = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let tmp = ''
  let timestamp = new Date().getTime()
  for(let i = 0; i < l; i++) {
    tmp += x.charAt(Math.ceil(Math.random()*100000000) % x.length)
  }
  return timestamp + tmp
}


export default {
  formatTime,
  formatTimeMonth,
  isNumber,
  dateFormat,
  deepCopy,
  randomStr,
};
