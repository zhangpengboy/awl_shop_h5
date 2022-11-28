<template>
  <!-- <div> -->
  <div :class="countdownClass">
    <span>{{ $t('msg.endTimeText', { currentPhaseNo }) }}</span>
    <strong v-if="isFirst">
      <template v-if="isRotating">{{ remainFormat }}</template>
      <template v-else>
        <template v-if="isWaiting">{{ $t('msg.waiting') }}</template>
        <template v-else-if="remain >= 1">{{ remainFormat }}</template>
        <template v-else>{{ remainFormat }}</template>
        <!-- <template v-else>{{ $t('waiting') }}</template> -->
      </template>
    </strong>
    <strong v-else>
      <template v-if="isRotating">{{ $t('msg.opening') }}</template>
      <template v-else>
        <template v-if="isWaiting">{{ $t('msg.waiting') }}</template>
        <template v-else-if="remain >= 1">{{ remainFormat }}</template>
        <template v-else>{{ $t('msg.waiting') }}</template>
      </template>
    </strong>
  </div>
  <!-- </div> -->
</template>

<script>
// import countdownMixin from './countdownMixin';

export default {
  name: 'LotteryCountdown',
  // mixins: [countdownMixin],
  // i18n: {
  //   messages: {
  //     cn: {
  //       opening: '开奖中',
  //       waiting: '待开奖',
  //       end: '本期截止!',
  //       lastPhaseText: '第{lastPhaseNo}期 开奖',
  //       endTimeText: '{currentPhaseNo}投注截止',
  //     },
  //     en: {
  //       opening: 'កំពុងចាប់រង្វាន់',
  //       waiting: 'រង់ចាំចេញលទ្ធផល ',
  //       end: 'End',
  //       lastPhaseText: 'Draw results of issue {lastPhaseNo}',
  //       endTimeText: 'End time of issue {currentPhaseNo}',
  //     },
  //     cambodia: {
  //       opening: 'កំពុងចាប់រង្វាន់',
  //       waiting: 'រង់ចាំចេញលទ្ធផល ',
  //       end: 'បញ្ចប់',
  //       lastPhaseText: 'លទ្ធផលរង្វាន់វគ្គទី {lastPhaseNo}',
  //       endTimeText: '{currentPhaseNo}ម៉ោងបញ្ចប់នៃការភ្នាល់',
  //     },
  //   },
  // },
  props: {
    countdownClass: {
      type: String,
      default: 'lucky-zodiac-countdown',
    },
    isFirst: {
      // 是否是刚进入页面
      type: Boolean,
    },
    isWaiting: {
      // 是否显示待开奖
      type: Boolean,
    },
    isRotating: Boolean, // 转盘是否正在旋转
    currentPhaseNo: {
      type: String,
      default: '',
    }, // 当前奖期号码
    remainingTime: {
      type: Number,
      default: 0,
    }, // 剩余时间
  },
  emits: ['remaining-time-change', 'countdown-end'],
  data() {
    return {
      remain: null,
      remainFormat: 0,
      interval: null,
    };
  },
  watch: {
    remainingTime() {
      this.setCountdownInterval();
    },
    isRotating() {
      // console.log(val,9090)
    },
  },
  mounted() {
    console.log('endTimeText', this.$t('msg.endTimeText'));
    this.setCountdownInterval();
  },
  beforeUnmount() {
    if (this.interval) {
      // console.log(`${this.$options.name}: clear interval beforeDestroy`)
      clearInterval(this.interval);
    }
  },
  methods: {
    setCountdownInterval() {
      if (this.interval) {
        // console.log(`${this.$options.name}: clear interval`)
        clearInterval(this.interval);
      }

      this.remain = this.remainingTime;

      this.remainFormat = this.getRemainFormat();

      this.lastDate = new Date(); // 记录开始时间
      // console.log(`${this.$options.name}: set interval`)
      this.interval = setInterval(() => {
        // 计算剩余时间，减去经过的时间
        this.remain -= new Date() - this.lastDate;
        this.$emit('remaining-time-change', this.remain);

        if (this.remain > 0) {
          this.lastDate = new Date();

          this.remainFormat = this.getRemainFormat();
        } else {
          // console.log(`${this.$options.name}: clear interval`)
          clearInterval(this.interval);
          this.$emit('countdown-end');
        }
      }, 1000);
    },
    getRemainFormat() {
      const h = Math.floor(this.remain / 1000 / 60 / 60).toString();
      const m = Math.floor((this.remain / 1000 / 60) % 60).toString();
      const s = Math.floor((this.remain / 1000) % 60).toString();
      const hh = h.length < 2 ? `0${h}` : h;
      const mm = m.length < 2 ? `0${m}` : m;
      const ss = s.length < 2 ? `0${s}` : s;

      return `${(h > 0 ? `${hh} : ` : '') + mm} : ${ss}`;
    },
  },
};
</script>

<style lang="less" scoped>
.lucky-zodiac-countdown {
  margin: -2.4vw auto 0;
  padding: 2.13vw 0 1.73vw;
  width: 45.3vw;
  height: 12vw;
  border-radius: 0.93vw;
  text-align: center;
  background: rgba(39, 32, 51, 0.8);
  span {
    display: block;
    font-size: 3.2vw;
    color: #fafeff;
    line-height: 3.2vw;
  }
  strong {
    display: block;
    font-size: 4.53vw;
    color: #ff0000;
    line-height: 6.53vw;
  }
}
.lottery-countdown {
  display: flex;
  justify-content: center;
  height: 35px;
  background: #ffffff;
  line-height: 35px;

  span {
    margin-right: 8px;
    font-size: 14px;
    color: #333333;
  }
  strong {
    font-size: 18px;
    color: #ff090b;
  }
}
.special-zodiac-countdown {
  min-width: 47.3vw;
  > span {
    display: block;
    margin-top: 4vw;
    padding: 1px 0 1px 1px;
    min-width: 47.3vw;
    height: 5.33vw;
    font-size: 3.2vw;
    font-weight: 600;
    border-radius: 2.4vw 0vw 0vw 2.93vw;
    // white-space:nowrap;
    // overflow: hidden;
    text-indent: 2vw;
    color: #fafeff;
    background-clip: content-box, padding-box;
    line-height: 5.33vw;
    background-image: linear-gradient(#2e2e2e, #2e2e2e), linear-gradient(-90deg, #67481b, #f2c65a, #6a4a1b);
    box-sizing: border-box;
    // background: #191A1E;
    // border: 0.27vw solid;
    // border-image: linear-gradient(-90deg, #67481B, #F2C65A, #6A4A1B) 10 10;
    // border-radius: 2.4vw 0vw 0vw 2.93vw;
    // padding: 0 2vw;
    // clip-path: inset(0 round 2.4vw);
  }
  > strong {
    display: block;
    margin-top: 2.67vw;
    font-size: 4.53vw;
    text-align: center;
    // font-weight: 400;
    color: #ff0000;
  }
}
</style>
