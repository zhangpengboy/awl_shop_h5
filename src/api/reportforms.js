import { post } from '@/utils/request';

export default class reportforms {
  /**
   * 登录
   * @param {String} username 用户名
   * @param {String} password 密码
   * @returns
   */
  // 生成验证码
  static async createCode(data) {
    return post('/api/validate/create', data);
  }

  // 校验验证码
  static async judge(data) {
    return post('/api/validate/judge', data);
  }

  // 绑定手机号码
  static async bindPhone(data) {
    return post('/api/account/bindPhone', data);
  }

  // 退出登录(登出)
  static async loginOut(data) {
    return post('/api/account/loginOut', data);
  }

  // 忘记密码
  static async forgetPwd(data) {
    return post('/api/account/forgetPwd', data);
  }

  // 修改密码
  static async modifyPwd(data) {
    return post('/api/account/modifyPwd', data);
  }

  // 修改支付密码
  static async modifyPayPwd(data) {
    return post('/api/account/modifyPayPwd', data);
  }

  // 充值首页列表
  static async listRechargeIndex(data) {
    return post('/api/pay/listRechargeIndex', data);
  }

  // 用户资金明细
  static async listAccountCashDetail(data) {
    return post('/api/account/listAccountCashDetail', data);
  }

  // 流水详情
  static async getAccountCashDetail(data) {
    return post('/api/account/getAccountCashDetail', data);
  }

  // 充值接口
  static async rechargeOrder(data) {
    return post('/api/pay/rechargeOrder', data);
  }

  // 获取平台账号
  static async listPlatformAccount(data) {
    return post('/api/pay/listPlatformAccount', data);
  }

  // 获取最近的交易账户
  static async getLastPlatformAccount(data) {
    return post('/api/pay/getLastPlatformAccount', data);
  }

  // 增加获取平台账号
  static async addPayPlatformAccount(data) {
    return post('/api/pay/addPayPlatformAccount', data);
  }

  // 删除获取平台账号
  static async delPayPlatformAccount(data) {
    return post('/api/pay/delPayPlatformAccount', data);
  }

  // 提现首页
  static async listPayCashIndex(data) {
    return post('/api/pay/listPayCashIndex', data);
  }

  // 提现列表
  static async listPayCashType(data) {
    return post('/api/pay/listPayCashType', data);
  }

  // 发起提现
  static async cashOrder(data) {
    return post('/api/pay/cashOrder', data);
  }

  // 购彩记录（投注记录）
  static async orderlist(data) {
    return post('/api/order/list', data);
  }

  // 彩民取款（店主代提现）
  static async withdrawFromShop(data) {
    return post('/api/account/lotteryMan/withdrawFromShop', data);
  }

  // 彩民获取店主信息
  static async getNetshopInfo(data) {
    return post('/api/account/lotteryMan/getNetshopInfo', data);
  }
}
