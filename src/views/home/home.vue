<template>
  <!-- <img class="swipe" src="@/assets/img/youhui.png" alt="" /> -->
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item><img class="swipe" src="@/assets/img/swipe_klaKlouk.png" alt="" /></van-swipe-item>
    <van-swipe-item><img class="swipe" src="@/assets/img/swipe_lucky_zodiac.png" alt="" /></van-swipe-item>
    <van-swipe-item><img class="swipe" src="@/assets/img/swipe_99c1.png" alt="" /></van-swipe-item>
    <van-swipe-item><img class="swipe" src="@/assets/img/swipe_specialZodiac.png" alt="" /></van-swipe-item>
  </van-swipe>
  <div class="money">
    <p class="money-left">
      <span class="fs30">{{ $t('msg.a38') }}</span>
      <span class="fs32">:</span>
      <span class="pl20">{{ !isEye ? `${money} KHR` : '****' }}</span>
    </p>
    <van-icon :name="isEye ? 'closed-eye' : 'eye-o'" color="#4C2E07" size="0.5rem" @click="isEye = !isEye" />
  </div>
  <van-grid class="list" :border="false" :column-num="3">
    <van-grid-item v-for="(item, i) in list" :key="i" :to="item.path">
      <!-- <img class="icon" :src="item.icon" /> -->
      <img class="img" :src="item.img" />
      <p class="lotteryName">{{ item.lotteryName }}</p>
      <p class="desc" :style="{ color: i === 1 ? '#FF0000' : '' }">{{ item.desc }}</p>
    </van-grid-item>
  </van-grid>
</template>
<script setup>
import User from '@/api/user';
import lance from '@/utils/lance';
import icon from '@/assets/img/youhui.png';
import lucky_zodiac from '@/assets/img/lucky_zodiac.png';
import mark1choose99 from '@/assets/img/mark1choose99.png';
import klaKlouk from '@/assets/img/klaKlouk.png';
import specialZodiac from '@/assets/img/specialZodiac.png';

const money = ref(0);
const isEye = ref(false);
const list = reactive([
  {
    icon,
    img: lucky_zodiac,
    lotteryName: '6D Lucky Zodiac',
    desc: '5 minutes 1 issue',
    path: '/luckyZodiac',
  },
  {
    icon,
    img: mark1choose99,
    lotteryName: '6D ឆ្នោតឡូតូ 1/99',
    desc: '(new)',
    path: '/mark1choose99',
  },
  {
    icon,
    img: klaKlouk,
    lotteryName: 'kla klouk',
    desc: 'At least 2 matches',
    // path: 'http://192.168.1.39:8080/?open=Gold/6DKlaKlouk&lang=cn',
    path: '/klaKlouk',
  },
  {
    icon,
    img: specialZodiac,
    lotteryName: '6D SpecialZodiac',
    desc: '5 minutes 1 issue',
    path: '/specialZodiac',
  },
]);
onMounted(() => {
  getAccountInfo();
});
const getAccountInfo = () => {
  User.getAccountInfo({
    appInfo: {},
  })
    .then((res) => {
      money.value = lance.filterMoney(res.data.cash + res.data.cashExt);
      lance.setJson('user', res.data);
    })
    .catch(() => {
      // console.log(err);
    });
};
</script>
<style lang="less" scoped>
.my-swipe {
  margin: 0 20px;
  height: 200px;
  box-sizing: border-box;
  border-radius: 15px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
}
.swipe {
  height: 200px;
  border-radius: 15px;
}
.money {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
  padding: 20px;
  height: 88px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.39);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.money-left {
  font-size: 38px;
  font-weight: 700;
  color: #333;
}
.fs30 {
  font-size: 30px !important;
}
.fs32 {
  font-size: 32px !important;
}
.pl20 {
  padding-left: 20px;
}
.list {
  margin-top: 30px;
  :deep(.van-grid-item__content) {
    padding: 30px 0 !important;
  }
}
.icon {
  margin-left: 50px;
  width: 82px;
  height: 33px;
}
.img {
  margin: 10px 0;
  width: 156px;
  height: 104px;
}
.lotteryName {
  font-size: 28px;
  color: #333;
}
.desc {
  margin-top: 10px;
  font-size: 24px;
  color: #999;
}
</style>
