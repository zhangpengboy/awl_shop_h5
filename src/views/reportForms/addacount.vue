<template>
  <div class="addacount">
    <van-nav-bar :title="$t('reportForms.a24')" left-arrow @click-left="back" />
    <template v-if="state.step === 1 || state.step === 2">
      <div class="step">
        <span v-if="state.step === 2" :class="state.step === 1 ? 'color333' : ''" @click="state.step = 1">{{ $t('reportForms.a1') }}</span>
        <span v-else :class="state.step === 1 ? 'color333' : ''">{{ $t('reportForms.a1') }}</span>
        <span class="color333 center">></span>
        <span :class="state.step === 2 ? 'color333' : ''">{{ $t('msg.a15') }}</span>
      </div>
      <!-- 输入账户信息 -->
      <div v-if="state.step === 1" class="step1">
        <div class="item" @click="state.sheetshow = true">
          <span>{{ $t('reportForms.a3') }}</span>
          <van-field id="" v-model="state.platformCode" type="text" name="" :placeholder="$t('reportForms.a7')" disabled />
          <img src="@/assets/img/reportForms/bottom1.png" alt="#" />
        </div>
        <div class="item">
          <span>{{ $t('reportForms.a4') }}</span>
          <van-field v-model="state.cardNo" type="digit" maxlength="20" :placeholder="$t('reportForms.a8')" />
        </div>
        <div class="item bor">
          <span>{{ $t('reportForms.a5') }}</span>
          <van-field v-model="state.sureCardNo" type="digit" maxlength="20" :placeholder="$t('reportForms.a9')" />
        </div>
        <div class="item">
          <span>{{ $t('reportForms.a6') }}</span>
          <van-field id="" v-model="state.name" type="text" name="" :placeholder="$t('reportForms.a10')" />
        </div>
        <div class="public_btn" style="margin-top: 43px" @click="stepConfirm1">{{ $t('msg.a13') }}</div>
      </div>
      <!-- 输入验证码 -->
      <div v-if="state.step === 2" class="step2">
        <p>{{ $t('msg.a18') }}</p>
        <div class="codebox">
          <span>{{ $t('msg.a19') }}</span>
          <input v-model="state.code" type="text" />
          <div v-if="state.flag" class="getBtn" @click="getCode">{{ $t('msg.a21') }}</div>
          <div v-else class="getBtn1">{{ state.time }}s</div>
        </div>
        <div class="public_btn" :class="state.code ? '' : 'bgcolore7'" style="margin-top: 44px" @click="stepConfirm2">{{ $t('msg.a13') }}</div>
      </div>
      <van-overlay :show="state.show" @click="state.show = false">
        <div class="wrapper" @click.stop>
          <div class="popup">
            <div class="top">
              <img src="@/assets/img/reportForms/close.png" alt="" @click.stop="state.show = false" />
              <div class="title">{{ $t('reportForms.a15') }}</div>
            </div>
            <div class="content">
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
      <!-- 选择取款账户 -->
      <van-action-sheet v-model:show="state.sheetshow" :title="$t('reportForms.a7')">
        <div class="showcontent">
          <div class="list">
            <div v-for="(item, index) in state.showContentList" :key="index" class="item" @click="changeCheck(item, index)">
              <img class="icon" :src="item.icon" alt="#" />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </template>
    <template v-else>
      <div class="successful">
        <div class="sceeuss">
          <img src="../../assets/img/reportForms/successful.png" alt="" />
          <span>{{ $t('reportForms.a18') }}</span>
        </div>
        <div class="public_btn" style="margin-top: 21px" @click="back">{{ $t('msg.a42') }}</div>
      </div>
    </template>

    <div class="kefu1">
      <img src="@/assets/img/reportForms/kefu.png" alt="#" />
      <span @click="$router.push('/reportForms/service')">{{ $t('msg.a11') }}</span>
    </div>
  </div>
</template>

