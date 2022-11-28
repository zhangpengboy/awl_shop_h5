<template>
  <div class="reportForms">
    <div class="top">
      <p class="number">
        <span>{{ state.money }}</span>
        <span>KHR</span>
      </p>
      <p class="report">
        <span class="topup" @click="goDeposit">{{ $t('reportForms.a35') }}</span>
        <span class="withdrawal" @click="goWithdrawal">{{ $t('reportForms.a111') }}</span>
      </p>
    </div>
    <div class="bottom">
      <div @click="$router.push('/reportForms/transactions')">
        <img src="@/assets/img/home/ic_balance.png" alt="#" />
        <span>{{ $t('reportForms.a59') }}</span>
      </div>
      <div @click="goMyacount">
        <img src="@/assets/img/home/ic_cash.png" alt="#" />
        <span>{{ $t('reportForms.a91') }}</span>
      </div>
      <div @click="$router.push('/reportForms/recordofpurchase')">
        <img src="@/assets/img/home/ic_record.png" alt="#" />
        <span>{{ $t('reportForms.a92') }}</span>
      </div>
      <div @click="$router.push('/reportForms/service')">
        <img src="@/assets/img/home/ic_service.png" alt="#" />
        <span>{{ $t('reportForms.a20') }}</span>
      </div>
      <div @click="$router.push('/reportForms/setting')">
        <img src="@/assets/img/home/ic_set.png" alt="#" />
        <span>{{ $t('reportForms.a82') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Toast } from 'vant';
import lance from '@/utils/lance';
import reportforms from '@/api/reportforms';

export default {
  name: 'ReportForms',
  setup() {
    const { t } = useI18n();
    const state = reactive({
      a: 0,
      cash: ref(0),
      cashExt: ref(0),
      money: ref(0),
    });
    const $router = useRouter();
    const goDeposit = () => {
      const type = lance.getData('channel');
      console.log(type, 'type');
      if (type === '80001') {
        $router.push('/reportForms/bdeposit');
      } else {
        $router.push('/reportForms/cdeposit');
      }
    };
    const goWithdrawal = () => {
      $router.push('/reportForms/withdrawal');
    };
    const goMyacount = () => {
      let hasAddPayAccount = false;
      reportforms
        .listPlatformAccount({
          appInfo: {
            channel: lance.getData('channel'),
            appId: 'test',
            platform: 'web',
            imei: lance.randomString(6),
          },
          data: {
            platformType: '', // 1银行卡  3 第三方
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            hasAddPayAccount = res.data.length === 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      if (hasAddPayAccount) {
        $router.push('/reportForms/addacount');
      } else {
        $router.push('/reportForms/myacount');
      }
    };
    onMounted(() => {
      const userInfo = JSON.parse(lance.getData('user'));
      state.cash = userInfo.cash;
      state.cashExt = userInfo.cashExt;
      state.money = lance.filterMoney(state.cash + state.cashExt);
    });
    return {
      t,
      state, // 状态
      goDeposit, // 跳转充值
      goWithdrawal, // 跳转提现
      goMyacount, // 跳转我取款账户
    };
  },
};
</script>

<style scoped lang="less">
.reportForms {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 80px);
  color: #000;
  background: #f6f6f6;
  flex-direction: column;
  user-select: none;
  .top {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    margin: 20px 25px;
    padding: 38px 0 41px 40px;
    width: 700px;
    height: 240px;
    border-radius: 8px;
    background: #fff;
    flex-direction: column;
    box-sizing: border-box;
    .number {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 35px;
      > span {
        margin-left: 14px;
        height: 56px;
        font-size: 40px;
        font-family: PingFangSC-Semibold;
        line-height: 60px;
        color: #333333;
      }
    }
    .report {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .withdrawal,
      .topup {
        width: 200px;
        height: 70px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        border-radius: 44px;
        text-align: center;
        line-height: 70px;
        user-select: none;
      }
      .topup {
        margin-right: 141px;
        color: #fff;
        background: linear-gradient(87deg, #f86117 0%, #f8481e 100%);
      }
      .withdrawal {
        border: 1px solid #cccccc;
        background: rgba(255, 255, 255, 0.39);
      }
    }
  }
  .bottom {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    margin: 0 auto;
    width: 700px;
    height: auto;
    border-radius: 8px;
    background: #fff;
    flex-direction: column;
    > div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 46px;
      box-sizing: border-box;
      width: 100%;
      height: 98px;
      border-bottom: 1px solid #f6f6f6;
      &:last-child {
        border-bottom: none;
      }
      > img {
        display: block;
        margin-right: 31px;
        width: 40px;
        height: 40px;
      }
      > span {
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        line-height: 40px;
        color: #131417;
      }
    }
  }
}
</style>
