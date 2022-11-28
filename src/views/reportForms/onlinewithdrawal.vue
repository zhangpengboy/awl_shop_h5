<template>
  <div class="onlinewithdrawal">
    <div>
      <van-nav-bar :title="$t('reportForms.a106')" left-arrow @click-left="back" />
    </div>
    <div class="type">
      <img class="icontype" :src="state.currentAccount.icon" alt="#" />
      <span class="typename">{{ state.currentAccount.name }}</span>
    </div>
    <div class="phone">
      <span>{{ $t('reportForms.a79') }}</span>
      <van-field v-model="state.phoneNumber" type="text" :placeholder="$t('reportForms.a74')" />
    </div>
    <div class="balance">
      <p class="title">{{ $t('reportForms.a28') }}</p>
      <div class="content bor">
        <span>៛</span>
        <van-field v-model="state.balance" :placeholder="$t('reportForms.a29')" />
        <img class="icondelete" src="../../assets/img/reportForms/iconDelete.png" alt="#" @click="clearbalance" />
      </div>
      <div class="bottom">
        <span>{{ $t('reportForms.a107', { cash: state.cash }) }}</span>
        <span class="all" @click="state.balance = state.cash">{{ $t('reportForms.a108') }}</span>
      </div>
    </div>
    <div class="account">
      <p class="title">{{ $t('reportForms.a64') }}</p>
      <div class="content bor">
        <span>៛</span>
        <van-field v-model="state.account" class="number" disabled :placeholder="$t('reportForms.a28')" />
        <span class="charge">{{ $t('reportForms.a109', { handingFree: state.handingFree }) }}</span>
      </div>
      <div class="bottom1">
        <img :src="state.isCheck ? state.check : state.uncheck" alt="" @click="state.isCheck = !state.isCheck" />
        <span>{{ $t('reportForms.a110') }}</span>
      </div>
    </div>
    <div v-if="state.phoneNumber && state.balance && state.isCheck" class="btn" @click="confirmWithdrawal">{{ $t('reportForms.a111') }}</div>
    <div v-else class="btn hide">{{ $t('reportForms.a111') }}</div>
    <!-- 选择取款账户 -->
    <van-action-sheet v-model:show="state.show" :title="$t('reportForms.a32')">
      <div class="showcontent">
        <div class="list">
          <div v-for="(item, index) in state.showContentList" :key="index" class="item" @click="changeCheck(item, index)">
            <img class="icon" :src="item.img" alt="#" />
            <span>{{ item.platformCode }}</span>
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
              <span>{{ $t('reportForms.a28') }}</span>
              <span>៛{{ state.balance }}</span>
            </p>
            <p>
              <span>{{ $t('reportForms.a63') }}</span>
              <span>៛{{ state.handingFree }}</span>
            </p>
            <p>
              <span>{{ $t('reportForms.a33') }}</span>
              <span class="red">៛{{ state.account }}</span>
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
import check from '@/assets/img/reportForms/check.png';
import uncheck from '@/assets/img/reportForms/uncheck.png';
import lance from '@/utils/lance';
import reportforms from '@/api/reportforms';
import currentcheck from '../../assets/img/reportForms/currentcheck.png';
import User from '@/api/user';

