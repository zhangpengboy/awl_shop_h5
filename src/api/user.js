import { post } from '@/utils/request';

export default class User {
  /**
   * 登录
   * @param {String} username 用户名
   * @param {String} password 密码
   * @returns
   */
  static async login(data) {
    return post('/api/account/loginForHFive', data);
  }

  // 注册
  static async registerForHFive(data) {
    return post('/api/account/registerForHFive', data);
  }

  // 检查用户名
  static async isUser(data) {
    return post('/api/account/checkUsername', data);
  }

  // 检查手机号绑定
  static async checkPhoneIsBind(data) {
    return post('/api/account/checkPhoneIsBind', data);
  }

  // 检查手机号是否存在的
  static async checkPhoneIsExist(data) {
    return post('/api/account/checkPhoneIsExist', data);
  }

  // 检查手机号或者用户名
  static async checkUsernameOrPhoneIsExist(data) {
    return post('/api/account/checkUsernameOrPhoneIsExist', data);
  }

  // 获取验证码
  static async getSms(data) {
    return post('/api/validate/create', data);
  }

  // 确认忘记密码
  static async changePassword(data) {
    return post('/api/account/forgetPwd', data);
  }

  // 获取用户信息
  static async getAccountInfo(data) {
    return post('/api/account/getAccountInfo', data);
  }

  // ============================= 彩种相关接口 =======================================
  //
  static async getPhaseInfo(data) {
    return post('/api/phase/getPhaseInfo', data);
  }

  static async getOpenList(data) {
    return post('/api/phase/getOpenList', data);
  }

  // 不需要支付密码的投注
  static async betHFive(data) {
    return post('/api/order/betHFive', data);
  }

  static async list(data) {
    return post('/api/order/list', data);
  }

  static async getGold(data) {
    return post('/api/account/getGold', data);
  }

  static async drawGold(data) {
    return post('/api/activityPerDayGift/drawGold', data);
  }

  static async detail(data) {
    return post('/api/order/detail', data);
  }
}
