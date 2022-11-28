<!-- 忘记密码 -->
<template>
  <div class="kong"></div>
  <div class="content">
    <div class="steps">
      <p :class="[active >= 1 ? 'color333' : 'color999']" class="step" @click="onClick(1)">
        <span>{{ $t('msg.a14') }}</span
        ><span class="px40">></span>
      </p>
      <p :class="[active >= 2 ? 'color333' : 'color999']" class="step" @click="onClick(2)">
        <span>{{ $t('msg.a15') }}</span
        ><span class="px40">></span>
      </p>
      <p :class="[active >= 3 ? 'color333' : 'color999']" class="step" @click="onClick(3)">
        <span>{{ $t('msg.a16') }}</span>
      </p>
    </div>
    <div v-if="active === 1" class="mx42">
      <van-field v-model="username" :label="$t('msg.a5')" :placeholder="$t('msg.a7')" />
      <span></span>
      <div class="mt90">
        <van-button round block :color="!username ? '#f7f7f7' : 'linear-gradient(270deg, #FF2929 0%, #FF6619 100%)'" @click="onStep1">
          <span :class="[!username ? 'color333' : 'colorfff']">{{ $t('msg.a13') }}</span>
        </van-button>
      </div>
    </div>
    <div v-if="active === 2" class="mx42">
      <div class="tishi">
        <img class="tishi-img" src="@/assets/img/tishi.png" alt="" />
        <span class="tishi-span">{{ `${$t('msg.a50', { phone: lance.filterCardNo(phone) })}` }}</span>
      </div>
      <p class="title">{{ $t('msg.a18') }}</p>
      <van-field v-model="sms" center clearable type="digit" :label="$t('msg.a19')" :placeholder="$t('msg.a20')">
        <template #button>
          <van-button v-if="times === 0" size="small" type="primary" class="width" @click="getSms">{{ $t('msg.a21') }}</van-button>
          <van-button v-else size="small" type="primary" disabled class="width">{{ times }}s</van-button>
        </template>
      </van-field>
      <span></span>
      <div class="mt90">
        <van-button round block :color="!sms ? '#f7f7f7' : 'linear-gradient(270deg, #FF2929 0%, #FF6619 100%)'" @click="onStep2">
          <span :class="[!sms ? 'color333' : 'colorfff']">{{ $t('msg.a13') }}</span>
        </van-button>
      </div>
    </div>
    <div v-if="active === 3" class="mx42">
      <van-field v-model="password1" type="password" :label="$t('msg.a6')" :placeholder="$t('msg.a8')" />
      <van-field v-model="password2" type="password" :label="$t('msg.a22')" :placeholder="$t('msg.a23')" />
      <span></span>
      <div class="mt90">
        <van-button round block :color="!(password1 && password2) ? '#f7f7f7' : 'linear-gradient(270deg, #FF2929 0%, #FF6619 100%)'" @click="onStep3">
          <span :class="[!(password1 && password2) ? 'color333' : 'colorfff']">{{ $t('msg.a24') }}</span>
        </van-button>
      </div>
    </div>
    <!-- <div class="mx42 mt90">
      <van-button round block type="primary" color="#f7f7f7" @click="onStep">
        <span class="color333">{{ active === 3 ? $t('msg.a24') : $t('msg.a13') }}</span>
      </van-button>
    </div> -->
  </div>
  <div class="kefu">
    <img class="fefu-icon" src="@/assets/img/service@1x.png" alt="" />
    <RouterLink to="/reportForms/service">{{ $t('msg.a11') }}</RouterLink>
  </div>
  <Dialog :visible="dialogShow" :title="$t('msg.a29')" :confirm-button-text="$t('msg.a11')" @confirm="goKdfu" @close="dialogShow = false">
    <p class="text">{{ $t('msg.a30') }}</p>
  </Dialog>
  <Dialog :visible="dialogShow1" title="" :confirm-button-text="$t('msg.a42')" @confirm="goHome" @close="dialogShow1 = false">
    <img class="success-img" src="@/assets/img/salesAndTheWallet/group.png" alt="" />
    <p class="text">{{ $t('msg.a41') }}</p>
  </Dialog>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import User from '@/api/user';
