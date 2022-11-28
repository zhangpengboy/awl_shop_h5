<!-- login 登录 -->
<template>
  <div class="login">
    <header v-if="Number(lance.getData('channel')) === 80001">
      <div class="kong"></div>
      <img class="B_logo" src="@/assets/img/B_logo.png" alt="" />
      <p class="b-title">{{ $t('msg.a4') }}</p>
    </header>
    <header v-if="Number(lance.getData('channel')) === 80002">
      <div class="kong"></div>
      <img class="B_logo" src="@/assets/img/C_logo.png" alt="" />
      <p class="b-title">{{ $t('msg.a4') }}</p>
    </header>
    <van-form class="form" @submit="onSubmit">
      <van-field v-model="username" :label="$t('msg.a5')" :placeholder="$t('msg.a7')" :rules="[{ required: true, message: $t('msg.a7') }]" />
      <van-field
        v-model="password"
        :type="isEye ? '' : 'password'"
        :label="$t('msg.a6')"
        :placeholder="$t('msg.a8')"
        :right-icon="!isEye ? 'closed-eye' : 'eye-o'"
        :rules="[{ required: true, message: $t('msg.a8') }]"
        @click-right-icon="isEye = !isEye"
      />
      <div class="mt-8 flex fs26">
        <van-checkbox v-model="checked" shape="square" icon-size="15px" @change="onChange">{{ $t('msg.a10') }}</van-checkbox>
        <RouterLink to="/forgetPwd" class="noxian">{{ $t('msg.a3') }}</RouterLink>
      </div>
      <van-button round block :color="!(username && password) ? '#f7f7f7' : 'linear-gradient(270deg, #FF2929 0%, #FF6619 100%)'" native-type="submit" class="my42">
        <span :class="[!(username && password) ? 'color333' : 'colorfff']">{{ $t('msg.a2') }}</span>
      </van-button>
      <van-button v-if="Number(lance.getData('channel')) === 80002" round block plain type="primary" color="#F83E11" to="/register">
        <span class="colorF83E11">{{ $t('msg.a12') }}</span>
      </van-button>
    </van-form>
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
import lance from '@/utils/lance';
import { useCounterStore } from '@/store/modules/counter';
// const { t } = useI18n();
// const title = t('msg.a9');
const $router = useRouter();
const { t } = useI18n();
const username = ref('');
const password = ref('');
const isEye = ref(false);
const checked = ref(false);
const onChange = (v) => {
  console.log(v);
  if (v) {
    // 勾选记住密码，账户信息保存到localStorage
    lance.setJson('loginInfo', { username: username.value });
  } else {
    // 未勾选记住密码，账户信息清除
    lance.clearStorage('loginInfo');
  }
};
onMounted(() => {
  if (lance.getJson('loginInfo')) {
    username.value = lance.getJson('loginInfo').username;
    // password.value = lance.getJson('loginInfo').password;
    checked.value = true;
  }
});
const store = useCounterStore();
const onSubmit = () => {
  User.login({
    appInfo: {
      channel: lance.getData('channel'),
      appId: 'test',
      platform: 'h5',
    },
    data: {
      identityType: 4,
      identifier: username.value,
      credential: password.value,
    },
  })
    .then((res) => {
      if (res.code === 200) {
        store.login(res.data);
        lance.setJson('userNumber', username.value);
        Toast(t('reportForms.a18'));
        onChange(checked.value);
        $router.push('/');
        // if (res.data.hasPwd === 0) {
        //   console.log('login0');
        //   $router.push('/changingInitialPassword');
        // } else {
        //   Toast(res.toast);
        //   onChange(checked.value);
        //   $router.push('/');
        // }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>
<style scoped>
.login {
  text-align: center;
  background: #fff;
}
:deep(.van-cell) {
  margin: 30px 0;
}
.colorfff {
  color: #fff;
}
.flex {
  display: flex;
  justify-content: center;
}
.B_logo {
  margin: auto;
  margin-top: 70px;
  width: 160px;
  height: 160px;
}
.b-title {
  margin-top: 8px;
  margin-bottom: 77px;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
}
.c_logo {
  width: 100%;
  height: 260px;
}
.fs26 {
  font-size: 26px !important;
  color: #666 !important;
}
.colorF83E11 {
  color: #f83e11;
}

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
.noxian {
  text-decoration: none !important;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 40px 38px;
}
</style>
