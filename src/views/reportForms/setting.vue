<template>
  <div class="setting">
    <van-nav-bar :title="$t('reportForms.a82')" left-arrow @click-left="back" />
    <div class="list">
      <div class="item" @click="gophone">
        <img :src="state.number" alt="#" />
        <div>
          <div class="title">{{ $t('reportForms.a79') }}</div>
          <div v-if="phone" class="desc">{{ $t('reportForms.a124') }} {{ phone }}</div>
          <div v-else class="desc">{{ $t('reportForms.a125') }}</div>
        </div>
      </div>
      <div class="item" @click="gopin">
        <img :src="state.password" alt="#" />
        <div>
          <div class="title">{{ $t('reportForms.a126') }}</div>
          <div class="desc">{{ $t('reportForms.a127') }}</div>
        </div>
      </div>
      <div class="item" @click="$router.push('/reportForms/settingpassword')">
        <img :src="state.editpassword" alt="#" />
        <div>
          <div class="title">{{ $t('reportForms.a128') }}</div>
          <div class="desc">{{ $t('reportForms.a129') }}</div>
        </div>
      </div>
    </div>
    <div class="out" @click="loginOut">{{ $t('reportForms.a130') }}</div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast, Dialog } from 'vant';
import { useI18n } from 'vue-i18n';
import lance from '@/utils/lance';
import reportforms from '@/api/reportforms';
import number from '@/assets/img/reportForms/number.png';
import password from '@/assets/img/reportForms/password.png';
import editpassword from '@/assets/img/reportForms/editpassword.png';
import { useCounterStore } from '@/store/modules/counter';
import User from '@/api/user';

export default {
  name: 'Setting',

  setup() {
    const { t } = useI18n();
    const store = useCounterStore();
    const $router = useRouter();
    const state = reactive({
      curren: 0,
      number,
      password,
      filterPhone: '',
      editpassword,
    });
    const phone = ref('');
    const back = () => {
      $router.back();
    };
    const gophone = () => {
      if (!phone.value) {
        $router.push('/reportForms/settingphone');
      }
    };
    const gopin = () => {
      if (lance.getJson('user').phone === '') {
        Toast(t('reportForms.a131'));
        return $router.push('/reportForms/settingphone');
      }
      $router.push('/reportForms/settingpin');
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
    const loginOut = () => {
      Dialog.confirm({
        message: t('reportForms.a183'),
        cancelButtonText: t('goldBet.cancel'), // 取消
        confirmButtonText: t('goldBet.confirm'), // 确定
      })
        .then(() => {
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
                $router.push('/login');
                store.loginOut();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          // on cancel
        });
    };
    onMounted(() => {
      getAccountInfo();
      const userInfo = JSON.parse(lance.getData('user'));
      state.filterPhone = lance.filterPhone(userInfo.phone);
      phone.value = userInfo.phone;
      console.log('onMounted');
    });
    return {
      state, // 状态
      store,
      phone, // 手机号码
      back, // 返回
      loginOut, // 退出登录
      getAccountInfo,
      gophone, // 跳转绑定手机号码gopin
      t,
      gopin,
    };
  },
};
</script>

<style lang="scss" scoped>
.setting {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  .list {
    width: 100%;
    height: 330px;
    background: #fff;
    margin: 20px auto 20px;
    .item {
      height: 110px;
      box-sizing: border-box;
      padding: 17px 0 19px 32px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      > img {
        display: block;
        margin-top: 5px;
        margin-right: 19px;
        width: 48px;
        height: 48px;
      }
      > div {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .title {
          min-width: 112px;
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Regular;
          line-height: 40px;
          color: #131417;
        }
        .desc {
          min-width: 205px;
          height: 33px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          line-height: 33px;
          color: #9f9f9f;
        }
      }
    }
  }
  .out {
    width: 100%;
    height: 98px;
    background: #fff;
    text-align: center;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    line-height: 98px;
    color: #131417;
  }
}
</style>
