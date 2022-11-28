<template>
  <van-pull-refresh v-model="refreshing" :pulling-text="$t('reportForms.a177')" :loosing-text="$t('reportForms.a178')" :loading-text="$t('reportForms.a179')" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" :finished-text="$t('appList.finishedData')" :loading-text="$t('reportForms.a179')" @load="onLoad">
      <!-- <template v-if="list.lenght > 0">

      </template> -->
      <div v-for="(item, index) in list" :key="index" class="lottery-item">
        <div class="lottery-item-top">
          <span>{{ $t('6DLuckyZodiac.DrawHistory.Issue') }}{{ item.phaseNo }}{{ $t('6DLuckyZodiac.DrawHistory.period') }}</span><span>{{ timeFilter(item.endTime) }}</span>
          <div v-if="index === 0" class="new">NEW</div>
        </div>
        <div class="lottery-item-content">
          <img :src="item.imgList[0]" alt="" />
          <img :src="item.imgList[1]" alt="" />
          <img :src="item.imgList[2]" alt="" />
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
import hu from '@/assets/img/lottery/seafoods/hu.png';
import hulu from '@/assets/img/lottery/seafoods/hulu.png';
import ji from '@/assets/img/lottery/seafoods/ji.png';
import xia from '@/assets/img/lottery/seafoods/xia.png';
import xie from '@/assets/img/lottery/seafoods/xie.png';
import yu from '@/assets/img/lottery/seafoods/yu.png';

const list = ref([]);
const current = ref(1);
const size = ref(20);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const imgMap = ref({
  '01': hu,
  '02': hulu,
  '03': ji,
  '04': xia,
  '05': xie,
  '06': yu,
});
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
  User.getOpenList({ appInfo: {}, data: { lottId: 'fish', page: current.value, size: size.value } })
    .then((res) => {
      if (res.code === 200) {
        const arr = res.data.records;
        arr.forEach((item) => {
          item.imgList = [];
          if (item.winCode) {
            for (let i = 0; i < item.winCode.split(',').length; i++) {
              item.imgList.push(imgMap.value[item.winCode.split(',')[i]]);
            }
          }
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
      width: 50px;
      // min-width: 7.5vw;
      height: 50px;
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