export default {
  name: 'Onlinewithdrawal',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      curren: 0,
      isCheck: false,
      show: ref(false),
      show1: ref(false),
      phoneNumber: null,
      balance: ref('0'),
      account: ref(0),
      check,
      uncheck,
      hasAccount: false,
      showContentList: [],
      currentAccount: {},
      cash: 0,
      handingFree: 0,
      currentcheck: 0,
      currentcheckImg: currentcheck,
    });
    const handlingFeeRules = ref();
    const value1 = ref('0');
    const showKeyboard1 = ref(false);
    const onInput1 = () => {
      console.log(value1);
    };
    const onDelete1 = () => {
      console.log(value1, 'delete1');
    };
    const back = () => {
      $router.back();
    };
    const moneyBlur = () => {
      state.balance = Number(state.balance) < 400000 ? 400000 : Number(state.balance);
      const arr = toRaw(handlingFeeRules.value);
      const num = state.balance;
      let commission = 0;
      if (num > arr[arr.length - 1].max) {
        commission = arr[arr.length - 1].commission;
      } else {
        arr.forEach((item) => {
          if (item.min < num && item.max >= num) {
            commission = item.commission;
          }
        });
      }
      state.handingFree = (num * commission) / 100;
      state.account = num - state.handingFree;
    };
    const clearbalance = () => {
      state.balance = 0;
      state.handingFree = 0;
      state.account = 0;
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
    const getlistPayCashType = () => {
      reportforms
        .listPayCashType({
          appInfo: {},
          data: {
            cashType: 2,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.showContentList = res.data;
            state.currentAccount = res.data && res.data.length > 0 ? res.data[0] : {};
            handlingFeeRules.value = res.data[0].handlingFeeRules;
            state.hasAccount = res.data.length !== 0;
            state.cash = lance.filterMoney(lance.getJson('user').cash);
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
    const confirmWithdrawal = () => {
      console.log(state.phoneNumber.toString());
      const flag = lance.checkPhoneKHR(state.phoneNumber);
      if (!flag) {
        return Toast(t('reportForms.a84')); // 手机号码只能是数字
      }
      if (state.phoneNumber.toString().length === 8 && state.phoneNumber.toString().slice(0, 1) === '0') {
        return Toast(t('reportForms.a85')); // 第一位不能为0
      }
      if (state.phoneNumber.toString().length < 8 || state.phoneNumber.toString().length > 10) {
        return Toast(t('reportForms.a86')); // 手机号码长度应为8-10位
      }
      if (state.phoneNumber.toString().length === 10 && state.phoneNumber.toString().slice(0, 1) !== '0') {
        return Toast(t('reportForms.a87')); // 手机号码第一位应为0
      }
      if (state.balance === 0 || state.balance === '0') {
        return Toast(t('reportForms.a112'));
      }
      if (Number(state.balance.replace(/,/g, '')) < 40000) {
        return Toast(t('reportForms.a176'));
      }
      if (!state.isCheck) {
        return Toast(t('reportForms.a113'));
      }
      state.show1 = true;
    };
    watch(value1, (newVal) => {
      console.log(newVal, 'newvalue');
      if (newVal.length === 4) {
        const { phone } = lance.getJson('user');
        const balance = Number(state.balance.replace(/,/g, ''));
        reportforms
          .cashOrder({
            appInfo: {},
            data: {
              amount: balance,
              cashTypeCode: state.currentAccount.code,
              platformAccountId: 'test',
              pwd: value1.value,
              phone: state.phoneNumber,
              cashType: 2,
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
        let num = Number(state.balance.replace(/,/g, ''));
        if (num > cash) {
          num = cash;
        }
        const arr = toRaw(handlingFeeRules.value);
        let commission = 0;
        if (num > arr[arr.length - 1].max) {
          commission = arr[arr.length - 1].commission;
        } else {
          arr.forEach((item) => {
            if (item.min < num && item.max >= num) {
              commission = item.commission;
            }
          });
        }
        state.handingFree = lance.filterMoney(commission);
        if (num + commission < cash) {
          state.account = lance.filterMoney(num);
        } else {
          state.account = lance.filterMoney(num - commission);
        }
      },
    );
    onMounted(() => {
      getAccountInfo();
      getlistPayCashType();
    });
    return {
      t,
      state, // 状态
      value1,
      showKeyboard1,
      onInput1,
      onDelete1,
      back, // 返回
      forgetpinEvent,
      moneyBlur,
      clearbalance,
      changeCheck,
      confirmWithdrawal,
      getlistPayCashType,
      getAccountInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.onlinewithdrawal {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  :deep(.van-field, .van-cell) {
    flex: 1;
    height: 99px;
    box-sizing: border-box;
    padding: 0;
    input {
      width: 100%;
      margin-top: 22px;
      height: 56px;
      font-size: 40px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 56px;
      letter-spacing: 2px;
      color: #000000;
      font-weight: bold;
      border: none;
      outline: none;
      background: none;
      &::placeholder {
        color: #9e9e9e;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40px;
      }
    }
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
      width: 52px;
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
  .phone {
    width: 710px;
    height: 100px;
    background: #fff;
    border-radius: 10px;
    margin: 20px auto 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 0 30px;
    > span {
      min-width: 120px;
      height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 42px;
      color: #000000;
      margin-right: 20px;
    }
    > input {
      background: none;
      outline: none;
      border: none;
      flex: 1;
      height: 37px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 37px;
      color: #000000;
      &::placeholder {
        color: #9e9e9e;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40px;
      }
    }
  }
  .balance,
  .account {
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
        height: 56px;
        font-size: 50px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 56px;
        color: #333333;
        opacity: 1;
        margin-right: 26px;
      }
      > input {
        outline: none;
        background: none;
        border: none;
        width: 300px;
        height: 56px;
        font-size: 40px;
        flex: 1;
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
      .charge {
        width: auto;
        display: block;
        height: 47px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 47px;
        color: #666666;
      }
    }
    .bor {
      box-shadow: 0px 1px 0px #e5e5e5;
    }
  }
  .balance {
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
      }
      .all {
        min-height: 40px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40px;
        color: #2284ef;
      }
    }
  }
  .account {
    margin-bottom: 65px;
    .bottom1 {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      height: 117px;
      box-sizing: border-box;
      padding: 20px 0 30px 0;
      > img {
        display: block;
        width: 28px;
        height: 28px;
        margin-right: 11px;
      }
      span {
        flex: 1;
        min-height: 30px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 30px;
        color: #e27989;
      }
    }
  }
  .btn {
    width: 600px;
    height: 94px;
    background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
    border-radius: 44px;
    line-height: 94px;
    margin: 0 auto 0;
    text-align: center;
    font-size: 34px;
    font-family: PingFangSC-Semibold;
    color: #ffffff;
  }
  .hide {
    background: #e7e7e7;
    color: #333333;
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
    height: 545px;
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
      height: 37px;
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
