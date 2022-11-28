import axios from 'axios';
import { Toast } from 'vant';
import lance from '@/utils/lance';
import router from '@/router';
import 'vant/es/toast/style';
import JSONbig from 'json-bigint';
import CryptoJS from 'crypto-js'; // 加密解密
import { RandomString, getlongTime, RsaSign, isDev } from '@/utils/env';

// 后端返回码国际化配置
const language = lance.Language();
const langue = lance.LanguageCustomize();
// 默认header
axios.defaults.headers['Accept-Language'] = language;
axios.defaults.headers['Content-Type'] = import.meta.env.VITE_APP_REQUEST_DATA_ENCRYPTION === 1 ? 'text/plain' : 'application/json';
axios.defaults.headers.sid = '20201127001100000abcd';
axios.defaults.headers.appId = 'H5';
axios.defaults.headers.langue = langue;
axios.defaults.headers.encrypt = import.meta.env.VITE_APP_REQUEST_DATA_ENCRYPTION;
axios.defaults.headers.clientType = Number(lance.getData('channel')) === 80002 ? 'C_H5' : 'B_H5'; // 终端类型
axios.defaults.headers.ip = sessionStorage.getItem('ip'); // ip
axios.defaults.headers.deviceId = ''; // 设备id，设备唯一标识
axios.defaults.headers.networkType = 'unknow'; // unknow 、wifi、5G、4G、3G、2G
axios.defaults.headers.model = ''; // 设备的型号
axios.defaults.headers.osSystem = ''; // 操作系统（包含版本号）
axios.defaults.headers.imei = ''; // 设备的国际移动设备身份码
axios.defaults.headers.imsi = ''; // 设备的国际移动用户识别码
axios.defaults.headers.vendor = ''; // 设备的生产厂商
axios.defaults.headers.longitude = ''; // 经度
axios.defaults.headers.latitude = ''; // 纬度
axios.defaults.headers.versionName = 'eg1.0.0'; //
axios.defaults.headers.versionCode = 'eg100000'; //
axios.defaults.headers.userNo = lance.getData('userNo'); // 用户id

// 创建请求实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_PROXY_DOMAIN_REAL,
  // 指定请求超时的毫秒数
  timeout: 20000,
  // 表示跨域请求时是否需要使用凭证
  withCredentials: false,
  transformResponse: [
    (data) => {
      // 后端返回的数据可能不是 JSON 格式字符串
      // 如果不是的话，那么 JSONbig.parse 调用就会报错
      // 所以我们使用 try-catch 来捕获异常，处理异常的发生
      try {
        // 如果转换成功，则直接把结果返回
        // console.log(JSONbig.parse(data));
        return JSONbig.parse(data);
      } catch (err) {
        // console.log('转换失败', err);
        // 如果转换失败了，则进入这里
        // 我们在这里把数据原封不动的直接返回给请求使用
        // 解密
        const dec = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(err.text)), CryptoJS.enc.Utf8.parse('xf71u9uxf7rn5z3z'), {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }).toString(CryptoJS.enc.Utf8);
        // console.log('dec:::::', dec);
        data = JSON.parse(dec);
        console.log('transformResponse返回数据：', data);
        return data;
      }
    },
  ],
});

// 前置拦截器（发起请求之前的拦截）
instance.interceptors.request.use(
  (config) => {
    const params = JSON.parse(JSON.stringify(config));
    console.log('请求参数:', params.data);
    /**
     * 在这里一般会携带前台的参数发送给后台，比如下面这段代码：
     */
    const token = lance.getData('token');
    if (token) {
      if (config.data && config.data.appInfo) {
        config.data.appInfo.channel = lance.getData('channel');
        config.data.appInfo.appId = 'test';
        config.data.appInfo.accessToken = token;
        config.data.appInfo.platform = 'h5';
        config.data.appInfo.userNo = lance.getData('userNo');
      }
      const nonceStr = RandomString();
      const timestamp = getlongTime();
      config.headers.sign = RsaSign(params.data, nonceStr, timestamp);
      config.headers.nonceStr = nonceStr;
      config.headers.timestamp = timestamp;
      config.headers.userId = token;
    }
    // 接口加密
    if (!isDev()) {
      // 非开发环境要进行加密
      if (config.data) {
        const enc = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(config.data)), CryptoJS.enc.Utf8.parse('xf71u9uxf7rn5z3z'), {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        })
          .ciphertext.toString()
          .toUpperCase();
        // console.log(enc, 'enc')
        config.data = enc;
        config.headers['Content-Type'] = 'text/plain';
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 后置拦截器（获取到响应时的拦截）
instance.interceptors.response.use(
  (response) => {
    /**
     * 根据你的项目实际情况来对 response 和 error 做处理
     */
    const res = response.data;
    console.log(response.config.url, '返回数据：', response);
    if (response.request.responseType) {
      // 非json格式：blob类型
      return response.request.response;
    }

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      if (response.config.url === '/api/account/lotteryMan/withdrawFromShop') {
        Toast(res.toast);
      } else {
        Toast(res.toast);
      }
      // 412: Token 过期;
      if (res.code === 7001) {
        return router.push('/login');
      }
      return Promise.reject(res || 'Error');
    }
    return res;
  },
  (error) => {
    const { response } = error;
    // console.log('errorresponse', response);
    if (response && response.data) {
      Toast({
        message: response.data.toast,
        position: 'bottom',
      });
      return Promise.reject(error);
    }
    // const { message } = error;
    // // console.error(message);
    return Promise.reject(error);
  },
);

// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const post = (url, data = {}, params = {}) => {
  return instance({
    method: 'post',
    url,
    data,
    params,
  });
};

/**
 * @param {string} url
 * @param {object} params
 */
export const get = (url, params = {}) => {
  return instance({
    method: 'get',
    url,
    params,
  });
};

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const put = (url, data = {}, params = {}) => {
  return instance({
    method: 'put',
    url,
    params,
    data,
  });
};

/**
 * @param {string} url
 * @param {object} params
 */
export const _delete = (url, params = {}) => {
  return instance({
    method: 'delete',
    url,
    params,
  });
};

export default instance;
