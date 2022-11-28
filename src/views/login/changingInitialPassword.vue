<script setup>
import { useI18n } from 'vue-i18n';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import reportforms from '@/api/reportforms';
import User from '@/api/user';
import lance from '@/utils/lance';
import { useCounterStore } from '@/store/modules/counter';

const $router = useRouter();
const { t } = useI18n();
const password1 = ref('');
const password2 = ref('');
const confirm = () => {
  if (!password1.value) {
    return Toast(t('msg.a8'));
  }
  if (password1.value === '888888') {
    return Toast(t('msg.a48'));
  }
  const test = /^(?=.*[a-zA-Z])(?=.*\d)[^]{6,20}$/;
  if (!test.test(password1.value)) {
    return Toast(t('msg.a28'));
  }
  if (!password2.value) {
    return Toast(t('msg.a23'));
  }
  if (!test.test(password2.value)) {
    return Toast(t('msg.a28'));
  }
  if (password1.value !== password2.value) {
    return Toast(t('msg.a25'));
  }
  // 确定修改密码
  reportforms
    .modifyPwd({
      appInfo: {},
      data: {
        identityType: 4,
        userNo: lance.getData('userNo'),
        newPwd: password2.value,
        deviceId: '',
      },
    })
    .then((res) => {
      if (res.code === 200) {
        // 更新用户缓存信息，跳转首页
        getAccountInfo();
      }
    });
};
const counterStore = useCounterStore();
const getAccountInfo = () => {
  User.getAccountInfo({
    appInfo: {},
  })
    .then((res) => {
      lance.setJson('user', res.data);
      counterStore.user = res.data;
      Toast(res.toast);
      $router.push('/home');
    })
    .catch(() => {
      // console.log(err);
    });
};
</script>
<template>
  <div class="kong"></div>
  <p class="title1 mx70">{{ $t('msg.a46') }}</p>
  <p class="title1 mx42">{{ $t('msg.a47') }}</p>
  <div class="mx42 mt60">
    <van-field v-model="password1" type="password" :label="$t('msg.a6')" :placeholder="$t('msg.a8')" />
    <van-field v-model="password2" type="password" :label="$t('msg.a22')" :placeholder="$t('msg.a23')" />
    <span></span>
    <div class="mt60">
      <van-button round block :color="!(password1 && password2) ? '#f7f7f7' : 'linear-gradient(270deg, #FF2929 0%, #FF6619 100%)'" @click="confirm">
        <span :class="[!(password1 && password2) ? 'color333' : 'colorfff']">{{ $t('msg.a24') }}</span>
      </van-button>
    </div>
    <div class="go-login" @click="$router.push('/login')">{{ $t('msg.a45') }}</div>
  </div>
</template>
<style scoped>
.go-login {
  margin-top: 50px;
  font-size: 26px;
  text-align: center;
  color: #666;
}
.mx70 {
  margin: 66px 0 0 62px;
}
.mt60 {
  margin-top: 60px;
}
.title1 {
  font-size: 32px;
  line-height: 45px;
  color: #333333;
}
.mx42 {
  margin-right: 62px;
  margin-left: 62px;
}
</style>
