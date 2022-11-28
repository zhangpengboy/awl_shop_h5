<template>
  <div class="settingpin">
    <van-nav-bar :title="$t('reportForms.a115')" left-arrow @click-left="back" />
    <template v-if="!state.success">
      <div class="box">
        <div v-if="!state.hasPin" class="type1">
          <div class="title">{{ $t('reportForms.a13') }}</div>
          <div class="tip">
            <span class="dange">!</span>
            <span class="tips">{{ $t('reportForms.a80') }}</span>
          </div>
          <div class="inputbox">
            <div>
              <span>PIN</span>
              <div class="right">
                <van-field v-model="state.password1" type="password" maxlength="4" :placeholder="$t('reportForms.a83')" />
              </div>
            </div>
            <div>
              <span>{{ $t('msg.a22') }}</span>
              <div class="right">
                <van-field v-model="state.password2" type="password" maxlength="4" :placeholder="$t('reportForms.a83')" />
              </div>
            </div>
            <div class="wangji"></div>
          </div>
          <div v-if="state.password1 && state.password2 && state.password1.length === 4 && state.password2.length === 4" class="createdbtn" :class="state.password1 && state.password2 ? 'createdbtnshow' : ''" @click="confirm1">
            {{ $t('reportForms.a14') }}
          </div>
          <div v-else class="createdbtn">{{ $t('reportForms.a14') }}</div>
        </div>
        <div v-else class="type2">
          <div class="title">{{ $t('reportForms.a75') }}</div>
          <div class="inputbox">
            <div>
              <span>{{ $t('reportForms.a137') }}</span>
              <div class="right">
                <van-field v-model="state.editpassword1" type="password" maxlength="4" :placeholder="$t('reportForms.a83')" />
                <span @click="$router.push('/reportForms/forgetpin')">{{ $t('reportForms.a17') }}?</span>
              </div>
            </div>
            <div>
              <span>{{ $t('reportForms.a138') }}</span>
              <div class="right">
                <van-field v-model="state.editpassword2" type="password" maxlength="4" :placeholder="$t('reportForms.a83')" />
              </div>
            </div>
            <div>
              <span>{{ $t('reportForms.a139') }}</span>
              <div class="right">
                <van-field v-model="state.editpassword3" type="password" maxlength="4" :placeholder="$t('reportForms.a83')" />
              </div>
            </div>
          </div>
          <div v-if="state.editpassword1 && state.editpassword2 && state.editpassword3 && state.editpassword1.length === 4 && state.editpassword2.length === 4 && state.editpassword3.length === 4" class="createdbtn createdbtnshow" @click="confirm2">
            {{ $t('reportForms.a140') }}
          </div>
          <div v-else class="createdbtn" @click="confirm2">{{ $t('reportForms.a140') }}</div>
        </div>
      </div>
      <div class="kefu1">
        <img src="@/assets/img/reportForms/kefu.png" alt="#" />
        <span @click="$router.push('/reportForms/service')">{{ $t('msg.a11') }}</span>
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
  name: 'Settingpin',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      curren: 0,
      isCheck: false,
      hasPin: false,
      success: false,
      password1: ref(),
      password2: ref(),
      editpassword1: '',
      editpassword2: '',
      editpassword3: '',
      check,
      uncheck,
    });
    const back = () => {
      $router.back();
    };
    const confirm1 = () => {
      if (!state.password1) {
        return Toast(t('reportForms.a141'));
      }
      if (!state.password2) {
        return Toast(t('reportForms.a142'));
      }
      if (state.password1 !== state.password2) {
        return Toast(t('reportForms.a89'));
      }
      const flag1 = lance.checkPin(state.password1);
      if (!flag1) {
        return Toast(t('reportForms.a90'));
      }
      const userNos = lance.getData('userNo');
      reportforms
        .modifyPayPwd({
          appInfo: {},
          data: {
            userNo: userNos,
            oldPwd: state.password1,
            newPwd: state.password2,
            isForget: 0,
            identityType: 2,
            deviceId: '',
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.success = true;
            getAccountInfo();
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
    const confirm2 = () => {
      if (state.editpassword1 === '') {
        return Toast(t('reportForms.a143'));
      }
      if (state.editpassword2 === '') {
        return Toast(t('reportForms.a144'));
      }
      if (state.editpassword3 === '') {
        return Toast(t('reportForms.a145'));
      }
      if (state.editpassword2 !== state.editpassword3) {
        return Toast(t('reportForms.a89'));
      }
      const flag1 = lance.checkPin(state.editpassword2);
      if (!flag1) {
        return Toast(t('reportForms.a90'));
      }
      const userNos = lance.getData('userNo');
      reportforms
        .modifyPayPwd({
          appInfo: {},
          data: {
            userNo: userNos,
            oldPwd: state.editpassword1,
            newPwd: state.editpassword2,
            isForget: 0,
            identityType: 2,
            deviceId: '',
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.success = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    onMounted(() => {
      const userInfo = JSON.parse(lance.getData('user'));
      state.hasPin = userInfo.hasPayPwd !== 0;
    });
    return {
      t,
      state, // 状态
      back, // 返回
      confirm1, // 已有pin确认
      confirm2, // 修改pin确认
      getAccountInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.settingpin {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  .box {
    margin-top: 20px;
    background: #fff;
    width: 100vw;
    height: calc(100vh - 97px);
    > .type1 {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 0 50px 0 70px;
      .title {
        width: 100%;
        min-height: 45px;
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 45px;
        color: #333333;
        text-align: left;
        margin: 76px 0 22px 0;
      }
      .tip {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 40px;
        margin-bottom: 56px;
        .dange {
          display: block;
          width: 26px;
          height: 26px;
          background: #f84412;
          border-radius: 50%;
          line-height: 26px;
          text-align: center;
          font-size: 22px;
          color: #fff;
          margin-right: 10px;
        }
        .tips {
          min-width: 185px;
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
          color: #333333;
        }
      }
      .inputbox {
        width: 100%;
        > div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 85px;
          > span {
            min-width: 128px;
            height: 45px;
            font-size: 32px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 45px;
            color: #333333;
            margin-right: 19px;
            text-align: left;
          }
          > .right {
            flex: 1;
            height: 85px;
            border-bottom: 2px solid #999999;
            > input {
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
          }
        }
        .wangji {
          margin: 30px 0 0 147px;
          width: 483px;
          > img {
            display: block;
            width: 28px;
            height: 28px;
            margin-right: 6px;
          }
          > .span1 {
            flex: 1;
            height: 37px;
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 37px;
            color: #666666;
            margin: 0;
          }
          > .span2 {
            height: 37px;
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 37px;
            color: #666666;
            margin: 0;
            text-align: right;
            flex: 1;
          }
        }
      }
      .createdbtn {
        width: 600px;
        height: 94px;
        line-height: 94px;
        text-align: center;
        background: #e7e7e7;
        border-radius: 49px;
        font-size: 29px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .createdbtnshow {
        color: #fff;
        background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
      }
    }
    > .type2 {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 0 50px 0 70px;
      .title {
        width: 100%;
        min-height: 45px;
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 45px;
        color: #333333;
        text-align: left;
        margin: 72px 0 52px 0;
      }
      .inputbox {
        width: 100%;
        > div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 85px;
          > span {
            min-width: 128px;
            height: 45px;
            font-size: 32px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 45px;
            color: #333333;
            margin-right: 19px;
            text-align: left;
          }
          > .right {
            flex: 1;
            height: 85px;
            border-bottom: 2px solid #999999;
            display: flex;
            justify-content: flex-start;
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
            > span {
              min-width: 116px;
              height: 40px;
              font-size: 28px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 40px;
              color: #2284ef;
              opacity: 1;
            }
          }
        }
      }
      .createdbtn {
        margin-top: 100px;
        width: 600px;
        height: 94px;
        line-height: 94px;
        text-align: center;
        background: #e7e7e7;
        border-radius: 49px;
        font-size: 29px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .createdbtnshow {
        color: #fff;
        background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
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
