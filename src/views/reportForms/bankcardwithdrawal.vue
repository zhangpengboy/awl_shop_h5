<template>
  <div class="bankcardwithdrawal">
    <van-nav-bar :title="$t('reportForms.a25')" left-arrow @click-left="back" />
    <div v-if="!state.hasAccount" class="addaccount" @click="$router.push('/reportForms/addacount')">
      <img class="icontype1" src="../../assets/img/reportForms/add.png" alt="#" />
      <span class="typename">{{ $t('reportForms.a24') }}</span>
      <img class="iconright" src="../../assets/img/reportForms/right.png" alt="#" />
    </div>
    <div v-else class="type" @click="state.show = true">
      <img class="icontype" :src="state.currentAccount.icon" alt="#" />
      <span class="typename">{{ state.currentAccount.accountNo }}</span>
      <span class="tip">{{ $t('reportForms.a26') }}</span>
      <img class="iconright" src="../../assets/img/reportForms/right.png" alt="#" />
    </div>
    <div class="balance">
      <p class="title">{{ !state.hasAccount ? $t('reportForms.a27') : $t('reportForms.a28') }}</p>
      <div class="content bor">
        <span>៛</span>
        <van-field v-model="state.balance" class="number" :placeholder="$t('reportForms.a29')" />
        <img class="icondelete" src="../../assets/img/reportForms/iconDelete.png" alt="#" @click="state.balance = ''" />
      </div>
      <div class="bottom">
        <span>{{ $t('reportForms.a30', { cash: state.cash }) }}</span>
      </div>
    </div>
    <div class="public_btn" style="margin-top: 99px" @click="confirm">{{ $t('reportForms.a31') }}</div>
    <div class="kefu1">
      <img src="../../assets/img/reportForms/kefu.png" alt="#" />
      <span @click="$router.push('/reportForms/service')">{{ $t('msg.a11') }}</span>
    </div>
    <!-- 选择取款账户 -->
    <van-action-sheet v-model:show="state.show" :title="$t('reportForms.a32')">
      <div class="showcontent">
        <div class="list">
          <div v-for="(item, index) in state.showContentList" :key="index" class="item" @click="changeCheck(item, index)">
            <img class="icon" :src="item.icon" alt="#" />
            <span>{{ item.accountNo }}</span>
            <img v-if="state.currentcheck === index" class="check" :src="state.currentcheckImg" alt="" />
          </div>
        </div>
        <div class="add" @click="$router.push('/reportForms/addacount')">
          <img :src="state.add" alt="" />
          <span>{{ $t('reportForms.a24') }}</span>
        </div>
      </div>
    </van-action-sheet>
    <van-overlay :show="state.show1" @click="state.show1 = false">
      <div class="wrapper" @click.stop>
        <div class="popup">
          <div class="top">
            <img src="@/assets/img/reportForms/close.png" alt="" @click.stop="state.show1 = false" />
            <div class="title">{{ $t('reportForms.a15') }}</div>
          </div>
          <div class="content">
            <p>
              <span>{{ $t('reportForms.a34') }}</span>
              <span class="red">៛{{ state.balance }}</span>
            </p>
            <div class="password">
              <van-password-input :value="value1" :gutter="20" :length="4" :focused="showKeyboard1" @blur="showKeyboard1 = false" @focus="showKeyboard1 = true" />
              <van-number-keyboard v-model="value1" :show="showKeyboard1" theme="custom" extra-key="." :close-button-text="$t('reportForms.a16')" @blur="showKeyboard1 = false" @input="onInput1" @delete="onDelete1" />
            </div>
          </div>
          <div class="bottom">
            <span @click="forgetpinEvent">{{ $t('reportForms.a17') }}</span>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { ref, watch, reactive, onMounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import aba from '../../assets/img/reportForms/aba.png';
import money from '../../assets/img/reportForms/money.png';
import pipay from '../../assets/img/reportForms/pipay.png';
import wing from '../../assets/img/reportForms/wing.png';
import acleda from '../../assets/img/reportForms/acleda.png';
import currentcheck from '../../assets/img/reportForms/currentcheck.png';
import add from '../../assets/img/reportForms/add.png';
import lance from '@/utils/lance';
import reportforms from '@/api/reportforms';
import User from '@/api/user';

export default {
  name: 'Bankcardwithdrawal',

  setup() {
    const $router = useRouter();
    const value1 = ref();
    const { t } = useI18n();
    const showKeyboard1 = ref(false);
    const state = reactive({
      curren: 0,
      hasAccount: true,
      cash: '',
      show: false,
      show1: false,
      add,
      currentAccount: {},
      currentcheck: 0,
      currentcheckImg: currentcheck,
      showContentList: [],
    });
    const back = () => {
      $router.back();
    };
    const confirm = () => {
      if (!state.balance) {
        return Toast(t('reportForms.a29'));
      }
      if (Number(state.balance.replace(/,/g, '')) < 40000) {
        return Toast(t('reportForms.a176'));
      }
      if (JSON.stringify(toRaw(state.currentAccount)) === '{}') {
        Toast(t('reportForms.a174'));
        return $router.push('/reportForms/addacount');
      }
      state.show1 = true;
    };
    const changeCheck = (item, index) => {
      state.currentcheck = index;
      state.currentAccount = item;
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
    const listPlatformAccount = () => {
      reportforms
        .listPlatformAccount({
          appInfo: {},
          data: {
            cashType: 1,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.showContentList = res.data;
            state.hasAccount = res.data.length !== 0;
            state.cash = lance.filterMoney(lance.getJson('user').cash);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getLastPlatformAccount = () => {
      reportforms
        .getLastPlatformAccount({
          appInfo: {},
          data: {
            cashType: 1,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.currentAccount = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const forgetpinEvent = () => {
      if (lance.getJson('user').phone === '') {
        Toast(t('reportForms.a131'));
        return $router.push('/reportForms/settingphone');
      }
      if (!lance.getJson('user').hasPayPwd) {
        Toast(t('reportForms.a173'));
        return $router.push('/reportForms/settingpin');
      }
      $router.push('/reportForms/forgetpin');
    };
    watch(value1, (newVal) => {
      if (newVal.length === 4) {
        const { phone } = lance.getJson('user');
        const balance = Number(state.balance.replace(/,/g, ''));
        reportforms
          .cashOrder({
            appInfo: {},
            data: {
              amount: balance,
              cashTypeCode: state.currentAccount.platformCode,
              platformAccountId: state.currentAccount.id,
              pwd: value1.value,
              cashType: 1,
            },
          })
          .then((res) => {
            if (res && res.code === 200) {
              console.log(res);
              reportforms
                .listAccountCashDetail({
                  appInfo: {},
                  data: {
                    queryType: 3,
                    queryTime: 3,
                    page: 1,
                    pageSize: 20,
                  },
                })
                .then((response) => {
                  if (response && response.code === 200) {
                    $router.push({
                      path: '/reportForms/billdetail',
                      query: {
                        id: response.data.records[0].id,
                      },
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            value1.value = '';
          })
          .catch((err) => {
            value1.value = '';
            console.log(err);
          });
      }
    });
    watch(
      () => state.balance,
      (newValue, oldValue) => {
        const { cash } = lance.getJson('user');
        if (newValue === '' || newValue === '0' || newValue === 0) {
          state.balance = '';
        } else {
          let newMoney = typeof newValue === 'number' ? newValue.toString() : newValue;
          if (Number(newMoney.replace(/,/g, '')) > cash) {
            newMoney = cash.toString();
          }
          const newStr = newMoney
            .replace(/,/g, '')
            .replace(/^0|\D/g, '')
            .replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,');
          state.balance = newStr;
        }
      },
    );
    onMounted(() => {
      listPlatformAccount();
      getLastPlatformAccount();
      console.log('onMounted');
    });
    return {
      t,
      state, // 状态
      showKeyboard1,
      value1,
      back, // 返回
      confirm,
      getLastPlatformAccount,
      listPlatformAccount,
      changeCheck,
      forgetpinEvent,
      getAccountInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.bankcardwithdrawal {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  .addaccount,
  .type {
    width: 710px;
    height: 120px;
    background: #fff;
    border-radius: 10px;
    margin: 20px auto 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 0 30px;
    .icontype1 {
      display: block;
      width: 66px;
      height: 66px;
      margin-right: 27px;
    }
    .icontype {
      display: block;
      width: 80px;
      height: 80px;
      margin-right: 20px;
    }
    .tip {
      min-width: 52px;
      height: 37px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 37px;
      color: #666666;
      margin-right: 6px;
    }
    .iconright {
      display: block;
      width: 44px;
      height: 44px;
    }
    .typename {
      flex: 1;
      height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 42px;
      color: #000000;
    }
  }
  .balance {
    width: 710px;
    min-height: 280px;
    background: #fff;
    border-radius: 10px;
    margin: 20px auto 0;
    box-sizing: border-box;
    padding: 0 30px;
    .title {
      height: 100px;
      width: 100%;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 100px;
      color: #333333;
    }
    .content {
      height: 100px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > span {
        width: 19px;
        height: 90px;
        font-size: 50px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 90px;
        color: #333333;
        margin-right: 26px;
      }
      > input {
        outline: none;
        background: none;
        border: none;
        flex: 1;
        height: 56px;
        font-size: 40px;
        font-family: PingFang SC;
        line-height: 56px;
        color: #000000;
        &::placeholder {
          color: #9e9e9e;
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
        }
      }
      > img {
        display: block;
        width: 32px;
        height: 32px;
      }
    }
    .bor {
      box-shadow: 0px 1px 0px #e5e5e5;
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      min-height: 80px;
      > span {
        min-height: 47px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 47px;
        color: #666666;
        margin-top: 21px;
      }
    }
  }
  .kefu1 {
    position: fixed;
    bottom: 86px;
    left: 0;
    width: 100vw;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      display: block;
      width: 29.43px;
      margin-right: 24px;
    }
    > span {
      min-width: 112px;
      height: 40px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 40px;
      color: #666666;
      text-decoration: underline;
    }
  }
  .showcontent {
    min-height: 689px;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    border-top: 4px solid rgba($color: #000000, $alpha: 0.1);
    .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .item {
        height: 109px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 2px solid #f1f1f2;
        .icon {
          display: block;
          width: 80px;
          height: 80px;
          margin-right: 30px;
        }
        > span {
          flex: 1;
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
          color: #000000;
          opacity: 1;
        }
        .check {
          display: block;
          width: 36px;
          height: 36px;
        }
      }
    }
    .add {
      width: 100%;
      height: 123px;
      box-sizing: border-box;
      padding: 14px 0 29px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > img {
        display: block;
        width: 80px;
        height: 80px;
        margin-right: 30px;
      }
      > span {
        flex: 1;
        height: 40px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40px;
        color: #000000;
      }
    }
  }
  .popup {
    width: 600px;
    height: 421px;
    background: #fff;
    border-radius: 20px;
    color: #333333;
    margin: 308px auto 0;
    .top {
      height: 102px;
      width: 100%;
      border-bottom: 2px solid #e6e6e6;
      box-sizing: border-box;
      position: relative;
      > img {
        position: absolute;
        display: block;
        width: 34px;
        height: 34px;
        top: 34px;
        left: 30px;
        z-index: 10;
      }
      > .title {
        width: 100%;
        text-align: center;
        height: 102px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 102px;
        color: #333333;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      padding: 40px 35px 28px 61px;
      > p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        width: 100%;
        margin-bottom: 15px;
        > span {
          &:first-child {
            height: 40px;
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 40px;
            color: #333333;
          }
          &:last-child {
            height: 48px;
            font-size: 34px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 48px;
            color: #333333;
          }
        }
        .red {
          color: #ff0000 !important;
        }
      }
      .password {
        width: 100%;
        margin: 15px 0 28px 0;
        .van-password-input {
          margin: 0;
          height: 88px;
        }
        :deep(.van-password-input__security) {
          height: 88px !important;
          line-height: 88px !important;
        }
        :deep(.van-password-input__item) {
          width: 88px;
          height: 88px;
          background: rgba(255, 255, 255, 0.39);
          border: 1px solid #c3c3c3;
          opacity: 1;
        }
      }
    }
    .bottom {
      width: 100%;
      min-height: 37px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 37px;
      color: #1173f8;
      text-align: right;
      padding: 0 44px;
      box-sizing: border-box;
    }
  }
}
</style>