import Dialog from '@/components/Dialog.vue';
import lance from '@/utils/lance';

const $router = useRouter();
const { t } = useI18n();
const active = ref(1);
const dialogShow = ref(false);
const dialogShow1 = ref(false);
const goKdfu = () => {
  dialogShow.value = false;
  $router.push('/reportForms/service');
};
const goHome = () => {
  dialogShow1.value = false;
  $router.push('/login');
};
const onClick = (e) => {
  if (e <= active.value) {
    active.value = e;
  }
};
const username = ref('');
const phone = ref('');
const sms = ref('');
const times = ref(120);
// 获取验证码
const getSms = () => {
  return new Promise((resolve, reject) => {
    User.getSms({
      appInfo: {
        channel: lance.getData('channel'),
        appId: 'test',
        platform: 'h5',
        imei: new Date().getTime(),
      },
      data: {
        phone: phone.value,
        model: 7,
      },
    })
      .then((res) => {
        if (res.code === 200) {
          // console.log(res);
          // sms.value = res.data;
          Toast(t('msg.a43'));
          const int = setInterval(() => {
            if (times.value === 0) {
              clearInterval(int);
            } else {
              times.value--;
            }
          }, 1000);
          resolve(res);
        }
      })
      .catch((err) => {
        // console.log(err);
        reject(err);
      });
  });
};
// 修改密码
const password1 = ref('');
const password2 = ref('');
// 下一步
const onStep1 = async () => {
  if (!username.value) {
    return Toast(t('msg.a7'));
  }
  User.checkUsernameOrPhoneIsExist({
    appInfo: {
      channel: lance.getData('channel'),
      appId: 'test',
      platform: 'h5',
    },
    data: {
      usernameOrPhone: username.value,
    },
  })
    .then((res) => {
      if (res.code === 200) {
        phone.value = res.data.phone;
        username.value = res.data.username;
        if (times.value === 120) {
          const re = getSms();
          re.then(() => {
            active.value = 2;
          }).catch(() => {
            active.value = 1;
          });
        } else {
          active.value = 2;
        }
      }
    })
    .catch((err) => {
      Toast({
        message: err.msg,
        position: 'bottom',
      });
      if (err.code === 1205) {
        // 账户未绑定手机
        dialogShow.value = true;
      }
    });
};
const onStep2 = async () => {
  if (!sms.value) {
    return Toast(t('msg.a20'));
  }
  if (sms.value.length !== 4) {
    return Toast(t('reportForms.a12'));
  }
  active.value = 3;
};
const onStep3 = async () => {
  if (!password1.value) {
    return Toast(t('msg.a8'));
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
  // 确定修改密码 { username: username.value, sms: sms.value, password: password1.value }
  User.changePassword({
    appInfo: {
      channel: lance.getData('channel'),
      appId: 'test',
      platform: 'h5',
    },
    data: {
      identityType: 4,
      username: username.value,
      code: sms.value,
      pwd: password1.value,
      model: 7,
    },
  }).then((res) => {
    if (res.code === 200) {
      dialogShow1.value = true;
    }
  });
};
</script>
<style scoped>
.steps {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 58px 0 105px;
}
.step {
  font-size: 26px;
  font-weight: 400;
  color: #999;
}
.px40 {
  padding: 0 40px;
}
.text {
  padding: 0 60px;
  font-size: 26px;
  text-align: center;
  color: #333;
  line-height: 40px;
}
.width {
  width: 180px;
}
.mx42 {
  margin-right: 62px;
  margin-left: 62px;
}
.mt90 {
  margin-top: 90px;
}
.title {
  margin-bottom: 30px;
  padding-left: 26px;
  font-size: 30px;
  font-weight: 700;
  color: #333;
}
.tishi {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 36px;
  height: 54px;
  border: 1px solid #dedeeb;
  background: rgba(246, 247, 254, 0.39);
  box-sizing: border-box;
}
.tishi-img {
  margin-right: 12px;
  width: 25px;
  height: 25px;
}
.tishi-span {
  font-size: 26px;
  color: #333;
}
.success-img {
  display: flex;
  margin: auto;
  margin-bottom: 15px;
  width: 80px;
  height: 80px;
}
</style>
