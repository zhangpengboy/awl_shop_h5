<template>
  <div class="offlinewithdrawal">
    <van-nav-bar :title="$t('reportForms.a93')" left-arrow @click-left="back" />
    <template v-if="state.step === 1">
      <div class="top">
        <div class="phone bor">
          <span>{{ $t('reportForms.a94') }}</span>
          <input v-model="state.phoneNumber" type="number" :placeholder="$t('reportForms.a162')" />
          <span class="confirm" @click="blurEvent">{{ $t('msg.a24') }}</span>
        </div>
        <p class="name">{{ $t('reportForms.a96') }}{{ state.phoneName }}</p>
        <p class="red">{{ $t('reportForms.a97') }}</p>
      </div>
      <div class="balance">
        <p class="title">{{ $t('reportForms.a98') }}</p>
        <div class="content bor">
          <span>៛</span>
          <input v-model="state.balance" class="number" :placeholder="$t('reportForms.a29')" />
          <img class="icondelete" src="../../assets/img/reportForms/iconDelete.png" alt="#" @click="state.balance = ''" />
        </div>
        <div class="bottom">
          <span>{{ $t('reportForms.a30', { cash: state.cash }) }}</span>
        </div>
      </div>
      <div class="btn" @click="confirm">{{ $t('reportForms.a99') }}</div>
    </template>
    <template v-else>
      <div class="type1">
        <span class="number">{{ $t('reportForms.a100') }}</span>
        <span class="txt">{{ $t('reportForms.a101') }}</span>
      </div>
      <div class="top1">
        <div>
          <span>{{ $t('reportForms.a34') }}</span>
          <span>{{ state.balance }}</span>
        </div>
        <div>
          <span>{{ $t('reportForms.a102') }}</span>
          <span>{{ state.phoneNumber }}</span>
        </div>
        <div>
          <span>{{ $t('reportForms.a103') }}</span>
          <span>{{ state.phoneName }}</span>
        </div>
        <div>
          <span>{{ $t('reportForms.a104') }}</span>
          <span>{{ state.youNumber }}</span>
        </div>
      </div>
      <div class="btn1" @click="back">{{ $t('msg.a24') }}</div>
    </template>
    <van-overlay :show="state.show" @click="state.show = false">
      <div class="wrapper" @click.stop>
        <div class="popup">
          <div class="top">
            <img src="@/assets/img/reportForms/close.png" alt="" @click.stop="state.show = false" />
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
import { ref, watch, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import lance from '@/utils/lance';
import reportforms from '@/api/reportforms';
import User from '@/api/user';

export default {
  name: 'Offlinewithdrawal',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      curren: 0,
      balance: '',
      cash: 0,
      step: 1,
      phoneNumber: '',
      phoneName: '',
      youNumber: '',
      show: ref(false),
    });
    const value1 = ref();
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
    const blurEvent = () => {
      getShopData(state.phoneNumber);
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
    const confirm = () => {
      // 填写手机号码
      // 请先点击确定获取店主
      // 请输入取款金额
      // 取款金额不能小于1000
      const balance = Number(state.balance.replace(/,/g, ''));
      if (state.phoneNumber === '') {
        return Toast(t('reportForms.a162'));
      }
      if (!state.phoneName) {
        return Toast(t('reportForms.a171'));
      }
      if (!balance) {
        return Toast(t('reportForms.a98'));
      }
      if (balance < 1000) {
        return Toast(t('reportForms.a175'));
      }
      const isHasPayPwd = lance.getJson('user').hasPayPwd;
      if (isHasPayPwd === 0) {
        Toast(t('reportForms.a105'));
        return $router.push('/reportForms/settingpin');
      }
      state.show = true;
    };
    const getShopData = (phone) => {
      reportforms
        .getNetshopInfo({
          appInfo: {},
          data: {
            shopPhone: phone,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.phoneName = res.data.nickname;
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
    watch(value1, (newVal) => {
      if (newVal.length === 4) {
        const balance = Number(state.balance.replace(/,/g, ''));
        reportforms
          .withdrawFromShop({
            appInfo: {},
            data: {
              shopPhone: state.phoneNumber,
              amount: balance,
              payPwd: value1.value,
            },
          })
          .then((res) => {
            if (res && res.code === 200) {
              console.log(res);
              state.step = 2;
              state.show = false;
            }
            if (res.code === 1124) {
              $router.push('/reportForms/settingpin');
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
      getAccountInfo();
      state.cash = lance.filterMoney(lance.getJson('user').cash);
      state.youNumber = lance.getJson('userNumber') || lance.getJson('user').name;
      console.log('onMounted');
    });
    return {
      t,
      state, // 状态
      value1,
      showKeyboard1,
      onInput1,
      onDelete1,
      confirm,
      back, // 返回
      blurEvent,
      getShopData,
      forgetpinEvent,
      getAccountInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.offlinewithdrawal {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  .top {
    width: 710px;
    height: 230px;
    background: #fff;
    border-radius: 10px;
    margin: 20px auto 0;
    box-sizing: border-box;
    padding: 0 30px;
    .phone {
      width: 100%;
      min-height: 100px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > span {
        min-width: 120px;
        min-height: 42px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 42px;
        color: #000000;
        margin-right: 30px;
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
      .confirm {
        height: 60px;
        background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
        border-radius: 5px;
        line-height: 60px;
        text-align: center;
        font-size: 30px;
        font-family: PingFangSC-Semibold;
        color: #ffffff;
        margin: 0;
      }
    }
    .bor {
      box-shadow: 0px 1px 0px #e5e5e5;
    }
    .name {
      width: 100%;
      min-height: 40px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 40px;
      color: #666666;
      margin-top: 16px;
    }
    .red {
      margin-top: 16px;
      height: 40px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 30px;
      color: #e27989;
      opacity: 1;
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
        flex: 1;
        height: 56px;
        font-size: 40px;
        font-family: PingFang SC;
        line-height: 56px;
        font-weight: normal;
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
        min-width: 159px;
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
        padding: 10px 0;
      }
      .all {
        height: 40px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40px;
        color: #2284ef;
      }
    }
  }
  .btn {
    width: 600px;
    height: 94px;
    background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
    border-radius: 44px;
    line-height: 94px;
    margin: 74px auto 0;
    text-align: center;
    font-size: 34px;
    font-family: PingFangSC-Semibold;
    color: #ffffff;
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

  .type1 {
    width: 710px;
    height: 270px;
    background: #fff;
    border-radius: 10px;
    margin: 20px auto 2px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .number {
      margin: 72px 0 14px 0;
      min-width: 248px;
      height: 90px;
      font-size: 64px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 90px;
      color: #333333;
    }
    .text {
      min-width: 330px;
      height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 42px;
      color: #666666;
    }
  }
  .top1 {
    width: 710px;
    min-height: 360px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 33px 29px 39px 25px;
    margin: 20px auto 0px;
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
          text-align: right;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .btn1 {
    width: 600px;
    height: 94px;
    background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
    opacity: 1;
    border-radius: 44px;
    font-size: 34px;
    font-family: PingFangSC-Semibold;
    line-height: 94px;
    color: #ffffff;
    text-align: center;
    margin: 68px auto 0;
  }
}
</style>
