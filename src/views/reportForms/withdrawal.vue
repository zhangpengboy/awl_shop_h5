<template>
  <div class="withdrawal">
    <van-nav-bar :title="$t('reportForms.a111')" left-arrow @click-left="back" />
    <div class="top">
      <div v-if="state.channel === '80001'" @click="gowithdrawal1('/reportForms/offlinewithdrawal')">
        <img :src="state.wangdian" alt="" />
        <span class="title">{{ $t('reportForms.a148') }}</span>
      </div>
      <div @click="gowithdrawal('/reportForms/bankcardwithdrawal')">
        <img :src="state.yinhangka" alt="" />
        <span class="title">{{ $t('reportForms.a149') }}</span>
      </div>
      <div @click="gowithdrawal('/reportForms/onlinewithdrawal')">
        <img :src="state.tixian" alt="" />
        <span class="title">{{ $t('reportForms.a150') }}</span>
        <span class="desc"> {{ $t('reportForms.a151') }}</span>
      </div>
    </div>
    <div class="balance">
      <div class="number">
        <span>{{ $t('msg.a38') }}</span>
        <span>{{ state.balance }}</span>
      </div>
      <div class="line bor">
        <span>{{ $t('reportForms.a152') }}</span>
        <span>{{ state.cash }}</span>
      </div>
      <div class="line">
        <span>{{ $t('reportForms.a153') }}</span>
        <span>{{ state.cashExt }}</span>
      </div>
    </div>
    <div class="bottom">
      <div class="title">{{ $t('reportForms.a154') }}</div>
      <p>{{ $t('reportForms.a155') }}</p>
      <p>{{ $t('reportForms.a156') }}</p>
      <p>{{ $t('reportForms.a157') }}</p>
      <p>{{ $t('reportForms.a158') }}</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { get } from 'vant/lib/utils';
import { useI18n } from 'vue-i18n';
import tixian from '@/assets/img/reportForms/tixian.png';
import wangdian from '@/assets/img/reportForms/wangdian.png';
import yinhangka from '@/assets/img/reportForms/yinhangka.png';
import lance from '@/utils/lance';
import reportforms from '@/api/reportforms';

export default {
  name: 'Withdrawal',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      curren: 0,
      tixian,
      wangdian,
      channel: '',
      yinhangka,
      cash: 0,
      cashExt: 0,
      balance: 0,
    });
    const back = () => {
      $router.back();
    };
    const gowithdrawal = (url) => {
      if (lance.getJson('user').phone === '') {
        Toast(t('reportForms.a131'));
        return $router.push('/reportForms/settingphone');
      }
      if (!lance.getJson('user').hasPayPwd) {
        Toast(t('reportForms.a173'));
        return $router.push('/reportForms/settingpin');
      }
      $router.push(url);
    };
    const gowithdrawal1 = (url) => {
      $router.push(url);
    };
    const getlistPlatformAccount = () => {
      reportforms
        .listPlatformAccount({
          appInfo: {},
          data: {
            platformType: '',
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            console.log(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getlistPayCashType = () => {
      reportforms
        .listPayCashType({
          appInfo: {},
          data: {
            cashType: '1', // 转账
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            console.log(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    onMounted(() => {
      const userInfo = lance.getJson('user');
      state.channel = lance.getData('channel');
      state.cash = lance.filterMoney(userInfo.cash);
      state.cashExt = lance.filterMoney(userInfo.cashExt);
      state.balance = lance.filterMoney(userInfo.cash + userInfo.cashExt);
      getlistPayCashType();
      const user = lance.getJson('user');
      if (user.phone === '') {
        Toast(t('reportForms.a60'));
      }
      if (user.hasPayPwd === 0) {
        Toast(t('reportForms.a173'));
      }
    });
    return {
      state, // 状态
      t,
      back, // 返回
      getlistPayCashType,
      getlistPlatformAccount,
      gowithdrawal,
      gowithdrawal1,
    };
  },
};
</script>

<style lang="scss" scoped>
.withdrawal {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  .top {
    width: 710px;
    min-height: 220px;
    background: #edf1f5;
    border-radius: 10px;
    margin: 20px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 42px 0 47px;
    > div {
      min-height: 220px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      img {
        display: block;
        width: 64px;
        height: 64px;
        margin: 37px 0 21px 0;
      }
      .title {
        min-height: 37px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        text-align: center;
        line-height: 37px;
        color: #333333;
      }
      .desc {
        min-height: 37px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 37px;
        text-align: center;
        color: #999999;
      }
    }
  }
  .balance {
    width: 710px;
    height: 300px;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 0 30px;
    margin: 0 auto;
    > .number {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100px;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 100px;
      color: #333333;
    }
    .line {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > span {
        &:first-child {
          min-width: 140px;
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
          margin-right: 25px;
          color: #666666;
        }
        &:last-child {
          width: 114px;
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
          color: #333333;
        }
      }
    }
    .bor {
      border-bottom: 1px solid #e5e5e5;
    }
  }
  .bottom {
    width: 710px;
    min-height: 452px;
    background: #fff;
    border-radius: 10px 10px 0px 0px;
    box-sizing: border-box;
    padding: 30px 28px;
    margin: 20px auto 0;
    .title {
      width: 100%;
      height: 45px;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 45px;
      color: #000000;
      margin-bottom: 20px;
    }
    > p {
      width: 100%;
      min-height: 30px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 30px;
      color: #999999;
      margin-bottom: 20px;
    }
  }
}
</style>
