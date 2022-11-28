<template>
  <van-pull-refresh v-model="refreshing" :pulling-text="$t('reportForms.a177')" :loosing-text="$t('reportForms.a178')" :loading-text="$t('reportForms.a179')" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" :finished-text="$t('appList.finishedData')" :loading-text="$t('reportForms.a179')" @load="onLoad">
      <div v-for="(item, index) in list" :key="index" class="lottery-item">
        <div class="lottery-item-top">
          <span>{{ $t('6DLuckyZodiac.DrawHistory.Issue') }}{{ item.phaseNo }}{{ $t('6DLuckyZodiac.DrawHistory.period') }}</span><span>{{ timeFilter(item.endTime) }}</span>
          <div v-if="index === 0" class="new">NEW</div>
        </div>
        <div class="lottery-item-content">
          <div v-if="item.winCodeShow" class="number" :class="`round_bg_${item.winCodeShow.split(',')[0]}`"></div>
          <img v-if="item.winCodeShow" :src="srcimg(item.winZodiac)" />
          <span v-if="item.winCodeShow" class="color" :class="`color_${handleGetWinCodeColor(item.winCodeShow.split(',')[2])}`">{{ item.winCodeShow.split(',')[2] }}</span>
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
import zodiac_01 from '@/assets/img/specialzodiac/zodiac_01.png';
import zodiac_02 from '@/assets/img/specialzodiac/zodiac_02.png';
import zodiac_03 from '@/assets/img/specialzodiac/zodiac_03.png';
import zodiac_04 from '@/assets/img/specialzodiac/zodiac_04.png';
import zodiac_05 from '@/assets/img/specialzodiac/zodiac_05.png';
import zodiac_06 from '@/assets/img/specialzodiac/zodiac_06.png';
import zodiac_07 from '@/assets/img/specialzodiac/zodiac_07.png';
import zodiac_08 from '@/assets/img/specialzodiac/zodiac_08.png';
import zodiac_09 from '@/assets/img/specialzodiac/zodiac_09.png';
import zodiac_10 from '@/assets/img/specialzodiac/zodiac_10.png';
import zodiac_11 from '@/assets/img/specialzodiac/zodiac_11.png';
import zodiac_12 from '@/assets/img/specialzodiac/zodiac_12.png';

const list = ref([]);
const current = ref(1);
const size = ref(20);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const srcimg = (e) => {
  const a = handleGetWinCodeZodiac(e);
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
  return map[a];
  // return `/src/assets/img/specialzodiac/zodiac_${handleGetWinCodeZodiac(e)}.png`;
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
  User.getOpenList({ appInfo: {}, data: { lottId: '49C6', page: current.value, size: size.value } })
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
// 获取颜色
const handleGetWinCodeColor = (val) => {
  const redArr = ['Red', 'ក្រហម', '红']; // 红色
  const blueArr = ['Blue', 'ខៀវ', '蓝']; // 蓝色
  const greenArr = ['Green', 'បៃតង', '绿']; // 绿色
  if (redArr.indexOf(val) !== -1) return 'red';
  if (blueArr.indexOf(val) !== -1) return 'blue';
  if (greenArr.indexOf(val) !== -1) return 'green';
};

// 获取生肖号码
const handleGetWinCodeZodiac = (val) => {
  const cn = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']; // 中文
  const en = ['Mouse', 'Cattle', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Chicken', 'Dog', 'Pig']; // 英文
  const hk = ['កណ្តុរ', 'គោ', 'ខ្លា', 'ទន្សាយ', 'នាគ', 'ពស់', 'សេះ', 'ពពែ', 'ស្វា', 'មាន់', 'ឆ្កែ', 'ជ្រូក', 'បៃតង', 'ខៀវ', 'ក្រហម', 'លេខ', 'ពណ៌']; // 柬文
  if (cn.indexOf(val) !== -1) {
    const index = cn.indexOf(val) + 1;
    return index < 10 ? `0${index}` : index;
  }
  if (en.indexOf(val) !== -1) {
    const index = en.indexOf(val) + 1;
    return index < 10 ? `0${index}` : index;
  }
  if (hk.indexOf(val) !== -1) {
    const index = hk.indexOf(val) + 1;
    return index < 10 ? `0${index}` : index;
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

<style lang="scss" scoped>
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
    .number {
      width: 50px;
      height: 50px;
      // background: linear-gradient(180deg, #ae5cff 0%, #4934fa 100%);
      border-radius: 50%;
      font-size: 14px;
      margin-right: 30px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      // opacity: 0.75;
    }
    > img {
      width: 72px;
      // min-width: 7.5vw;
      height: 56px;
      margin-right: 30px;
    }
    .color {
      font-size: 30px;
      font-weight: 500;
      &_red {
        color: #fc3635;
      }
      &_blue {
        color: #3685ec;
      }
      &_green {
        color: #55c339;
      }
    }

    // 内容第一个1-49号码背景图
    @for $i from 1 through 49 {
      @if ($i<10) {
        .round_bg_0#{$i} {
          background: url(/src/assets/img/specialzodiac/ball0#{$i}.png) no-repeat 0 0/100%;
        }
      } @else {
        .round_bg_#{$i} {
          background: url(/src/assets/img/specialzodiac/ball#{$i}.png) no-repeat 0 0/100%;
        }
      }
    }
  }
}
.lottery-item:last-child {
  margin-bottom: 0;
}
</style>
