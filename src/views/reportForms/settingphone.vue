<template>
  <div class="settingphone">
    <van-nav-bar :title="$t('reportForms.a50')" left-arrow @click-left="back" />
    <template v-if="state.step === 1 || state.step === 2">
      <div class="stepbox">
        <div class="step">
          <span v-if="state.step === 2" :class="state.step === 1 ? 'color333' : ''" @click="state.step = 1">{{ $t('reportForms.a74') }}</span>
          <span v-else :class="state.step === 1 ? 'color333' : ''">{{ $t('reportForms.a74') }}</span>
          <span class="color333 center">></span>
          <span :class="state.step === 2 ? 'color333' : ''">{{ $t('msg.a15') }}</span>
        </div>
        <div v-if="state.step === 1" class="step1">
          <p class="title">{{ $t('reportForms.a2') }}</p>
          <div class="phone">
            <span>{{ $t('reportForms.a79') }}</span>
            <div class="right">
              <van-field v-model="state.phone" type="digit" maxlength="10" :placeholder="$t('reportForms.a74')" />
            </div>
          </div>
          <div class="stepbtn1" :class="state.phone ? 'stepbtnshow1' : ''" @click="stepEvent1">{{ $t('msg.a13') }}</div>
        </div>
        <div v-if="state.step === 2" class="step2">
          <p>{{ $t('msg.a18') }}</p>
          <div class="codebox">
            <span>{{ $t('msg.a19') }}</span>
            <van-field v-model="state.code" type="digit" maxlength="4" :placeholder="$t('msg.a20')" />
            <div v-if="state.flag" class="getBtn" @click="getCode">{{ $t('msg.a21') }}</div>
            <div v-else class="getBtn1">{{ state.time }}s</div>
          </div>
          <div class="public_btn" :class="state.code ? '' : 'bgcolore7'" style="margin-top: 44px" @click="stepEvent2">{{ $t('msg.a13') }}</div>
        </div>
        <div class="kefu1">
          <img src="@/assets/img/reportForms/kefu.png" alt="#" />
          <span @click="$router.push('/reportForms/service')">{{ $t('msg.a11') }}</span>
        </div>
      </div>
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
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import reportforms from '@/api/reportforms';
import lance from '@/utils/lance';
import check from '@/assets/img/reportForms/check.png';
import uncheck from '@/assets/img/reportForms/uncheck.png';
import User from '@/api/user';

export default {
  name: 'Settingphone',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      step: 1,
      isCheck: false,
      phone: ref(),
      code: ref(),
      flag: ref(true),
      issend: true,
      time: ref(120),
      password1: ref(),
      password2: ref(),
      check,
      uncheck,
    });
    let timefn = null;
    const back = () => {
      $router.back();
      clearInterval(timefn);
      if (!state.flag && !state.issend) {
        const obj = {
          page: 'settingphone',
          time: state.time,
          currentTime: new Date().getTime(),
        };
        lance.setJson('timephone', obj);
      }
    };
    const getCode = () => {
      reportforms
        .createCode({
          appInfo: {
            channel: lance.getData('channel'),
            appId: 'test',
            platform: 'web',
            imei: lance.randomString(6),
          },
          data: {
            model: '14',
            phone: state.phone.toString(),
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.flag = false;
            state.issend = false;
            state.time = 120;
            timefn = setInterval(() => {
              if (state.time === 0) {
                clearInterval(timefn);
                state.flag = true;
                state.issend = true;
                state.time = 120;
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
    const stepEvent1 = () => {
      const flag = lance.checkPhoneKHR(state.phone);
      if (!flag) {
        return Toast(t('reportForms.a84')); // 手机号码只能是数字
      }
      if (state.phone.toString().length === 8 && state.phone.toString().slice(0, 1) === '0') {
        return Toast(t('reportForms.a85')); // 第一位不能为0
      }
      if (state.phone.toString().length < 8 || state.phone.toString().length > 10) {
        return Toast(t('reportForms.a86')); // 手机号码长度应为8-10位
      }
      if (state.phone.toString().length === 10 && state.phone.toString().slice(0, 1) !== '0') {
        return Toast(t('reportForms.a87')); // 手机号码第一位应为0
      }
      state.step = 2;
      getCode();
    };
    const stepEvent2 = () => {
      if (!state.code) {
        return;
      }
      reportforms
        .bindPhone({
          appInfo: {
            channel: lance.getData('channel'),
            appId: 'test',
            platform: 'web',
          },
          data: {
            model: '14',
            phone: state.phone.toString(),
            code: state.code.toString(),
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            getAccountInfo();
            state.step = 3;
            state.issend = true;
            state.flag = true;
          } else {
            state.code = '';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    onMounted(() => {
      const obj = lance.getJson('timephone');
      if (obj) {
        if (obj.page !== 'settingphone') {
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
              state.flag = true;
              state.issend = true;
              state.time = 120;
            } else {
              state.time--;
            }
          }, 1000);
        } else {
          lance.clearStorage('timephone');
        }
      }
    });
    return {
      t,
      state, // 状态
      timefn,
      back, // 返回
      getCode, // 获取验证码
      stepEvent1,
      stepEvent2,
      getAccountInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.settingphone {
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
    border-bottom: 2px solid #999999;
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
  .stepbox {
    margin-top: 20px;
    width: 100vw;
    height: calc(100vh - 107px);
    background: #fff;
    .step {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 57px 0 0;
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
    > .step1 {
      width: 100vw;
      box-sizing: border-box;
      padding: 0 50px 0 70px;
      height: auto;
      .title {
        width: 100%;
        text-align: left;
        min-height: 42px;
        font-size: 30px;
        font-family: PingFang SC;
        line-height: 42px;
        color: #ff0000;
        margin: 104px auto 50px;
      }
      > .phone {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        > span {
          min-width: 128px;
          height: 45px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 45px;
          color: #333333;
          margin-right: 20px;
        }
        > .right {
          flex: 1;
          height: 85px;
          border-bottom: 2px solid #999999;
          display: flex;
          align-items: center;
          > input {
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
      }
      > .stepbtn1 {
        width: 600px;
        height: 94px;
        line-height: 94px;
        background: #e7e7e7;
        border-radius: 49px;
        font-size: 29px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
        text-align: center;
        margin: 90px auto 0;
      }
      .stepbtnshow1 {
        color: #fff;
        background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
      }
    }
    > .step2 {
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
        min-height: 84px;
        > span {
          min-width: 96px;
          height: 45px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 45px;
          color: #333333;
          margin-right: 55px;
        }
        > input {
          border: none;
          outline: none;
          background: none;
          // letter-spacing: 10px;
          width: 280px;
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
          min-height: 60px;
          background: #2284ef;
          border: 1px solid #2284ef;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 60px;
          border-radius: 10px;
          text-align: center;
          color: #ffffff;
          margin-left: 15px;
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
