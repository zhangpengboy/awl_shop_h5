import { defineStore } from 'pinia';
import lance from '@/utils/lance';

export const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      hasLogin: !!lance.getData('token') || false,
      user: lance.getJson('user') || {},
    };
  },
  actions: {
    // 已登陆
    login(payload) {
      lance.setJson('user', payload);
      lance.setData('token', payload.token);
      lance.setData('userNo', payload.userNo);
      this.hasLogin = true;
      this.user = payload;
    },
    // 退出登录
    loginOut() {
      lance.clearStorage('user');
      lance.clearStorage('token');
      lance.clearStorage('userNo');
      lance.clearStorage('userNumber');
      lance.clearStorage('time');
      this.hasLogin = false;
      this.user = null;
    },
  },
});
