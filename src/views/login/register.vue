<!-- 注册 -->
<template>
  <div class="kong"></div>
  <div class="content">
    <p class="title">{{ $t('msg.a31') }}</p>
    <van-form class="form" @submit="onSubmit">
      <van-field v-model="username" label-width="50px" :label="$t('msg.a5')" :placeholder="$t('msg.a32')" :rules="[{ required: true, message: $t('msg.a7') }]" />
      <van-field
        v-model="password"
        label-width="50px"
        :type="!isEye ? '' : 'password'"
        :label="$t('msg.a6')"
        :placeholder="$t('msg.a33')"
        :right-icon="isEye ? 'closed-eye' : 'eye-o'"
        :rules="[{ required: true, message: $t('msg.a8') }]"
        @click-right-icon="isEye = !isEye"
      />
      <span></span>
      <van-button round block :color="!(username && password) ? '#f7f7f7' : 'linear-gradient(270deg, #FF2929 0%, #FF6619 100%)'" native-type="submit" class="but">
        <span :class="[!(username && password) ? 'color333' : 'colorfff']">{{ $t('msg.a12') }}</span>
      </van-button>
    </van-form>
    <div class="go-login" @click="$router.push('/login')">{{ $t('msg.a45') }}</div>
    <div class="kefu">
      <img class="fefu-icon" src="@/assets/img/service@1x.png" alt="" />
      <RouterLink to="/reportForms/service">{{ $t('msg.a11') }}</RouterLink>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import User from '@/api/user';
import { useCounterStore } from '@/store/modules/counter';
import lance from '@/utils/lance';

const $router = useRouter();
const { t } = useI18n();
const username = ref('');
const password = ref('');
const isEye = ref(false);
const store = useCounterStore();
const onSubmit = () => {
  const test = /^(?=.*[a-zA-Z])(?=.*\d)[^]{6,16}$/;
  if (!test.test(username.value)) {
    return Toast(t('msg.a32'));
  }
  const test1 = /^(?=.*[a-zA-Z])(?=.*\d)[^]{6,20}$/;
  if (!test1.test(password.value)) {
    return Toast(t('msg.a33'));
  }
  // console.log(dialogShow);
  User.registerForHFive({
    appInfo: {
      channel: lance.getData('channel'),
      appId: 'test',
    },
    data: {
      identityType: 4,
      identifier: username.value,
      credential: password.value,
    },
  })
    .then((res) => {
      if (res.code === 200) {
        console.log(res);
        store.login(res.data);
        // Toast(res.toast);
        Toast(t('msg.a9'));
        lance.setJson('registerInfo', { username: username.value, password: `${password.value.slice(0, -3)}***` });
        $router.push('/');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>
<style scoped>
.title {
  margin-top: 72px;
  margin-bottom: 40px;
  margin-left: 40px;
  font-size: 36px;
  font-weight: bold;
  text-align: left;
}

.form {
  margin: 0 50px;
  font-size: 32px !important;
}
.but {
  margin-top: 90px;
}

.go-login {
  margin-top: 50px;
  font-size: 28px;
  text-align: center;
  color: #666;
}
</style>
