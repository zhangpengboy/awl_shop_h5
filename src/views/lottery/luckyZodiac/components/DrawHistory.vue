<template>
  <van-pull-refresh v-model="refreshing" :pulling-text="$t('reportForms.a177')" :loosing-text="$t('reportForms.a178')" :loading-text="$t('reportForms.a179')" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" :loading-text="$t('reportForms.a179')" :finished-text="$t('appList.finishedData')" @load="onLoad">
      <div v-for="(item, index) in list" :key="index" class="lottery-item">
        <div class="lottery-item-top">
          <span>{{ $t('6DLuckyZodiac.DrawHistory.Issue') }}{{ item.phaseNo }}{{ $t('6DLuckyZodiac.DrawHistory.period') }}</span><span>{{ timeFilter(item.endTime) }}</span>
          <div v-if="index === 0" class="new">NEW</div>
        </div>
        <div class="lottery-item-content">
          <div class="number" :class="`round_bg_${handleGetWinCodeColor(item.winCodeShow)}`">{{ item.winCode }}</div>
          <img v-if="item.winCode" :src="srcimg(item.winCode)" />
        </div>
      </div>
      <AppNoData v-if="list.lenght === 0" :value="$t('Diamond.HistoricalLottery.noData')"></AppNoData>
    </van-list>
  </van-pull-refresh>
</template>

<script setup>
import moment from 'moment';
import User from '@/api/user';
import AppNoData from '@/components/AppNoData.vue';
import zodiac_01 from '@/assets/img/zodiac/zodiac_01.png';
import zodiac_02 from '@/assets/img/zodiac/zodiac_02.png';
import zodiac_03 from '@/assets/img/zodiac/zodiac_03.png';
import zodiac_04 from '@/assets/img/zodiac/zodiac_04.png';
import zodiac_05 from '@/assets/img/zodiac/zodiac_05.png';
import zodiac_06 from '@/assets/img/zodiac/zodiac_06.png';
import zodiac_07 from '@/assets/img/zodiac/zodiac_07.png';
import zodiac_08 from '@/assets/img/zodiac/zodiac_08.png';
import zodiac_09 from '@/assets/img/zodiac/zodiac_09.png';
import zodiac_10 from '@/assets/img/zodiac/zodiac_10.png';
import zodiac_11 from '@/assets/img/zodiac/zodiac_11.png';
import zodiac_12 from '@/assets/img/zodiac/zodiac_12.png';

const list = ref([]);
const current = ref(1);
const size = ref(20);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const srcimg = (e) => {
  const map = {
    '01': zodiac_01,
    '02': zodiac_02,
    '03': zodiac_03,
    '04': zodiac_04,
    '05': zodiac_05,
    '06': zodiac_06,
    '07': zodiac_07,
    '08': zodiac_08,
    '09': zodiac_09,
    10: zodiac_10,
    11: zodiac_11,
    12: zodiac_12,
  };
  return map[e];
};
const timeFilter = (time) => {
  const date = new Date(time.replace(/-/g, '/'));
  return moment(date).locale('en').format('D-M-YYYY hh:mmA');
};
// onMounted(() => {
//   onLoad();
// });
const onLoad = () => {
  console.log('onLoad');
  // loading.value = true;
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
  }
  User.getOpenList({ appInfo: {}, data: { lottId: 'animal', page: current.value, size: size.value } })
    .then((res) => {
      if (res.code === 200) {
        const arr = res.data.records;
        arr.forEach((item) => {
          list.value.push(item);
        });
        loading.value = false;
        current.value++;
        if (current.value >= res.data.pages && list.value.length >= res.data.total) {
          finished.value = true;
        }
      } else {
        loading.value = false;
        finished.value = true;
      }
    })
    .catch((err) => {
      loading.value = false;
      finished.value = true;
      console.log(err);
    });
};
const handleGetWinCodeColor = (val) => {
  if (val) {
    const num = val.split(',')[0];
    const red_array = ['01', '02', '03', '04'];
    const blue_array = ['05', '06', '07', '08'];
    return red_array.includes(num) ? 'red' : blue_array.includes(num) ? 'green' : 'blue';
  }
};
const onRefresh = () => {
  // 清空列表数据
  finished.value = false;
  list.value = [];
  current.value = 1;
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};
</script>

<style lang="less" scoped>
.lottery-item {
  margin-bottom: 16px;
  padding: 20px 0 24px 38px;
  width: calc(100% - 36px);
  height: 130px;
  background: #ffffff;

  &-top {
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    font-size: 28px;
    color: #333333;
    > span:nth-child(2) {
      margin: 0 26px 0 16px;
      color: #ff0000;
    }
    .new {
      padding-left: 8px;
      width: 74px;
      height: 30px;
      font-size: 20px;
      border-radius: 0px 0px 26px 0px;
      color: #fff;
      background: #fa3333;
      line-height: 30px;
    }
  }
  &-content {
    display: flex;
    align-items: center;
    // padding-bottom: 0.5rem;
    .number {
      margin-right: 60px;
      width: 50px;
      height: 50px;
      font-size: 28px;
      // background: linear-gradient(180deg, #ae5cff 0%, #4934fa 100%);
      border-radius: 50%;
      text-align: center;
      color: #fff;
      line-height: 50px;
      // opacity: 0.75;
    }
    .color {
      font-size: 32px;
    }
    > img {
      margin-right: 38px;
      width: 72px;
      // min-width: 7.5vw;
      height: 56px;
    }
    .round_bg {
      &_red {
        background: url(/src/assets/img/lottery/round_red.png) no-repeat 0 0/100%;
      }
      &_blue {
        background: url(/src/assets/img/lottery/round_blue.png) no-repeat 0 0/100%;
      }
      &_green {
        background: url(/src/assets/img/lottery/round_green.png) no-repeat 0 0/100%;
      }
    }
  }
}
.lottery-item:last-child {
  margin-bottom: 0;
}
</style>