<script>
import { ref, watch, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import reportforms from '@/api/reportforms';
import lance from '@/utils/lance';
import wingimg from '@/assets/img/reportForms/wing.png';
import abaimg from '@/assets/img/reportForms/aba.png';
import acledaimg from '@/assets/img/reportForms/acleda.png';
import moneyimg from '@/assets/img/reportForms/money.png';

export default {
  name: 'Addacount',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      curren: 0,
      step: 1,
      show: false,
      sheetshow: false,
      showPicker: false,
      platformCode: '',
      platformCodes: '',
      cardNo: '',
      name: '',
      sureCardNo: '',
      pwd: '',
      columns: ['Wing', 'ABA', 'ACLEDA', 'TrueMoney'],
      // columns: ['ABA', 'AC', 'Pipay', 'Wing','IpayBaba','PayGo'],
      code: ref(),
      flag: ref(true),
      issend: true,
      time: ref(120),
      showContentList: [],
    });
    let timefn = null;
    const value1 = ref();
    const showKeyboard1 = ref(false);
    const onInput1 = () => {
      console.log(value1, 'oninput');
    };
    const onDelete1 = () => {
      console.log(value1, 'delete1');
    };
    const back = () => {
      $router.back();
      clearInterval(timefn);
      if (!state.flag && !state.issend) {
        const obj = {
          page: 'addacount',
          time: state.time,
          currentTime: new Date().getTime(),
        };
        lance.setJson('timeadd', obj);
      }
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
    const stepConfirm1 = () => {
      if (!state.platformCode) {
        return Toast(t('reportForms.a7')); // 请选择开户银行
      }
      if (!state.cardNo) {
        return Toast(t('reportForms.a8')); // 请输入账户号码
      }
      if (!state.sureCardNo) {
        return Toast(t('reportForms.a9')); // 请再次输入账户号码
      }
      if (!state.name) {
        return Toast(t('reportForms.a10')); // 请输入账户姓名
      }
      if (state.cardNo.toString().length < 7 || state.cardNo.toString().length > 20) {
        return Toast(t('reportForms.a23')); // 账户号码长度为7~20位
      }
      if (state.cardNo !== state.sureCardNo) {
        return Toast(t('reportForms.a22')); // 号码不一致
      }
      if (state.name.toString().length < 3 || state.name.toString().length > 40) {
        return Toast(t('reportForms.a23')); // 账户姓名长度为3~40位
      }
      if (lance.getJson('user').phone === '') {
        Toast(t('reportForms.a131'));
        return $router.push('/reportForms/settingphone');
      }
      if (lance.getJson('user').hasPayPwd === 0) {
        Toast(t('reportForms.a173'));
        return $router.push('/reportForms/settingpin');
      }
      state.step = 2;
    };
    const stepConfirm2 = () => {
      if (!state.code) {
        return;
      }
      const { phone } = lance.getJson('user');
      if (phone === '') {
        $router.push('/reportForms/settingphone');
      }
      reportforms
        .judge({
          appInfo: {
            channel: lance.getData('channel'),
            appId: 'test',
            platform: 'web',
            imei: lance.randomString(6),
          },
          data: {
            model: '13',
            phone,
            code: state.code,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.show = true;
            state.flag = true;
            state.issend = true;
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
            cashType: 1,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.showContentList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const changeCheck = (item) => {
      state.sheetshow = false;
      state.platformCode = item.name;
      state.platformCodes = item.platformCode;
    };
    const getCode = () => {
      const { phone } = lance.getJson('user');
      if (phone === '') {
        $router.push('/reportForms/settingphone');
      }
      reportforms
        .createCode({
          appInfo: {
            channel: lance.getData('channel'),
            appId: 'test',
            platform: 'web',
            imei: lance.randomString(6),
          },
          data: {
            model: '13',
            phone: phone.toString(),
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.time = 120;
            state.flag = false;
            state.issend = false;
            const timefn = setInterval(() => {
              if (state.time === 0) {
                clearInterval(timefn);
                state.time = 120;
                state.issend = true;
                state.flag = true;
              } else {
                state.time--;
              }
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    watch(value1, (newVal) => {
      console.log(newVal);
      if (newVal.length === 4) {
        reportforms
          .addPayPlatformAccount({
            appInfo: {
              channel: lance.getData('channel'),
              appId: 'test',
              platform: 'web',
              imei: lance.randomString(6),
            },
            data: {
              platformCode: state.platformCodes,
              cardNo: state.cardNo,
              name: state.name,
              sureCardNo: state.sureCardNo,
              pwd: value1.value,
            },
          })
          .then((response) => {
            if (response && response.code === 200) {
              state.show = false;
              state.step = 3;
            }
            value1.value = '';
          })
          .catch((err) => {
            value1.value = '';
            console.log(err);
          });
      }
    });
    onMounted(() => {
      getlistPayCashType();
      const obj = lance.getJson('timeadd');
      if (obj) {
        if (obj.page !== 'addacount') {
          return;
        }
        const time = new Date().getTime() - obj.currentTime;
        const newTime = Math.round(time / 1000);
        if (obj.time - newTime > 0) {
          state.time = obj.time - newTime;
          state.flag = false;
          state.issend = false;
          timefn = setInterval(() => {
            if (state.time === 0) {
              clearInterval(timefn);
              state.time = 120;
              state.flag = true;
              state.issend = true;
            } else {
              state.time--;
            }
          }, 1000);
        } else {
          lance.clearStorage('timeadd');
        }
      }
    });
    return {
      t,
      state, // 状态
      timefn,
      value1,
      showKeyboard1,
      back, // 返回
      stepConfirm1,
      stepConfirm2,
      getlistPayCashType,
      changeCheck,
      getCode,
      onInput1,
      onDelete1,
      forgetpinEvent,
    };
  },
};
</script>

<style lang="scss" scoped>
.addacount {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  :deep(.van-field, .van-cell) {
    flex: 1;
    height: 85px;
    box-sizing: border-box;
    padding: 0;
    input {
      margin-top: 20px;
      width: 100%;
      text-indent: 11px;
      height: 40px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 40px;
      color: #333333;
      border: none;
      outline: none;
      letter-spacing: 2px;
      background: none;
      &::placeholder {
        color: #999999;
      }
    }
  }
  .step {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 51px 0 33px;
    > span {
      height: 37px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 37px;
      color: #999999;
      opacity: 1;
    }
    .center {
      margin: 0 40px;
    }
    .color333 {
      color: #333333;
    }
  }
  .step1 {
    width: 710px;
    height: 400px;
    background: #fff;
    opacity: 1;
    border-radius: 10px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0 30px;
    > .item {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > span {
        min-width: 60px;
        height: 42px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 42px;
        color: #000000;
        margin-right: 25px;
      }
      > input {
        border: none;
        outline: none;
        background: none;
        flex: 1;
        height: 37px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 37px;
        color: #000000;
        &::placeholder {
          color: #9e9e9e;
        }
      }
      > img {
        display: block;
        width: 24px;
        height: 24px;
      }
    }
    .bor {
      box-shadow: 0px 1px 0px #e5e5e5;
    }
  }
  .step2 {
    width: 100vw;
    box-sizing: border-box;
    padding: 72px 56px 88px 68px;
    > p {
      width: 100%;
      min-height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 42px;
      color: #333333;
      margin-bottom: 39px;
    }
    .codebox {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 84px;
      > span {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 45px;
        color: #333333;
        margin-right: 25px;
        min-width: 96px;
        min-height: 45px;
      }
      > input {
        border: none;
        outline: none;
        background: none;
        flex: 1;
        height: 84px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 600;
        border-bottom: 1px solid #f5f6fa;
        margin-right: 15px;
      }
      .getBtn,
      .getBtn1 {
        width: 180px;
        min-height: 45px;
        background: #2284ef;
        border: 1px solid #2284ef;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 45px;
        border-radius: 10px;
        text-align: center;
        color: #ffffff;
      }
      .getBtn1 {
        background: #e7e7e7 !important;
        border: none !important;
      }
    }
    .bgcolore7 {
      background: #e7e7e7;
    }
  }
  .showcontent {
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
    height: auto;
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
  .successful {
    .sceeuss {
      margin-top: 20px;
      width: 100vw;
      height: 272px;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      > img {
        display: block;
        width: 80px;
        height: 80px;
        margin: 47px 0 37px 0;
      }
      > span {
        min-width: 156px;
        height: 50px;
        font-size: 36px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 50px;
        color: #333333;
      }
    }
  }
}
</style>
