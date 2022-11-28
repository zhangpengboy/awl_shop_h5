<script setup>
import { useRouter } from 'vue-router';
// const props = defineProps({
//   active: {
//     type: Number,
//     default: 1,
//   },
// });
const $router = useRouter();
const emit = defineEmits(['update:active', 'clickTab', 'toPlay', 'toGameplay']);
const active = ref(1);
const clickTab = (e) => {
  active.value = e;
  emit('clickTab', e);
};
const toPlay = () => {
  emit('toPlay');
};
const toGameplay = () => {
  emit('toGameplay');
};
const toHome = () => {
  $router.push('/home');
};
</script>
<template>
  <div class="flex">
    <!-- <div class="tabs">
      <div :class="[active === 1 ? 'active' : 'no-active']" @click="clickTab(1)">Bet</div>
      <div :class="[active === 2 ? 'active' : 'no-active']" @click="clickTab(2)">Result</div>
    </div> -->
    <div class="tabs">
      <div class="img1" :class="[active === 1 ? 'img-on' : 'img-off']" @click="clickTab(1)">Bet</div>
      <div class="img2" :class="[active === 2 ? 'img-on' : 'img-off']" @click="clickTab(2)">Result</div>
    </div>
    <div class="pr20">
      <van-icon name="wap-home" size="0.6rem" color="#333333" class="mr30" @click="toHome" />
      <van-icon name="play" size="0.6rem" color="#333333" class="mr30" @click="toPlay" />
      <van-icon name="wap-nav" size="0.6rem" color="#333333" @click="toGameplay" />
    </div>
  </div>
</template>
<style lang="less" scoped>
.flex {
  position: fixed;
  top: 0;
  z-index: 9999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 84px;
  background: #fff;
}
.tabs {
  display: flex;
  align-items: flex-end;
  // width: 100%;
  padding-left: 12px;
  background: #fff;
  box-sizing: border-box;
  .img1 {
    z-index: 10;
    text-align: center;
  }
  .img2 {
    z-index: 5;
    margin-left: -70px;
    text-align: center;
  }
  .img-on {
    width: 244px;
    height: 84px;
    font-size: 36px;
    font-weight: 500;
    color: #333;
    line-height: 104px;
    background: url(/src/assets/img/home/tab1-on.png) no-repeat 0 0/100% 100%;
  }
  .img-off {
    width: 238px;
    height: 78px;
    font-size: 28px;
    color: #666;
    line-height: 100px;
    background: url(/src/assets/img/home/tab1-off.png) no-repeat 0 0/100% 100%;
  }
}
// .tabs {
//   display: flex;
//   align-items: center;
// }
.active {
  width: 180px;
  height: 80px;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  color: #333;
  line-height: 80px;
  background: #f3f3f3;
}
.no-active {
  width: 180px;
  height: 80px;
  font-size: 28px;
  font-weight: 400;
  text-align: center;
  color: #666;
  line-height: 80px;
  background: #fff;
}
.pr20 {
  padding-right: 20px;
}
.mr30 {
  margin-right: 30px;
}
</style>
