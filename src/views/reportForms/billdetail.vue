<template>
  <div class="billdetail">
    <van-nav-bar :title="$t('reportForms.a72')" left-arrow @click-left="back" />
    <div class="type">
      <span class="number">{{ state.obj.cashShow }}</span>
      <span class="txt">{{ state.obj.name }}</span>
    </div>
    <div v-if="state.obj.changeType === 5" class="top">
      <div>
        <span>{{ $t('reportForms.a61') }}</span>
        <span>{{ state.obj.otherInfo.payCashTypeCode }}</span>
      </div>
      <div>
        <span>{{ $t('reportForms.a62') }}</span>
        <span>{{ state.obj.otherInfo.phone }}</span>
      </div>
      <div>
        <span>{{ $t('reportForms.a63') }}</span>
        <span></span>{{ state.obj.otherInfo.handlingFee }}
      </div>
      <div>
        <span>{{ $t('reportForms.a64') }}</span>
        <span class="red1">{{ state.obj.otherInfo.amount }}</span>
      </div>
      <div>
        <span>{{ $t('reportForms.a65') }}</span>
        <span></span>{{ state.obj.otherInfo.wingBillCode }}
      </div>
      <div>
        <span>{{ $t('reportForms.a66') }}</span>
        <span class="red2">{{ state.obj.stateName }}</span>
      </div>
    </div>
    <!-- 1充值  5提现 6投注 16转账-->
    <div class="bottom">
      <div>
        <span>{{ $t('reportForms.a67') }}</span>
        <span>{{ state.obj.stateName }}</span>
      </div>
      <div>
        <span>{{ $t('reportForms.a68') }}</span>
        <span>{{ state.obj.createTime }}</span>
      </div>
      <div>
        <span>{{ $t('reportForms.a69') }}</span>
        <span>{{ state.obj.id }}</span>
      </div>
      <div>
        <span>{{ $t('reportForms.a70') }}</span>
        <span>{{ state.obj.otherId }}</span>
      </div>
      <div>
        <span>{{ $t('reportForms.a71') }}</span>
        <span>{{ state.obj.balance }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import reportforms from '@/api/reportforms';
import lance from '@/utils/lance';
import User from '@/api/user';

export default {
  name: 'Billdetail',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const $route = useRoute();
    const state = reactive({
      curren: 0,
      obj: {},
    });
    const back = () => {
      $router.back();
    };
    const getData = (ids) => {
      reportforms
        .getAccountCashDetail({
          appInfo: {},
          data: {
            id: ids,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            const obj = res.data;
            obj.balance = `${lance.filterMoney(Number(obj.balance))}.00`;
            obj.cashShow = `${obj.cashShow.slice(0, 2) + lance.filterMoney(Number(obj.cashShow.slice(2)))}.00`;
            if (obj.otherInfo) {
              obj.otherInfo.amount = `${lance.filterMoney(Number(obj.otherInfo.amount))}.00`;
              obj.otherInfo.handlingFee = `${lance.filterMoney(Number(obj.otherInfo.handlingFee))}.00`;
            }
            state.obj = obj;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getAccountInfo = () => {
      User.getAccountInfo({
        appInfo: {},
      })
        .then((res) => {
          lance.setJson('user', res.data);
        })
        .catch(() => {
          // console.log(err);
        });
    };
    onMounted(() => {
      getAccountInfo();
      console.log($route.query.id);
      const { id } = $route.query;
      getData(id);
    });
    return {
      t,
      state, // 状态
      back, // 返回
      getData,
      getAccountInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.billdetail {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  .type {
    width: 710px;
    height: 242px;
    background: #fff;
    border-radius: 10px;
    margin: 20px auto 2px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .number {
      margin: 55px 0 1px 0;
      min-width: 248px;
      height: 90px;
      font-size: 64px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 90px;
      color: #333333;
    }
    .text {
      min-width: 60px;
      height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 42px;
      color: #333333;
    }
  }
  .top,
  .bottom {
    width: 710px;
    min-height: 432px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 29px 29px 30px 25px;
    margin: 0 auto 20px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 40px;
      > span {
        &:first-child {
          min-width: 112px;
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
          color: #666666;
        }
        &:last-child {
          min-width: 118px;
          height: 42px;
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 42px;
          color: #333333;
          opacity: 1;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .red1 {
      height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 42px;
      text-align: right;
      color: #ff0000 !important;
    }
    .red2 {
      height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 42px;
      color: #ff0000 !important;
    }
  }
}
</style>
