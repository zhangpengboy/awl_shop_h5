/*
 * @Author       : Lance Yi <643931719@qq.com>
 * @Date         : 2022-11-05 16:13:23
 * @Description  : 全局通用方法
 */
import { Toast } from 'vant';
import { i18nt } from '@/i18n/index';

const prefix = 'awl-';

const lance = {
  // 设置String: JSON数据缓存
  setJson(key, value) {
    const jsonString = JSON.stringify(value);
    window.localStorage.setItem(prefix + key, jsonString);
  },
  // 获取JSON数据
  getJson(key) {
    const value = window.localStorage.getItem(prefix + key);
    if (value) return JSON.parse(value);
  },
  // 设置String: String数据缓存
  setData(key, value) {
    window.localStorage.setItem(prefix + key, value);
  },
  // 获取String数据
  getData(key) {
    const value = window.localStorage.getItem(prefix + key);
    if (value) return value;
  },
  // 清除指定Key数据
  clearStorage(key) {
    window.localStorage.removeItem(prefix + key);
  },
  // 设置String: JSON数据缓存
  setSessionJson(key, value) {
    const jsonString = JSON.stringify(value);
    window.sessionStorage.setItem(prefix + key, jsonString);
  },
  // 获取JSON数据
  getSessionJson(key) {
    const value = window.sessionStorage.getItem(prefix + key);
    if (value) return JSON.parse(value);
  },
  // 设置String: String数据缓存
  setSessionData(key, value) {
    window.sessionStorage.setItem(prefix + key, value);
  },
  // 获取String数据
  getSessionData(key) {
    const value = window.sessionStorage.getItem(prefix + key);
    if (value) return value;
  },
  // 清除指定Key数据
  clearSessionStorage(key) {
    window.sessionStorage.removeItem(prefix + key);
  },
  // 后端返回码国际适配
  Language() {
    if (window.localStorage.getItem(`${prefix}lang`) === 'cn') return 'zh-CN';
    if (window.localStorage.getItem(`${prefix}lang`) === 'en') return 'en-US';
    if (window.localStorage.getItem(`${prefix}lang`) === 'kh') return 'km-KH';
  },
  // 后端返回码国际适配自定义
  LanguageCustomize() {
    if (window.localStorage.getItem(`${prefix}lang`) === 'cn') return 'cn';
    if (window.localStorage.getItem(`${prefix}lang`) === 'en') return 'en';
    if (window.localStorage.getItem(`${prefix}lang`) === 'kh') return 'cambodia';
  },
  // 参数串化
  stringify(obj, prefix) {
    const pairs = [];
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      const enkey = encodeURIComponent(key);
      let pair;
      if (typeof value === 'object') {
        pair = this.stringify(value, prefix ? `${prefix}[${enkey}]` : enkey);
      } else {
        pair = `${prefix ? `${prefix}[${enkey}]` : enkey}=${encodeURIComponent(value)}`;
      }
      pairs.push(pair);
    }
    return pairs.join('&');
  },
  // 参数对象化
  parse(query) {
    const result = {};
    let part = null;
    const parser = /([^=?#&]+)=?([^&]*)/g;
    // eslint-disable-next-line no-cond-assign
    while ((part = parser.exec(query))) {
      const key = decodeURIComponent(part.replace(/\+/g, ' ')) || null;
      const value = decodeURIComponent(query[part].replace(/\+/g, ' ')) || null;
      if (key === null || value === null || key in result) continue;
      result[key] = value;
    }
    return result;
  },
  // 时间格式化
  parseTime(time, cFormat) {
    if (arguments.length === 0) return null;
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
        time = parseInt(time);
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time *= 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      if (result.length > 0 && value < 10) {
        value = `0${value}`;
      }
      return value || 0;
    });
    return timeStr;
  },
  // 截取名字
  filterCardName(v) {
    return `${v.substr(0, 1)}**`;
  },
  // 截取卡号
  filterCardNo(v) {
    return `****${v.slice(-4)}`;
  },
  // 复制
  copy(text) {
    const input = document.createElement('input'); // js创建一个input输入框
    input.value = text; // 将需要复制的文本赋值到创建的input输入框中
    document.body.appendChild(input); // 将输入框暂时创建到实例里面
    input.select(); // 选中输入框中的内容
    document.execCommand('Copy'); // 执行复制操作
    document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
    Toast(i18nt('reportForms.a47'));
  },
  // 获取url中的指定参数对应的值
  getQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return null;
  },
  // 手机正则
  checkPhone(number) {
    const relue = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    return relue.test(number);
  },
  // 手机正则 柬埔寨
  checkPhoneKHR(number) {
    const relue = /^[0-9]*[1-9][0-9]*$/;
    return relue.test(number);
  },
  // 金额处理
  filterMoney(number) {
    const newnumber = Number(number);
    return newnumber.toLocaleString();
  },
  // 输入金额限制一位小数
  onlyNonNegative(v) {
    let value = v.toString();
    // 清除“数字”和“.”以外的字符
    value = value.replace(/[^\d.]/g, '');
    // 只保留第一个. 清除多余的
    value = value.replace(/\.{2,}/g, '.');
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // 只能输入一个小数
    value = value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02
    if (value.indexOf('.') < 0 && value !== '') {
      value = parseFloat(value);
    }
    return value;
  },
  // 随机字符串
  randomString(e) {
    e = e || 32;
    const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const a = t.length;
    let n = '';
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  },
  // 校验登录密码
  checkPassWord(password) {
    const RegExp = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,20}$/;
    return RegExp.test(password);
  },
  // 校验密码
  checkPin(password) {
    const RegExp = /^[0-9]*$/;
    return RegExp.test(password);
  },
  // 手机号码处理
  filterPhone(phone) {
    if (phone === '') {
      return '未绑定手机号';
    }
    const lengths = phone.toString().length - 4;
    const str2 = phone.toString().substr(phone.toString().length - 4, phone.toString().length);
    console.log(str2);
    let newPhone = '';
    for (let i = 0; i < lengths; i++) {
      newPhone += '*';
    }
    return newPhone + str2;
  },
};
export default lance;
