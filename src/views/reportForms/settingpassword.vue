<template>
  <div class="settingpassword">
    <van-nav-bar :title="$t('reportForms.a128')" left-arrow @click-left="back" />
    <template v-if="state.step === 1">
      <div class="phone">
        <div class="title">
          <span class="dange">!</span>
          <span class="tip">{{ $t('msg.a28') }}</span>
        </div>
        <div class="inputbox">
          <div>
            <span>{{ $t('reportForms.a132') }}</span>
            <div class="right">
              <input v-model="state.oldpassword" type="password" :placeholder="$t('reportForms.a180')" />
            </div>
          </div>
          <div>
            <span>{{ $t('reportForms.a133') }}</span>
            <div class="right">
              <input v-model="state.newpassword1" type="password" :placeholder="$t('reportForms.a181')" />
            </div>
          </div>
          <div>
            <span>{{ $t('reportForms.a134') }}</span>
            <div class="right">
              <input v-model="state.newpassword2" type="password" :placeholder="$t('reportForms.a182')" />
            </div>
          </div>
        </div>
        <div v-if="state.oldpassword && state.newpassword1 && state.newpassword2" class="createdbtn createdbtnshow" @click="confirm">{{ $t('msg.a42') }}</div>
        <div v-else class="createdbtn">{{ $t('msg.a42') }}</div>
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
        <div class="public_btn" style="margin-top: 21px" @click="loginOut">{{ $t('msg.a42') }}</div>
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
import { useCounterStore } from '@/store/modules/counter';

export default {
  name: 'Settingpassword',

  setup() {
    const { t } = useI18n();
    const store = useCounterStore();
    const $router = useRouter();
    const state = reactive({
      step: 1,
      oldpassword: ref(),
      newpassword1: ref(),
      newpassword2: ref(),
    });
    const back = () => {
      $router.back();
    };
    const loginOut = () => {
      // lance.clearStorage('user');
      // lance.clearStorage('token');
      // lance.clearStorage('userNo');
      reportforms
        .loginOut({
          appInfo: {
            channel: lance.getData('channel'),
            appId: 'test',
            platform: 'web',
            imei: lance.randomString(6),
          },
          data: {},
        })
        .then((res) => {
          if (res && res.code === 200) {
            store.loginOut();
            $router.push('/login');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const confirm = () => {
      console.log('confirm');
      const flag1 = lance.checkPassWord(state.newpassword1);
      if (!flag1) {
        return Toast(t('reportForms.a135'));
      }
      const flag2 = lance.checkPassWord(state.newpassword2);
      if (!flag2) {
        return Toast(t('reportForms.a136'));
      }
      if (state.newpassword1 !== state.newpassword2) {
        return Toast(t('reportForms.a89'));
      }
      const userNo = lance.getData('userNo');
      console.log(userNo);
      reportforms
        .modifyPwd({
          appInfo: {},
          data: {
            userNo,
            oldPwd: state.oldpassword,
            newPwd: state.newpassword1,
            isForget: 0,
            identityType: 4,
            deviceId: '',
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            reportforms
              .loginOut({
                appInfo: {
                  channel: lance.getData('channel'),
                  appId: 'test',
                  platform: 'web',
                  imei: lance.randomString(6),
                },
                data: {},
              })
              .then((res) => {
                if (res && res.code === 200) {
                  // store.loginOut();
                  state.step = 2;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    onMounted(() => {
      console.log('onMounted');
    });
    return {
      t,
      state, // 状态
      back, // 返回
      loginOut,
      confirm,
    };
  },
};
</script>

<style lang="scss" scoped>
.settingpassword {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  > .phone {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 0 50px 0 57px;
    .title {
      width: 100%;
      min-height: 45px;
      margin: 76px 0 49px 0;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      .dange {
        margin: 7px 9px 0 17px;
        width: 26px;
        height: 26px;
        background: #ff0000;
        border-radius: 50%;
        color: #fff;
        text-align: center;
      }
      .tip {
        flex: 1;
        min-height: 80px;
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
        margin-bottom: 21px;
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
      margin-top: 42px;
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
